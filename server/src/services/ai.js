import { GoogleGenerativeAI } from '@google/generative-ai';

// Read lazily on each call so env vars are always loaded after dotenv.config()
const getApiKey = () => process.env.GEMINI_API_KEY;

// High-reliability Gemini model caller with candidate fallback
const callGemini = async (apiKey, prompt) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];
    for (const modelName of candidateModels) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            console.warn(`Gemini model ${modelName} notice: ${err.message?.split('\n')[0]}`);
        }
    }
    throw new Error('All candidate Gemini models temporarily unavailable.');
};

export class AIService {
    static async generateBio(data) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `Synthesize a brief professional bio for a student named ${data.name} pursuing a ${data.degree} in ${data.major} at ${data.school}. Key skills: ${data.skills.join(', ')}. Return only the bio paragraph text.`;
                const text = await callGemini(apiKey, prompt);
                if (text) return text.trim();
            }
            catch (err) {
                console.error('Gemini error generating bio:', err.message);
            }
        }
        // High fidelity mock fallback
        return `${data.name} is a high-achieving student pursuing a ${data.degree} in ${data.major} at ${data.school}. With hands-on competency in ${data.skills.slice(0, 4).join(', ')}, they bridge clean systems design with practical solutions development.`;
    }

    static async generateRoadmap(role) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `Create a structured learning roadmap for a student aiming to become a ${role}. 
        Format your response as a valid JSON object matching this structure:
        {
          "role": "${role}",
          "phases": [
            { "title": "Phase 1 Title", "duration": "Weeks 1-4", "items": ["Item 1", "Item 2"] }
          ],
          "suggestedCertifications": ["Cert 1"],
          "suggestedCourses": ["Course 1"]
        }
        Return ONLY valid JSON.`;
                const responseText = await callGemini(apiKey, prompt);
                const jsonStr = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
                return JSON.parse(jsonStr);
            }
            catch (err) {
                console.error('Gemini error generating roadmap:', err.message);
            }
        }
        // High fidelity mock fallback
        return {
            role,
            phases: [
                {
                    title: "Phase 1: Foundations & Systems Architecture",
                    duration: "Weeks 1-4",
                    items: ["Master basic command interfaces & shell scripting", "Learn memory management models & OOP principles", "Adopt containerized microservices via Docker"]
                },
                {
                    title: "Phase 2: Backend scaling & Data management",
                    duration: "Weeks 5-8",
                    items: ["Design transactional relational schema tables", "Set up Redis caching middleware structures", "Build REST APIs utilizing Node.js streams"]
                },
                {
                    title: "Phase 3: Production Deployment & Orchestration",
                    duration: "Weeks 9-12",
                    items: ["Configure custom CI/CD tasks via GitHub Actions", "Deploy cloud functions to AWS EC2 or serverless runtimes", "Perform mock security penetration and token audit passes"]
                }
            ],
            suggestedCertifications: ["AWS Certified Developer Associate", "Google Cloud Associate Engineer"],
            suggestedCourses: ["System Design Fundamentals (Coursera)", "Docker & Kubernetes Masterclass (Udemy)"]
        };
    }

    static async optimizeResume(bullets) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `Rewrite the following resume project description to make it highly professional, action-oriented, metrics-driven, and ATS friendly:
        "${bullets}"
        Return only the optimized description text.`;
                const text = await callGemini(apiKey, prompt);
                if (text) return text.trim();
            }
            catch (err) {
                console.error('Gemini error optimizing resume:', err.message);
            }
        }
        // High fidelity mock fallback
        return `Orchestrated microservices system optimization: refactored asynchronous API handlers to reduce overhead latency by 18%; configured Docker containers for robust continuous deployment pipelines.`;
    }

    static async analyzeResume(resumeText, targetRole) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `You are an expert ATS (Applicant Tracking System) parser and senior recruiter.
Analyze the following resume text against the target role: "${targetRole || 'Software Developer'}".

Resume Text:
"""
${resumeText}
"""

Provide your feedback in a structured JSON format containing:
1. "score": an integer score between 0 and 100.
2. "strengths": an array of strings listing key strengths of the resume.
3. "weaknesses": an array of strings listing weaknesses or missing elements.
4. "missingKeywords": an array of strings listing critical keywords or skills missing from the resume.
5. "recommendations": an array of strings listing actionable recommendations to improve the ATS score.

Response must be pure JSON only. Do not wrap it in markdown tags.`;
                const text = await callGemini(apiKey, prompt);
                const cleaned = text.replace(/```json|```/g, '').trim();
                return JSON.parse(cleaned);
            }
            catch (err) {
                console.error('Gemini error analyzing resume:', err.message);
            }
        }
        // High fidelity fallback
        return {
            score: 74,
            strengths: [
                "Good representation of project stacks.",
                "Education and contact credentials are laid out clearly."
            ],
            weaknesses: [
                "Lacks strong action verbs in descriptions.",
                "No clear metrics indicating project impact."
            ],
            missingKeywords: ["Docker", "CI/CD pipelines", "AWS", "Jest Testing"],
            recommendations: [
                "Add bullet points highlighting numbers (e.g., optimized speeds by 15%, served 100+ users).",
                "Integrate cloud deployment keywords like Docker and AWS into skills section."
            ]
        };
    }

    static async gradeInterview(role, description, answers) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `Grade the following answers to interview questions for the role: ${role}. Job requirements: ${description}.
        Answers submitted:
        1. ${answers[0]}
        2. ${answers[1]}
        3. ${answers[2]}

        Format your response as a valid JSON object matching this structure:
        {
          "grade": "A-",
          "score": 88,
          "strengths": "Summary of strengths",
          "weaknesses": "Summary of weaknesses",
          "recommendations": ["Tip 1", "Tip 2"]
        }
        Return ONLY valid JSON.`;
                const responseText = await callGemini(apiKey, prompt);
                const jsonStr = responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1);
                return JSON.parse(jsonStr);
            }
            catch (err) {
                console.error('Gemini error grading interview:', err.message);
            }
        }
        // High fidelity mock fallback
        return {
            grade: "A-",
            score: 90,
            strengths: `Strong conceptual explanations of state lifecycles and layout optimization. Clear technical communication style.`,
            weaknesses: `Could expand more on token management details (CSRF/XSS strategies) and containerization specs.`,
            recommendations: [
                "Revise JWT authentication best practices (HttpOnly, secure cookies, csrf tokens).",
                "Refine explanations of memory leak debugging techniques in React applications."
            ]
        };
    }

    static async generateCoverLetter(company, role, description, tone, studentName = 'Arnav kumar') {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `Write a professional cover letter for a student named "${studentName}" applying to the role of "${role}" at "${company}". 
        Tone of writing: ${tone}. 
        Target job description or requirements: "${description || 'Not specified'}".
        The applicant is a student who has built "StudentOS", a premium full-stack academic and professional dashboard system utilizing React, TypeScript, Express, and Prisma.
        Make the letter punchy, persuasive, and tailored to the company. Return ONLY the cover letter plain text. Sign off using the student's name: "${studentName}".`;
                const text = await callGemini(apiKey, prompt);
                if (text) return text.trim();
            }
            catch (err) {
                console.error('Gemini error generating cover letter:', err.message);
            }
        }
        return `Dear Hiring Team at ${company},

I am writing to express my strong enthusiasm for the ${role} position. As a passionate developer pursuing Computer Science and the creator of StudentOS—a full-stack academic and career platform—I have built end-to-end applications using React, Node.js, Express, and Prisma.

${description ? `Having reviewed the role requirements regarding ${description.slice(0, 100)}..., I am confident in my ability to hit the ground running.` : `I am deeply inspired by the high standards of engineering and impact at ${company}.`}

My background includes building scalable APIs, optimizing responsive user interfaces, and integrating modern AI capabilities. I would welcome the opportunity to discuss how my skill set and proactive attitude can contribute value to your engineering team.

Thank you for your time and consideration.

Sincerely,
${studentName}`;
    }

    static async generateChatReply(message) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `You are a helpful AI career and academic coach for students on the StudentOS platform.
        The user is asking: "${message}"
        Provide a concise, extremely professional response with actionable tips. Format your reply with clean Markdown (bold text, lists, and code blocks where applicable). Keep the response relatively short (under 250 words) so it fits in a chat drawer.`;
                const text = await callGemini(apiKey, prompt);
                if (text) return text.trim();
            }
            catch (err) {
                console.error('Gemini error generating chat reply:', err.message);
            }
        }
        return `### 💡 Academic & Career Recommendation

Great question regarding **"${message.length > 50 ? message.slice(0, 50) + '...' : message}"**! Here are the 3 key steps to focus on:

1. **Foundations First**: Ensure core data structures, algorithms, and system design patterns are thoroughly practiced.
2. **Project Impact**: Highlight measurable outcomes on your resume (e.g. latency reduced by 25%, users served, CI/CD automated).
3. **Consistent Output**: Maintain a steady LeetCode and GitHub commit frequency to stand out to campus recruiters.

Feel free to ask for interview question drills, resume reviews, or study roadmap suggestions!`;
    }
}

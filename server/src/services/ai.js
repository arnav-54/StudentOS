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

    static async analyzeResume(resumeText, targetRole = 'Software Developer') {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `You are a strict senior technical recruiter and Applicant Tracking System (ATS) evaluator.
Analyze the following candidate resume text strictly against the target position: "${targetRole}".

Resume Text:
"""
${resumeText.slice(0, 4000)}
"""

Evaluate relevance to ${targetRole}, presence of measurable impact/metrics, action verbs, and key technical stack depth.
Provide your response strictly as valid JSON matching this schema:
{
  "score": <integer between 40 and 96 based on match accuracy>,
  "strengths": [<3-4 specific strengths found in this exact resume>],
  "weaknesses": [<2-3 specific weaknesses or missing technical elements for ${targetRole}>],
  "missingKeywords": [<4-6 critical technical keywords expected for ${targetRole} missing from resume>],
  "recommendations": [<2-3 actionable advice items to increase ATS match rate>]
}
Return pure JSON only.`;
                const text = await callGemini(apiKey, prompt);
                const firstBrace = text.indexOf('{');
                const lastBrace = text.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) {
                    const jsonStr = text.substring(firstBrace, lastBrace + 1);
                    const parsed = JSON.parse(jsonStr);
                    if (parsed && typeof parsed.score === 'number') {
                        return parsed;
                    }
                }
            }
            catch (err) {
                console.error('Gemini error analyzing resume:', err.message);
            }
        }

        // Dynamic tailored evaluation based on actual resume text and target role
        const lower = (resumeText || '').toLowerCase();
        const roleSkillsMap = {
            'Software Developer': ['git', 'data structures', 'algorithms', 'api', 'testing', 'docker', 'ci/cd', 'databases', 'system design'],
            'Frontend Engineer': ['react', 'typescript', 'css', 'javascript', 'html', 'next.js', 'responsive', 'ui/ux', 'performance'],
            'Backend Engineer': ['node.js', 'express', 'databases', 'sql', 'mongodb', 'docker', 'redis', 'microservices', 'rest api'],
            'Data Analyst': ['python', 'sql', 'excel', 'pandas', 'tableau', 'power bi', 'visualization', 'statistics', 'etl'],
            'DevOps Cloud Engineer': ['aws', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'linux', 'cloud', 'monitoring', 'bash'],
            'AI/ML Scientist': ['python', 'pytorch', 'tensorflow', 'machine learning', 'deep learning', 'pandas', 'numpy', 'nlp', 'scikit-learn'],
            'Mobile App Developer': ['react native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'mobile', 'api', 'redux'],
            'Solutions Architect': ['aws', 'architecture', 'microservices', 'cloud', 'scalability', 'security', 'system design', 'kubernetes']
        };

        const targetKeywords = roleSkillsMap[targetRole] || roleSkillsMap['Software Developer'];
        const matched = targetKeywords.filter(k => lower.includes(k));
        const missing = targetKeywords.filter(k => !lower.includes(k));

        const hasMetrics = /\d+[\s%]+|\d+\+/.test(resumeText);
        const hasActionVerbs = /engineered|developed|built|orchestrated|spearheaded|optimized|implemented|architected/i.test(resumeText);
        const wordCount = resumeText.trim().split(/\s+/).length;

        let calculatedScore = 55;
        calculatedScore += Math.min(25, Math.round((matched.length / targetKeywords.length) * 25));
        if (hasMetrics) calculatedScore += 8;
        if (hasActionVerbs) calculatedScore += 7;
        if (wordCount > 150) calculatedScore += 5;
        calculatedScore = Math.min(94, Math.max(48, calculatedScore));

        const dynamicStrengths = [];
        if (matched.length > 0) dynamicStrengths.push(`Matches essential ${targetRole} technologies: ${matched.slice(0, 3).join(', ')}.`);
        if (hasActionVerbs) dynamicStrengths.push('Uses active engineering verbs (e.g. engineered, implemented, built).');
        if (hasMetrics) dynamicStrengths.push('Demonstrates quantitative indicators and project metrics.');
        if (dynamicStrengths.length < 2) dynamicStrengths.push(`Clearly articulates academic background relevant to technical engineering.`);

        const dynamicWeaknesses = [];
        if (!hasMetrics) dynamicWeaknesses.push('Lacks quantitative achievements (e.g., % improvement, latency reduction, user volume).');
        if (missing.length > 0) dynamicWeaknesses.push(`Noticeable omission of standard ${targetRole} keywords: ${missing.slice(0, 3).join(', ')}.`);
        if (wordCount < 120) dynamicWeaknesses.push('Resume content appears relatively brief; expand upon key project contributions.');

        return {
            score: calculatedScore,
            strengths: dynamicStrengths,
            weaknesses: dynamicWeaknesses,
            missingKeywords: missing.slice(0, 5),
            recommendations: [
                `Integrate high-impact keywords for ${targetRole}: ${missing.slice(0, 3).join(', ')}.`,
                hasMetrics ? 'Highlight technical challenges overcome during system implementation.' : 'Quantify project bullets with verifiable figures (e.g., optimized speeds by 15%, served 50+ users).'
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

    static async generateSummary(data) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `Write an ATS-friendly, highly professional 2-3 sentence resume summary for a student/developer named ${data.name || 'Candidate'}.
Target Role: ${data.targetRole || 'Software Engineer'}.
Education: ${data.degree || 'B.S.'} in ${data.major || 'Computer Science'}.
Key Skills: ${Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || 'JavaScript, React, Node.js, Python')}.
Highlight problem-solving passion, core stack strengths, and eagerness to deliver impact. Return ONLY the plain text paragraph.`;
                const text = await callGemini(apiKey, prompt);
                if (text) return text.trim();
            } catch (err) {
                console.error('Gemini error generating summary:', err.message);
            }
        }
        return `Results-driven ${data.targetRole || 'Software Engineer'} and ${data.degree || 'Computer Science'} student proficient in ${Array.isArray(data.skills) ? data.skills.slice(0, 4).join(', ') : 'modern full-stack development'}. Experienced in building performant web applications, designing modular APIs, and applying clean coding principles to solve challenging real-world problems.`;
    }

    static async analyzeSkillGap(targetRole, currentSkills) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `You are a technical career advisor. Analyze the student's current skills against the target role: "${targetRole}".
Current Skills: "${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}".

Respond ONLY with a valid JSON object matching this structure:
{
  "current": ["Skill 1", "Skill 2"],
  "missing": ["Missing Skill 1", "Missing Skill 2", "Missing Skill 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
Do NOT include markdown formatting or extra text.`;
                const text = await callGemini(apiKey, prompt);
                const cleaned = text.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.current && parsed.missing) return parsed;
            } catch (err) {
                console.error('Gemini error analyzing skill gap:', err.message);
            }
        }
        const defaultRoleSkills = {
            'Fullstack Developer': {
                current: ['React', 'Node.js', 'Express', 'JavaScript', 'MongoDB', 'HTML/CSS'],
                missing: ['Docker', 'AWS S3/EC2', 'CI/CD Pipelines', 'TypeScript', 'Redis'],
                recommendations: ['Incorporate containerization using Docker into your current projects', 'Migrate JavaScript codebases to TypeScript for enterprise readiness']
            },
            'DevOps Cloud Engineer': {
                current: ['Node.js', 'Linux Basics', 'Git'],
                missing: ['Terraform', 'Kubernetes', 'Docker', 'AWS CloudFormation', 'Jenkins CI/CD'],
                recommendations: ['Build automated CI/CD pipelines with GitHub Actions', 'Deploy a multi-tier microservice on AWS ECS or EKS']
            },
            'AI / ML Engineer': {
                current: ['Python', 'SQL', 'JavaScript'],
                missing: ['PyTorch / TensorFlow', 'Pandas / NumPy', 'Scikit-Learn', 'Gemini / OpenAI API Integration', 'Vector Databases (Pinecone)'],
                recommendations: ['Build end-to-end RAG workflows combining LangChain and Gemini', 'Train and fine-tune classification models using Scikit-Learn and PyTorch']
            },
            'Mobile App Developer': {
                current: ['React', 'JavaScript', 'CSS'],
                missing: ['React Native', 'Swift / Kotlin', 'App Store / Play Store deployment', 'Redux State Management'],
                recommendations: ['Convert your web applications into cross-platform React Native apps', 'Learn native bridging and offline data storage']
            }
        };
        return defaultRoleSkills[targetRole] || defaultRoleSkills['Fullstack Developer'];
    }

    static async generateMentorSprint(gpa, role, days) {
        const apiKey = getApiKey();
        if (apiKey) {
            try {
                const prompt = `You are an elite Silicon Valley technical recruiter and mentor.
Create a personalized ${days || 60}-day preparation sprint for a student with CGPA ${gpa || '8.5'} targeting the role: "${role || 'Fullstack Developer'}".

Respond ONLY with a valid JSON array matching this structure:
[
  { "week": "Week 1-2: Title", "tasks": ["Task 1", "Task 2", "Task 3"] },
  { "week": "Week 3-4: Title", "tasks": ["Task 1", "Task 2", "Task 3"] },
  { "week": "Week 5-6: Title", "tasks": ["Task 1", "Task 2", "Task 3"] },
  { "week": "Week 7-8: Title", "tasks": ["Task 1", "Task 2", "Task 3"] }
]
Do NOT include markdown formatting or extra text.`;
                const text = await callGemini(apiKey, prompt);
                const cleaned = text.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(cleaned);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (err) {
                console.error('Gemini error generating mentor sprint:', err.message);
            }
        }
        return [
            { week: 'Week 1-2: Core DSA & Problem Solving Foundation', tasks: ['Master Arrays, Hash Maps & Two Pointers on LeetCode', 'Complete 25 Easy and 15 Medium algorithmic patterns', 'Review time & space complexity trade-offs'] },
            { week: 'Week 3-4: Production-Grade Stack Mastery', tasks: [`Deepen competency in ${role} production patterns`, 'Build Docker container configurations for localized microservices', 'Implement database query indexing and caching with Redis'] },
            { week: 'Week 5-6: Capstone Project Engineering', tasks: ['Engineer a comprehensive full-stack capstone with secure JWT auth', 'Write comprehensive unit and integration tests', 'Deploy live with automated CI/CD and publish polished GitHub documentation'] },
            { week: 'Week 7-8: ATS Optimization & Mock Interviews', tasks: ['Complete 3 technical mock interview rounds in AI Hub', 'Optimize resume to achieve 90+ ATS score against target job descriptions', 'Actively track and apply to 15+ target company internship pipelines'] }
        ];
    }
}

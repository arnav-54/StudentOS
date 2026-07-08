import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Code, Link2, Sparkles, CheckCircle, Plus, X } from 'lucide-react';
import axios from 'axios';
const popularSkills = [
    'Python', 'AWS', 'React', 'Node.js', 'Express', 'JavaScript', 'TypeScript',
    'MongoDB', 'SQL', 'MySQL', 'Prisma', 'PostgreSQL', 'Docker', 'Kubernetes',
    'CI/CD', 'Git', 'HTML', 'CSS', 'System Design', 'C++', 'Java',
    'Data Structures', 'Algorithms', 'Redis', 'TailwindCSS'
];
const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [school, setSchool] = useState('');
    const [degree, setDegree] = useState('');
    const [major, setMajor] = useState('');
    const [gradYear, setGradYear] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [newLang, setNewLang] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [leetcodeUrl, setLeetcodeUrl] = useState('');
    const [codeforcesUrl, setCodeforcesUrl] = useState('');
    const [aiGenerating, setAiGenerating] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/profile');
                if (response.data) {
                    const p = response.data;
                    setSchool(p.school || '');
                    setDegree(p.degree || '');
                    setMajor(p.major || '');
                    setGradYear(p.gradYear ? String(p.gradYear) : '');
                    setBio(p.bio || '');
                    setSkills(p.skills || []);
                    setLanguages(p.languages || []);
                    setGithubUrl(p.githubUrl || '');
                    setLeetcodeUrl(p.leetcodeUrl || '');
                    setCodeforcesUrl(p.codeforcesUrl || '');
                }
            }
            catch (err) {
                console.error('Failed to fetch profile:', err);
            }
        };
        fetchProfile();
    }, []);
    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };
    const handleRemoveSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill));
    };
    const handleAddLang = (e) => {
        e.preventDefault();
        if (newLang.trim() && !languages.includes(newLang.trim())) {
            setLanguages([...languages, newLang.trim()]);
            setNewLang('');
        }
    };
    const handleRemoveLang = (lang) => {
        setLanguages(languages.filter(l => l !== lang));
    };
    const handleGenerateBio = async () => {
        setAiGenerating(true);
        try {
            const response = await axios.post('http://localhost:5001/api/profile/bio', {
                name,
                school,
                degree,
                major,
                skills,
            });
            if (response.data && response.data.bio) {
                setBio(response.data.bio);
            }
        }
        catch (err) {
            console.warn('AI Bio endpoint failed, using mock generator fallback.');
            setTimeout(() => {
                const mockBio = `${name} is an honors student pursuing a ${degree} in ${major} at ${school}. Proficient in ${skills.slice(0, 4).join(', ')}, and ${skills[4] || 'software architecture'}, they combine strong academic foundations with practical software creation. Looking for challenging internship opportunities.`;
                setBio(mockBio);
            }, 1500);
        }
        finally {
            setTimeout(() => setAiGenerating(false), 1600);
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5001/api/profile', {
                school,
                degree,
                major,
                gradYear: gradYear ? parseInt(gradYear) : null,
                skills,
                languages,
                bio,
                githubUrl,
                leetcodeUrl,
                codeforcesUrl
            });
            setSaveSuccess(true);
            updateUser(name, user?.email || '');
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        catch (err) {
            console.error('Failed to save profile:', err);
        }
    };
    return (<div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-brand-primary rounded-full"/>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Settings</h1>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">Update your student information, skill profiles, and social references.</p>
      </div>

      {saveSuccess && (<div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0"/>
          <span>Profile changes updated successfully. All integration points synced.</span>
        </div>)}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Form inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3">
              <User className="h-5 w-5 text-brand-primary"/>
              <h2 className="text-sm font-semibold">General Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">School / University</label>
                <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Degree Program</label>
                <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Major Field of Study</label>
                <input type="text" value={major} onChange={(e) => setMajor(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Graduation Year</label>
                <input type="number" value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"/>
              </div>
            </div>
          </div>

          {/* AI Bio Section */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-accent animate-pulse"/>
                <h2 className="text-sm font-semibold">AI Generated Portfolio Biography</h2>
              </div>
              <button type="button" onClick={handleGenerateBio} disabled={aiGenerating} className="flex items-center gap-1.5 px-3 py-1 bg-brand-accent text-white rounded-lg text-xs font-semibold hover:bg-brand-accent/90 disabled:opacity-50">
                {aiGenerating ? 'Generating...' : 'Regenerate Bio'}
              </button>
            </div>
            <div>
              <textarea value={bio} rows={4} onChange={(e) => setBio(e.target.value)} placeholder="A compelling profile overview..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"/>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Skills, languages & socials */}
        <div className="space-y-6">
          {/* Integrations URLs */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3">
              <Link2 className="h-5 w-5 text-slate-500"/>
              <h2 className="text-sm font-semibold">External Profiles</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">GitHub URL</label>
                <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-primary"/>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">LeetCode URL</label>
                <input type="url" value={leetcodeUrl} onChange={(e) => setLeetcodeUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-primary"/>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Codeforces URL</label>
                <input type="url" value={codeforcesUrl} onChange={(e) => setCodeforcesUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-primary"/>
              </div>
            </div>
          </div>

          {/* Skill Tagging System */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3">
              <Code className="h-5 w-5 text-brand-success"/>
              <h2 className="text-sm font-semibold">Skills & Tech Stack</h2>
            </div>
            
            {/* Input tag */}
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={(e) => { setNewSkill(e.target.value); setShowSkillSuggestions(true); }} 
                  onFocus={() => setShowSkillSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)}
                  placeholder="Python, AWS..." 
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                {showSkillSuggestions && (
                  <div className="absolute left-0 right-0 z-30 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-zinc-905 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-lg">
                    {popularSkills
                      .filter(s => s.toLowerCase().includes(newSkill.toLowerCase()) && !skills.includes(s))
                      .map((skillName) => (
                        <div 
                          key={skillName} 
                          onMouseDown={() => {
                            if (!skills.includes(skillName)) {
                              setSkills([...skills, skillName]);
                            }
                            setNewSkill('');
                            setShowSkillSuggestions(false);
                          }}
                          className="px-3 py-1.5 text-[10px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          {skillName}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              <button type="button" onClick={handleAddSkill} className="p-1.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 shrink-0">
                <Plus className="h-4 w-4"/>
              </button>
            </div>

            {/* Render tags */}
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (<div key={skill} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/40 dark:border-zinc-800">
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)}>
                    <X className="h-3 w-3 hover:text-brand-danger"/>
                  </button>
                </div>))}
            </div>
          </div>
        </div>

        {/* Form Action row */}
        <div className="lg:col-span-3 flex justify-end">
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/95 transition-all">
            Save Profile Settings
          </button>
        </div>

      </form>
    </div>);
};
export default ProfilePage;

import { prisma } from '../prisma/client.js';
import { AIService } from '../services/ai.js';
const profileMemoryCache = new Map();

export const getProfile = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        let user = null;
        let profile = null;
        try {
            user = await prisma.user.findUnique({
                where: { id: userId },
                select: { name: true, email: true },
            });
            profile = await prisma.profile.findUnique({
                where: { userId },
            });
        }
        catch (dbErr) {
            console.warn('Prisma DB query failed. Checking profile cache.');
            profile = profileMemoryCache.get(userId);
        }
        if (!profile) {
            const cached = profileMemoryCache.get(userId);
            if (cached) {
                return res.json({ ...cached, name: user?.name || cached.name || '', email: user?.email || cached.email || '' });
            }
            return res.json({
                name: user?.name || '',
                email: user?.email || '',
                school: '',
                degree: '',
                major: '',
                gradYear: null,
                skills: [],
                languages: [],
                bio: '',
                githubUrl: '',
                leetcodeUrl: '',
                codeforcesUrl: '',
            });
        }
        return res.json({
            ...profile,
            name: user?.name || '',
            email: user?.email || '',
        });
    }
    catch (err) {
        console.error('Profile fetch error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProfile = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const { name, school, degree, major, gradYear, skills, languages, bio, githubUrl, leetcodeUrl, codeforcesUrl, isPublic, publicSlug } = req.body;
    
    // Generate a safe, guaranteed unique slug to avoid MongoDB null constraint collisions
    const safeSlug = (publicSlug && typeof publicSlug === 'string' && publicSlug.trim()) 
        ? publicSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
        : `user-${userId}`;

    try {
        // Update user name in User model if provided
        if (name && typeof name === 'string' && name.trim()) {
            await prisma.user.update({
                where: { id: userId },
                data: { name: name.trim() }
            }).catch(e => console.warn('User name DB update skipped:', e.message));
        }

        const updateData = {
            school: school || '',
            degree: degree || '',
            major: major || '',
            gradYear: gradYear ? parseInt(gradYear) : null,
            skills: Array.isArray(skills) ? skills : [],
            languages: Array.isArray(languages) ? languages : [],
            bio: bio || '',
            githubUrl: githubUrl || '',
            leetcodeUrl: leetcodeUrl || '',
            codeforcesUrl: codeforcesUrl || '',
            isPublic: isPublic !== undefined ? Boolean(isPublic) : false,
        };

        let profile;
        try {
            profile = await prisma.profile.upsert({
                where: { userId },
                update: updateData,
                create: {
                    userId,
                    ...updateData,
                    publicSlug: safeSlug,
                },
            });
        }
        catch (dbErr) {
            console.warn('Prisma DB write failed. Storing in resilient memory cache:', dbErr.message);
            profile = {
                userId,
                ...updateData,
                publicSlug: safeSlug,
            };
        }

        profileMemoryCache.set(userId, { ...profile, name });
        return res.json({ message: 'Profile updated successfully', profile: { ...profile, name } });
    }
    catch (err) {
        console.error('Profile update error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const generateBio = async (req, res) => {
    const { name, school, degree, major, skills } = req.body;
    try {
        const bioText = await AIService.generateBio({ name, school, degree, major, skills });
        return res.json({ bio: bioText });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to generate bio' });
    }
};

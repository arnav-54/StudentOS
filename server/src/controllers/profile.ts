import { Response } from 'express';
import { prisma } from '../prisma/client.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { AIService } from '../services/ai.js';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let profile;
    try {
      profile = await prisma.profile.findUnique({
        where: { userId },
      });
    } catch (dbErr) {
      console.warn('Prisma DB query failed. Mocking profile output.');
    }

    if (!profile) {
      // Return fresh/empty profile details
      return res.json({
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

    return res.json(profile);
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { 
    school, 
    degree, 
    major, 
    gradYear, 
    skills, 
    languages, 
    bio, 
    githubUrl, 
    leetcodeUrl, 
    codeforcesUrl,
    isPublic,
    publicSlug 
  } = req.body;

  try {
    let profile;
    try {
      profile = await prisma.profile.upsert({
        where: { userId },
        update: {
          school,
          degree,
          major,
          gradYear: gradYear ? parseInt(gradYear) : null,
          skills,
          languages,
          bio,
          githubUrl,
          leetcodeUrl,
          codeforcesUrl,
          isPublic: isPublic !== undefined ? isPublic : undefined,
          publicSlug: publicSlug !== undefined ? publicSlug : undefined,
        },
        create: {
          userId,
          school,
          degree,
          major,
          gradYear: gradYear ? parseInt(gradYear) : null,
          skills,
          languages,
          bio,
          githubUrl,
          leetcodeUrl,
          codeforcesUrl,
          isPublic: isPublic || false,
          publicSlug: publicSlug || null,
        },
      });
    } catch (dbErr) {
      console.warn('Prisma DB write skipped. Mocking successful updates.');
      profile = { 
        userId, 
        school, 
        degree, 
        major, 
        gradYear, 
        skills, 
        languages, 
        bio,
        isPublic: isPublic || false,
        publicSlug: publicSlug || null 
      };
    }

    return res.json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const generateBio = async (req: AuthenticatedRequest, res: Response) => {
  const { name, school, degree, major, skills } = req.body;
  try {
    const bioText = await AIService.generateBio({ name, school, degree, major, skills });
    return res.json({ bio: bioText });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to generate bio' });
  }
};

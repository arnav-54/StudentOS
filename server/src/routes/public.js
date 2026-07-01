import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
// GET public portfolio by slug
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    if (!slug)
        return res.status(400).json({ message: 'Slug is required.' });
    try {
        const profile = await prisma.profile.findFirst({
            where: {
                publicSlug: slug,
                isPublic: true,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        timeline: true,
                        applications: {
                            where: {
                                status: 'offer' // Only show successful placements/offers on public profiles
                            }
                        },
                        documents: {
                            where: {
                                type: 'resume' // Only show resumes on public profiles
                            }
                        }
                    }
                }
            }
        });
        if (!profile) {
            return res.status(404).json({ message: 'Public portfolio not found.' });
        }
        return res.json({ profile });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to fetch public portfolio.' });
    }
});
export default router;

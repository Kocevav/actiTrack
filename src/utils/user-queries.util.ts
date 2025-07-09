import { prisma } from "@/utils/prisma";

export async function getUserProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isStrava: true,
    },
  });
}

export async function getUserWithStats(userId: string) {
  const user = await getUserProfile(userId);
  if (!user) return null;

  const [ownedEvents, eventParticipation, comments, followedBy, following] =
    await Promise.all([
      prisma.event.count({ where: { ownerId: userId } }),
      prisma.eventParticipation.count({ where: { userId: userId } }),
      prisma.comment.count({ where: { ownerId: userId } }),
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
    ]);

  return {
    user,
    stats: { 
      ownedEvents, 
      eventParticipation, 
      comments, 
      followedBy, 
      following 
    }
  };
}

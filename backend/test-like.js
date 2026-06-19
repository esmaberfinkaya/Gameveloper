const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Let's take the first user that has some posts
  const user = await prisma.user.findFirst({
    where: { posts: { some: {} } },
    include: { posts: true }
  });

  if (!user) {
    console.log("No user with posts found.");
    return;
  }

  const postId = user.posts[0].id;
  const targetUserId = user.id;
  const likerUserId = user.id; // self like just for test

  console.log(`Liking post ${postId} belonging to user ${targetUserId}`);

  // Create like
  await prisma.like.create({
    data: {
      userId: likerUserId,
      postId: postId
    }
  });

  // Now run the algorithm
  const userPosts = await prisma.post.count({ where: { userId: targetUserId } });
  const userProjects = await prisma.project.count({ where: { userId: targetUserId } });
  const userRoadmaps = await prisma.roadmap.count({ where: { userId: targetUserId } });
  
  const totalContent = userPosts + userProjects + userRoadmaps;
  
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: {
      posts: { include: { likes: true } },
      projects: { include: { likes: true } },
      roadmaps: { include: { likes: true } },
    }
  });
  
  let totalLikes = 0;
  targetUser.posts.forEach(p => totalLikes += p.likes.length);
  targetUser.projects.forEach(p => totalLikes += p.likes.length);
  targetUser.roadmaps.forEach(r => totalLikes += r.likes.length);

  let newScore = 0;
  if (totalContent > 0) {
    newScore = Math.min(100, Math.round((totalLikes / totalContent) * 10));
  }
  
  await prisma.user.update({
    where: { id: targetUserId },
    data: { trustScore: newScore }
  });

  console.log(`Trust score for ${targetUser.name} updated to ${newScore}`);
  console.log(`Total Likes: ${totalLikes}, Total Content: ${totalContent}`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

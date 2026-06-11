require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cyberpunk_super_secret_neon_key_2077';

app.use(express.json());

// API Healty Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Gameveloper API is running!' });
});

// Auth Katmanı: Kayıt Ol
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'E-posta, şifre ve kullanıcı adı (name) zorunludur.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Bu e-posta zaten kullanımda.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || 'GAMER',
      },
    });

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Katmanı: Giriş Yap
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-posta veya şifre eksik.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Giriş başarılı.', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sorular (Questions) Katmanı: Yeni Soru Sor
app.post('/api/questions', async (req, res) => {
  const { title, content, category, imageUrl, userId } = req.body;
  if (!title || !content || !category || !userId) {
    return res.status(400).json({ error: 'Başlık, içerik, kategori ve kullanıcı kimliği (userId) zorunludur.' });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        category,
        imageUrl,
        postType: 'QUESTION',
        userId: parseInt(userId, 10),
      },
    });

    res.status(201).json({ message: 'Soru başarıyla eklendi.', question: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sorular (Questions) Katmanı: Soruları Listele
app.get('/api/questions', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { postType: 'QUESTION' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, role: true, trustScore: true }
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, role: true, trustScore: true } }
          }
        }
      }
    });

    // Map comments to responses for frontend compatibility
    const questions = posts.map(post => {
      const { comments, ...rest } = post;
      return {
        ...rest,
        responses: comments
      };
    });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sorunlar (Issues) Katmanı: Sorunları Listele (Aynı format)
app.get('/api/issues', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { postType: 'QUESTION' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, role: true, trustScore: true }
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, role: true, trustScore: true } }
          }
        }
      }
    });

    const issues = posts.map(post => {
      const { comments, ...rest } = post;
      return {
        ...rest,
        responses: comments
      };
    });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sorular (Questions) Katmanı: Yanıt / Çözüm Ekle
app.post('/api/questions/:id/responses', async (req, res) => {
  const { id } = req.params;
  const { content, type, userId } = req.body;

  if (!content || !type || !userId) {
    return res.status(400).json({ error: 'İçerik, tip ve kullanıcı kimliği zorunludur.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
    if (type === 'SOLUTION' && user.role !== 'DEVELOPER') {
      return res.status(403).json({ error: 'Sadece geliştiriciler (DEVELOPER) çözüm sunabilir.' });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        type, // "COMMENT" or "SOLUTION"
        userId: parseInt(userId, 10),
        postId: parseInt(id, 10),
      },
      include: {
        user: { select: { id: true, name: true, role: true, trustScore: true } }
      }
    });

    res.status(201).json({ message: 'Yanıt başarıyla eklendi.', response: newComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sorular (Questions) Katmanı: Çözümü Onayla
app.patch('/api/questions/:questionId/responses/:responseId/accept', async (req, res) => {
  const { questionId, responseId } = req.params;
  const { userId } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(questionId, 10) } });
    if (post.userId !== parseInt(userId, 10)) {
      return res.status(403).json({ error: 'Sadece soruyu soran kişi çözümü onaylayabilir.' });
    }

    const comment = await prisma.comment.findUnique({ where: { id: parseInt(responseId, 10) } });
    if (comment.type !== 'SOLUTION') {
      return res.status(400).json({ error: 'Sadece çözüm önerileri onaylanabilir.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(responseId, 10) },
      data: { isAccepted: true },
    });

    await prisma.post.update({
      where: { id: parseInt(questionId, 10) },
      data: { isResolved: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: comment.userId },
      data: { trustScore: { increment: 25 } },
    });

    res.json({ message: 'Çözüm onaylandı! Geliştiriciye +25 Puan verildi.', response: updatedComment, trustScore: updatedUser.trustScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fikir Havuzu (Ideas) Katmanı: Listeleme
app.get('/api/ideas', async (req, res) => {
  const currentUserId = parseInt(req.query.userId, 10);
  try {
    const posts = await prisma.post.findMany({
      where: { postType: 'IDEA' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, role: true, trustScore: true } },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, role: true, trustScore: true } }
          }
        }
      }
    });

    const filteredIdeas = posts.map(post => {
      const filteredComments = post.comments.filter(c => {
        if (!c.isPrivate) return true;
        return currentUserId === post.userId || currentUserId === c.userId;
      });
      return { ...post, comments: filteredComments };
    });

    res.json(filteredIdeas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fikir Havuzu: Fikir Ekleme
app.post('/api/ideas', async (req, res) => {
  const { title, story, visuals, gameplay, category, userId } = req.body;
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content: story || '',
        story,
        visuals,
        gameplay,
        category,
        postType: 'IDEA',
        userId: parseInt(userId, 10)
      }
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fikir Havuzu: Yorum Ekleme
app.post('/api/ideas/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { content, isPrivate, userId } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        isPrivate: isPrivate || false,
        type: 'COMMENT',
        userId: parseInt(userId, 10),
        postId: parseInt(id, 10)
      }
    });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Keşfet (Explore) Katmanı: Karma Akış
app.get('/api/explore', async (req, res) => {
  const { filter, userId } = req.query;
  const currentUserId = parseInt(userId, 10);

  try {
    const user = currentUserId ? await prisma.user.findUnique({ where: { id: currentUserId } }) : null;
    const userRole = user ? user.role : 'GAMER';

    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, role: true, trustScore: true } },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true, role: true, trustScore: true } } }
        }
      }
    });

    let mappedFeed = posts.map(post => {
      const { comments, ...rest } = post;
      const filteredComments = comments.filter(c => {
        if (!c.isPrivate) return true;
        return currentUserId === post.userId || currentUserId === c.userId;
      });

      if (post.postType === 'QUESTION') {
        return {
          ...rest,
          feedType: 'QUESTION',
          responses: filteredComments
        };
      } else {
        return {
          ...rest,
          feedType: post.postType,
          comments: filteredComments
        };
      }
    });

    if (filter === 'unresolved') {
      mappedFeed = mappedFeed.filter(p => p.feedType === 'QUESTION' && !p.isResolved);
    } else if (filter === 'popular') {
      mappedFeed.sort((a, b) => {
        const scoreA = (a.responses?.length || 0) + (a.comments?.length || 0);
        const scoreB = (b.responses?.length || 0) + (b.comments?.length || 0);
        return scoreB - scoreA;
      });
    } else if (filter === 'newest') {
      mappedFeed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Sana Özel (For You)
      mappedFeed.sort((a, b) => {
        if (userRole === 'DEVELOPER') {
          const aPriority = (a.feedType === 'QUESTION' && !a.isResolved) ? 1 : 0;
          const bPriority = (b.feedType === 'QUESTION' && !b.isResolved) ? 1 : 0;
          if (aPriority !== bPriority) return bPriority - aPriority;
        } else {
          const aPriority = a.feedType === 'IDEA' ? 1 : 0;
          const bPriority = b.feedType === 'IDEA' ? 1 : 0;
          if (aPriority !== bPriority) return bPriority - aPriority;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    res.json(mappedFeed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proje Ortaklıkları (Partnerships) Katmanı: Listeleme
app.get('/api/partnerships', async (req, res) => {
  try {
    const partnerships = await prisma.partnership.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, role: true, trustScore: true } }
      }
    });
    res.json(partnerships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proje Ortaklıkları: Ekleme
app.post('/api/partnerships', async (req, res) => {
  const { title, description, requiredRole, isUrgent, userId } = req.body;
  if (!title || !description || !requiredRole || !userId) {
    return res.status(400).json({ error: 'Başlık, açıklama, aranan rol ve kullanıcı kimliği zorunludur.' });
  }

  try {
    const newPartnership = await prisma.partnership.create({
      data: {
        title,
        description,
        requiredRole,
        isUrgent: isUrgent || false,
        userId: parseInt(userId, 10)
      }
    });
    res.status(201).json(newPartnership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

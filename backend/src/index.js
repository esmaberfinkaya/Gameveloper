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
    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        category,
        imageUrl,
        userId: parseInt(userId, 10),
      },
    });

    // Kullanıcının Trust Score değerini 5 artır (İPTAL EDİLDİ - Sadece topluluk değerlendirmesi puan kazandırır)
    
    res.status(201).json({ message: 'Soru başarıyla eklendi.', question: newQuestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sorular (Questions) Katmanı: Soruları Listele
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, role: true, trustScore: true }
        },
        responses: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, role: true, trustScore: true } }
          }
        }
      }
    });
    res.json(questions);
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

    const newResponse = await prisma.questionResponse.create({
      data: {
        content,
        type,
        userId: parseInt(userId, 10),
        questionId: parseInt(id, 10),
      },
      include: {
        user: { select: { id: true, name: true, role: true, trustScore: true } }
      }
    });

    res.status(201).json({ message: 'Yanıt başarıyla eklendi.', response: newResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sorular (Questions) Katmanı: Çözümü Onayla
app.patch('/api/questions/:questionId/responses/:responseId/accept', async (req, res) => {
  const { questionId, responseId } = req.params;
  const { userId } = req.body;

  try {
    const question = await prisma.question.findUnique({ where: { id: parseInt(questionId, 10) } });
    if (question.userId !== parseInt(userId, 10)) {
      return res.status(403).json({ error: 'Sadece soruyu soran kişi çözümü onaylayabilir.' });
    }

    const response = await prisma.questionResponse.findUnique({ where: { id: parseInt(responseId, 10) } });
    if (response.type !== 'SOLUTION') {
      return res.status(400).json({ error: 'Sadece çözüm önerileri onaylanabilir.' });
    }

    const updatedResponse = await prisma.questionResponse.update({
      where: { id: parseInt(responseId, 10) },
      data: { isAccepted: true },
    });

    await prisma.question.update({
      where: { id: parseInt(questionId, 10) },
      data: { isResolved: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: response.userId },
      data: { trustScore: { increment: 25 } },
    });

    res.json({ message: 'Çözüm onaylandı! Geliştiriciye +25 Puan verildi.', response: updatedResponse, trustScore: updatedUser.trustScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

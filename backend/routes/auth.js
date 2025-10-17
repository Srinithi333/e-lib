const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req,res)=>{
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ message: 'Email already registered. Please login.' });
    // Allow any email to register
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      passwordHash: hash,
      // All new users get reader role by default
      role: 'user'
    });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name, email, role: user.role } });
  } catch(e){ res.status(500).json({ error: e.message }); }
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ message: 'Invalid creds' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({ message: 'Invalid creds' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch(e){ res.status(500).json({ error: e.message }); }
});

module.exports = router;

// dev-login: returns a JWT for a given email (creates user if missing)
router.post('/dev-login', async (req,res)=>{
  const { email, name='Dev User' } = req.body;
  try{
    // Allow any email for dev login in development
    const allow = true; // Always allow in dev environment

    const User = require('../models/User');
    const jwt = require('jsonwebtoken');
    let user = await User.findOne({ email });
    if(!user) user = await User.create({ name, email, passwordHash: 'dev', role: 'user' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch(e){ res.status(500).json({ error: e.message }); }
});

// seed sample data (dev only)
router.post('/seed', async (req,res)=>{
  try{
    // create sample user
    const User = require('../models/User');
    const u = await User.create({ name: 'Sample Admin', email: 'admin@local', passwordHash: 'seed', role: 'admin' });
    const Book = require('../models/Book');
    
    // Sample books with categories
    const sampleBooks = [
      {
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming',
        categories: ['a'],
        s3Key: 'local:programming.pdf',
        size: 1024
      },
      {
        title: 'Web Development Guide',
        description: 'Complete guide to web development',
        categories: ['b'],
        s3Key: 'local:webdev.pdf',
        size: 2048
      },
      {
        title: 'Data Structures',
        description: 'Understanding data structures',
        categories: ['c'],
        s3Key: 'local:datastructures.pdf',
        size: 1536
      },
      {
        title: 'Algorithms',
        description: 'Advanced algorithms explained',
        categories: ['d'],
        s3Key: 'local:algorithms.pdf',
        size: 1792
      },
      {
        title: 'Full Stack Development',
        description: 'Learn both frontend and backend',
        categories: ['a', 'b'],
        s3Key: 'local:fullstack.pdf',
        size: 2560
      }
    ];

    // Create all sample books
    const books = await Promise.all(
      sampleBooks.map(book => Book.create({
        ...book,
        uploadedBy: u._id
      }))
    );
    res.json({ ok:true, user:u, book:b });
  } catch(e){ res.status(500).json({ error: e.message }); }
});

module.exports = router;

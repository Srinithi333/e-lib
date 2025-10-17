const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const AccessLog = require('../models/AccessLog');
const { s3, getPresignedUrl } = require('../services/s3');
const router = express.Router();
const upload = multer();

// list/search
router.get('/', auth, async (req,res)=>{
  const { page=1, q='' } = req.query;
  const PAGE = parseInt(page,10);
  const docs = await Book.find({ title: { $regex: q, $options:'i' }})
    .skip((PAGE-1)*12).limit(12).sort({ createdAt:-1 });
  res.json(docs);
});

// get single
router.get('/:id', auth, async (req,res)=>{
  const doc = await Book.findById(req.params.id);
  if(!doc) return res.status(404).json({ msg: 'Not found' });
  res.json(doc);
});

// upload (admin)
router.post('/upload', auth, upload.single('file'), async (req,res)=>{
  if(req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });
  const file = req.file;
  if(!file) return res.status(400).json({ message: 'File required' });
  const key = `pdfs/${Date.now()}_${file.originalname}`;
  try {
    await s3.putObject({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise();
    const book = await Book.create({
      title: req.body.title || file.originalname,
      description: req.body.description,
      authors: req.body.authors ? req.body.authors.split(',') : [],
      categories: req.body.categories ? req.body.categories.split(',') : [],
      s3Key: key,
      uploadedBy: req.user.id,
      size: file.size
    });
    res.json(book);
  } catch(err){ res.status(500).json({ error: err.message }); }
});

// presign
router.get('/:id/presign', auth, async (req,res)=>{
  try {
    const book = await Book.findById(req.params.id);
    if(!book) return res.status(404).json({ msg: 'Not found' });
    // Allow any authenticated user to access PDFs
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) return res.status(403).json({ message: 'User not found' });
    // if s3Key starts with 'local:' serve from local /pdfs
    if(book.s3Key && book.s3Key.startsWith('local:')){
      const fname = book.s3Key.replace('local:','');
      const url = `${req.protocol}://${req.get('host')}/pdfs/${fname}`;
      await AccessLog.create({ bookId: book._id, userId: req.user.id, action: 'view', ip: req.ip });
      return res.json({ url, expiresIn: 3600 });
    }
    const url = await getPresignedUrl(process.env.S3_BUCKET, book.s3Key, 120);
    await AccessLog.create({ bookId: book._id, userId: req.user.id, action: 'view', ip: req.ip });
    res.json({ url, expiresIn: 120 });
  } catch(e){ res.status(500).json({ error: e.message }); }
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const app = express();
app.use(cors());
app.use(express.json());

// serve local PDFs from backend/public/pdfs as /pdfs/*
const path = require('path');
app.use('/pdfs', express.static(path.join(__dirname, 'public', 'pdfs')));

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> {
    console.log('Mongo connected');
    app.listen(PORT, ()=> console.log(`Server running ${PORT}`));
  })
  .catch(err => console.error(err));

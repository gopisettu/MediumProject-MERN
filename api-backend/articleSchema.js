const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  datePosted: { type: Date, default: Date.now }
});

const Article = mongoose.model('UserArticle', articleSchema);

module.exports = Article;

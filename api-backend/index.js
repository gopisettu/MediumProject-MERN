require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./userSchema');
const Article = require('./articleSchema');

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// MongoDB Connection
const uri = "mongodb+srv://gopsettu3011:Gopi2004@secondmediumcluster.dsgewtu.mongodb.net/?retryWrites=true&w=majority&appName=secondMediumCluster"; // Update with your MongoDB URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes

// Routes
app.post('/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: `${newUser.userName} has been created` });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user: ' + error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { userName, userPassword } = req.body;
    const user = await User.findOne({ userName, userPassword });

    if (user) {
      req.session.userId = user._id;
      res.json({ message: 'Login successful', userId: user._id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in: ' + error.message });
  }
});
// Assuming you're using Express
app.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (user) {
      // Counting the number of articles posted by the user
      const postCount = await Article.countDocuments({ userId: user._id });

      res.json({
        userName: user.userName,
        _id: user._id,
        postCount: postCount
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data: ' + error.message });
  }
});








app.get('/articles/get', async (req, res) => {
  try {
    const { userId, page = 1, limit = 25 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: 'Invalid page or limit value' });
    }

    const skip = (pageNum - 1) * limitNum;

    const query = userId ? { userId } : {};
    const articles = await Article.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ datePosted: -1 });

    const userIds = [...new Set(articles.map(article => article.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).lean();

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.userName;
      return acc;
    }, {});

    const articlesWithUserNames = articles.map(article => ({
      ...article.toObject(),
      userName: userMap[article.userId.toString()] || 'Unknown'
    }));

    res.json(articlesWithUserNames);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching articles: ' + error.message });
  }
});

app.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/postArticle', async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({ message: 'User ID, title, and content are required' });
    }

    const newArticle = new Article({
      userId,
      title,
      content,
    });

    await newArticle.save();
    res.json({ message: 'Article posted successfully' });
  } catch (error) {
    console.error('Error posting article:', error.message);
    res.status(500).json({ error: 'Error posting article: ' + error.message });
  }
});

app.delete('/deleteArticle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error.message);
    res.status(500).json({ error: 'Error deleting article: ' + error.message });
  }
});

app.put('/updateArticle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.title = title;
    article.content = content;
    await article.save();

    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error.message);
    res.status(500).json({ error: 'Error updating article: ' + error.message });
  }
});


// Start the server
app.listen(4321, () => {
  console.log(`Backend connected on port 4321`);
});

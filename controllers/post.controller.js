import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!content) {
      return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    const newPost = new Post({ userId, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating post.' });
  }
};

export const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userAndConnectionsIds = [user._id, ...user.connections];

    const feedPosts = await Post.find({ userId: { $in: userAndConnectionsIds } })
      .populate('userId', 'name') // Show the name of the post author
      .sort({ createdAt: -1 }); // Show newest posts first

    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching feed.' });
  }
};
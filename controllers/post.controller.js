import Post from '../models/Post.js';
import User from '../models/User.js';

// CREATE a new post (Existing function)
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    const newPost = new Post({ userId, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating post.' });
  }
};

// READ the user's feed (Existing function)
export const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userAndConnectionsIds = [user._id, ...user.connections];

    const feedPosts = await Post.find({ userId: { $in: userAndConnectionsIds } })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching feed.' });
  }
};

// UPDATE a post (New function)
export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { content }, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating post.' });
  }
};

// DELETE a post (New function)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting post.' });
  }
};
import Post from "../models/Post.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const mediaFiles = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const post = new Post({
      content: req.body.content,
      media: mediaFiles, // Array of image/video paths
      postedBy: req.user.id,
    });

    await post.save();
    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get feed
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.postedBy.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    // Update content
    post.content = req.body.content || post.content;

    // If new media is uploaded, replace old
    if (req.files && req.files.length > 0) {
      post.media = req.files.map(f => `/uploads/${f.filename}`);
    }

    await post.save();
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.postedBy.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    await post.deleteOne();
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Comment = require("../models/Comment");

// Add comment
const addComment = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const existing = await Comment.findOne({
      recipe: req.params.id,
      user: req.user.id,
    });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this recipe" });
    }
    const newComment = await Comment.create({
      recipe: req.params.id,
      user: req.user.id,
      comment,
      rating,
    });
    const populated = await newComment.populate("user", "name photoURL");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a recipe
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.id })
      .populate("user", "name photoURL")
      .sort({ createdAt: -1 });

    const avgRating =
      comments.length > 0
        ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
        : null;

    res.status(200).json({ comments, avgRating, total: comments.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments, deleteComment };
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  content: {
    type: String,
    required: [true, "Please add content"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: [
      "sexual education",
      "reproductive health",
      "STI awareness",
      "contraception",
      "relationship",
      "other",
    ],
    required: [true, "Please select a category"],
  },
  tags: [String],
  featuredImage: {
    type: String,
    default: "default-blog.jpg",
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  publishedDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from title for URL
BlogSchema.pre("save", function (next) {
  if (this.status === "published" && !this.publishedDate) {
    this.publishedDate = Date.now();
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);

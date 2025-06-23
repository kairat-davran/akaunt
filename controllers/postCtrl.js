const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');
const Users = require('../models/userModel');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;

      if (images.length === 0)
        return res.status(400).json({ msg: "Please add your photo." });

      const newPost = new Posts({
        content,
        images,
        user: req.user._id
      });

      await newPost.save();

      res.json({
        msg: 'Created Post!',
        newPost: {
          ...newPost._doc,
          user: req.user
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPosts: async (req, res) => {
    try {
      const features = new APIfeatures(Posts.find({
        user: [...req.user.following, req.user._id]
      }), req.query).paginating();

      const posts = await features.query.sort('-createdAt')
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password"
          }
        });

      res.json({
        msg: 'Success!',
        result: posts.length,
        posts
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;

      const post = await Posts.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: "Post not found" });

      const oldImages = post.images;
      const updatedImages = images;

      const oldUrls = oldImages.map(img => img.url);
      const newUrls = updatedImages.map(img => img.url);

      const removedImages = oldUrls.filter(url => !newUrls.includes(url));

      const bucket = process.env.AWS_BUCKET_NAME || 'akaunt-media';

      for (const url of removedImages) {
        if (url && url.includes('.amazonaws.com/')) {
          const key = url.split('.amazonaws.com/')[1];
          if (key) {
            try {
              await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
              console.log(`🗑 Deleted from S3: ${key}`);
            } catch (err) {
              console.warn(`⚠️ Failed to delete ${key} from S3:`, err.message);
            }
          }
        }
      }

      const updatedPost = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { content, images: updatedImages },
        { new: true }
      )
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password"
          }
        });

      res.json({
        msg: "Updated Post!",
        newPost: updatedPost
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id });

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      await Comments.deleteMany({ _id: { $in: post.comments } });

      const bucket = process.env.AWS_BUCKET_NAME || 'akaunt-media';

      if (post.images && post.images.length > 0) {
        for (const image of post.images) {
          if (image.url && image.url.includes(bucket)) {
            const key = image.url.split('.amazonaws.com/')[1];
            if (key) {
              try {
                await s3.send(new DeleteObjectCommand({
                  Bucket: bucket,
                  Key: key
                }));
                console.log(`✅ Deleted from S3: ${key}`);
              } catch (err) {
                console.warn(`⚠️ Failed to delete ${key} from S3:`, err.message);
              }
            }
          }
        }
      }

      return res.json({ msg: 'Deleted Post!', deletedPost: post });

    } catch (err) {
      console.error("Error deleting post:", err.message);
      return res.status(500).json({ msg: err.message || "Internal Server Error" });
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Posts.find({ _id: req.params.id, likes: req.user._id });
      if (post.length > 0) return res.status(400).json({ msg: "You liked this post." });

      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likes: req.user._id } },
        { new: true }
      );

      if (!like) return res.status(400).json({ msg: 'This post does not exist.' });

      res.json({ msg: 'Liked Post!' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unLikePost: async (req, res) => {
    try {
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      if (!like) return res.status(400).json({ msg: 'This post does not exist.' });

      res.json({ msg: 'UnLiked Post!' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query).paginating();
      const posts = await features.query.sort("-createdAt");

      res.json({ posts, result: posts.length });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password"
          }
        });

      if (!post) return res.status(400).json({ msg: 'This post does not exist.' });

      res.json({ post });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPostDiscover: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = req.query.num || 9;

      const posts = await Posts.aggregate([
        { $match: { user: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
      ]);

      return res.json({
        msg: 'Success!',
        result: posts.length,
        posts
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  savePost: async (req, res) => {
    try {
      const user = await Users.find({ _id: req.user._id, saved: req.params.id });
      if (user.length > 0) return res.status(400).json({ msg: "You saved this post." });

      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { saved: req.params.id } },
        { new: true }
      );

      if (!save) return res.status(400).json({ msg: 'This user does not exist.' });

      res.json({ msg: 'Saved Post!' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unSavePost: async (req, res) => {
    try {
      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { saved: req.params.id } },
        { new: true }
      );

      if (!save) return res.status(400).json({ msg: 'This user does not exist.' });

      res.json({ msg: 'unSaved Post!' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getSavePosts: async (req, res) => {
    try {
      const features = new APIfeatures(Posts.find({
        _id: { $in: req.user.saved }
      }), req.query).paginating();

      const savePosts = await features.query.sort("-createdAt");

      res.json({ savePosts, result: savePosts.length });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = postCtrl;
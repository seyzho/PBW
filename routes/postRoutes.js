const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../auth');
const Post = require('../models/Post');

// get all posts
router.get('/', async (req, res) => {
    try {
        const post = await Post.find();
        res.send(posts);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
});

// crate a post
router.post('/', authenticateToken, [
    body('title').isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
    body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user_id,
        });
        await post.save();
        res.send(post);
    } catch (err) {
        res.status(500).send({message : err.message});
    }
});

// get specific post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found'});
        res.send(post);
    } catch (err) {
        res.status(500).send({message: err.message });
    }
});

// update a post
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post. findOneAndUpdate({_id: req.params.id, author: req.user._id}, req.body, { new: true });
        if (!post) return res.status(404).send({ message: 'Post not found or you do not have permission to update this post'});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// delete a post
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findOneAndRemove({_id: req.params.id, author: req.user._id});
        if (!post) return res.status(404).send({ message: 'Post not found or you do not have permission to delete this post'});
        res.send({ message: 'Post deleted successfully'});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// add a comment to a post
router.post('/:id/comments', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found'});

        const comment = new Comment({
            content: req.body.content,
            author: req.user._id
        });
        await comment.save();

        post.comments.push(comment);
        await post.save();

        res.send(comment);
    } catch (err) {
        res.status(500).send({ mesage: err.message });
    }
});

module.exports = router;


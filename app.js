const express = require('express');
const app = express();
app.use(express.json()); 

const Post = require('./models/Post');
const Comment = require('./models/Comment');


// get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
});


// create post
app.post('/posts', async (req, res) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).send(post);
    } catch (err) {
        res.status(500).send({ message: err.message});
    }
});

// get specific post
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found'});
        res.send(post);
    } catch (err) {
        res.status(500).send({ message: err.message});
    }
});


// update specific post
app.put('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if (!post) return res.status(404).send({ message: 'Post not found'});
        res.send(post);
    } catch (err) {
        res.status(500).send({ message: err.message});
    }
});

// delete post
app.delete('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndRemove(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found'});
        res.send({ message: 'Post deleted successfully'});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// add comment
app.post('/posts/:id', async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        const post = await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment.id } }, { new: true});
        if (!post) return res.status(404).send({ message: 'Post not found'});
        res.send(post);
    } catch (err) {
        res.status(500).send({ message: err.message});
    }
});
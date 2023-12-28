// Create web server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');

// Create web server
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create comments array
const commentsByPostId = {};

// Create route to get comments
app.get('/posts/:id/comments', (req, res) => {
    // Send comments
    res.send(commentsByPostId[req.params.id] || []);
});

// Create route to post comments
app.post('/posts/:id/comments', async (req, res) => {
    // Create comment id
    const commentId = randomBytes(4).toString('hex');
    // Get comment content
    const { content } = req.body;
    // Get post id
    const postId = req.params.id;
    // Get comments of post
    const comments = commentsByPostId[postId] || [];
    // Push new comment to comments
    comments.push({ id: commentId, content, status: 'pending' });
    // Update comments
    commentsByPostId[postId] = comments;
    // Send event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId,
            status: 'pending'
        }
    });
    // Send comments
    res.status(201).send(comments);
});

// Create route to receive event
app.post('/events', async (req, res) => {
    // Get event type
    const { type, data } = req.body;
    // Check event type
    if (type === 'CommentModerated') {
        // Get comment id
        const { id, postId, status, content } = data;
        // Get comments of post
        const comments = commentsByPostId[postId];
        // Get comment to update
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        // Update comment status
        comment.status = status;
        // Send event to event bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const comments = require('./comments');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

// GET /comments
app.get('/comments', (req, res) => {
    res.send(comments);
});

// POST /comments
app.post('/comments', (req, res) => {
    const newComment = req.body;
    newComment.id = comments.length + 1;
    comments.push(newComment);
    res.send(newComment);
});

// PUT /comments/:id
app.put('/comments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedComment = req.body;
    const index = comments.findIndex((comment) => comment.id === id);
    comments[index] = updatedComment;
    res.send(updatedComment);
});

// DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = comments.findIndex((comment) => comment.id === id);
    comments.splice(index, 1);
    res.send(comments);
});

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
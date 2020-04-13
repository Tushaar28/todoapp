//Making Routes
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const Todo = mongoose.model('Todo');
const {jwtKey} = require('./keys');

//1. ADD TASK
router.post('/addTask', async (req, res, next) => {
    const { title, due_date, priority, status, description, notes } = req.body;

    try {
        const todo = new Todo({
            title, due_date, priority, status, description, notes
        });
        todo.notes = [...todo.notes, { notes : notes}]
        await todo.save();
        const token = jwt.sign({ todoId: todo._id }, jwtKey);
        res.send({ token: token });
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

//2. ADD NOTES
router.post('/addNotes/:title', async (req, res, next) => {
    const { notes } = req.body;
    const todo = await Todo.findOne({title : req.params.title})
    if (!todo) {
        return res.status(422).send({ err: 'Invalid Todo' })
    }

    try {
        todo.notes = [...todo.notes, { notes: notes }]
        await todo.save();
        const token = jwt.sign({ todoId: todo._id }, jwtKey);
        res.send({ token: token });
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

//3. GET INFO
router.get('/getInfo/:title', async (req, res, next) => {
    const todo = await Todo.findOne({title : req.params.title})
    if (!todo) {
        return res.status(422).send({ err: 'Invalid Todo' })
    }
    res.send({
        title: todo.title,
        due_date: todo.due_date,
        status: todo.status,
        priority: todo.priority,
        description: todo.description,
        notes : todo.notes
    });
})


module.exports = router;
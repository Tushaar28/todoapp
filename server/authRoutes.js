//Making Routes
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const Todo = mongoose.model('Todo');
const { jwtKey } = require('./keys');

//1. ADD TASK
router.post('/addTask', async (req, res, next) => {
    const { title, due_date, priority, status, description, notes } = req.body;

    try {
        const todo = new Todo({
            title, due_date, priority, status, description
        });
        await todo.save();
        const token = jwt.sign({ todoId: todo._id }, jwtKey);
        res.send({ token: token });
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

//2. ADD NOTES
router.post('/addNotes/:serial', async (req, res, next) => {
    const { notes } = req.body;
    let todo = await Todo.find()
    todo = todo[req.params.serial - 1]
    try {
        todo.notes = [...todo.notes, { notes: notes }]
        await todo.save();
        const token = jwt.sign({ todoId: todo._id }, jwtKey);
        res.send({ todo });
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

//3. GET INFO
router.get('/getInfo', async (req, res, next) => {
    const todo = await Todo.find()
    // title: todo.title,
    // due_date: todo.due_date,
    // status: todo.status,
    // priority: todo.priority,
    // description: todo.description,
    // notes : todo.notes
    if (!todo) {
        return res.status(422).send({ err: 'Invalid Todo' })
    }
    res.send({
        todo
    });
})

//DELETE TODO
router.post('/deleteTodo/:serial', async (req, res, next) => {
    let todo = await Todo.find()
    todo = todo[req.params.serial - 1]
    try {
        todo.status = false
        await todo.save()
        await Todo.deleteOne({ status: false })
        res.status(200).send({ alert: 'TODO Deleted!!', details: todo })
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

module.exports = router;
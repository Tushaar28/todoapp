//Making Routes
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const Todo = mongoose.model('Todo');
const {jwtKey} = require('./keys');

//1. ADD TASK
router.post('/todos/addTask', async (req, res, next) => {
    const { title, due_date, priority, status, description, notes } = req.body;

    try {
        const todo = new Todo({
            title, due_date, priority, status, description
        });
        await todo.save();
        const token = jwt.sign({ todoId: todo._id }, jwtKey);
        res.send({ token: token, alert:'Task added Successfully!' });
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

//2. ADD NOTES
router.post('/todos/addNotes/:serial', async (req, res, next) => {
    const { notes } = req.body;
    let todo = await Todo.find()
    todo = todo[req.params.serial-1]
    try {
        todo.notes = [...todo.notes, { notes: notes }]
        await todo.save();
        const token = jwt.sign({ todoId: todo._id }, jwtKey);
        res.send({ todo, alert:'Note added Successfully' });
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

//3. GET REQUESTS
//1. GET ALL DB
router.get('/todos', async (req, res, next) => {
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

//2. GET EACH TODO
router.get('/todos/:serial', async (req, res, next) => {
    let todo = await Todo.find()
    todo = todo[req.params.serial - 1]
    if (!todo) {
        return res.status(422).send({ err: 'Invalid Serial Number' })
    }
    res.send({
        todo
    });
})

//3.GET NOTES
router.get('/todos/:serial/notes', async (req, res, next) => {
    let todo = await Todo.find()
    todo = todo[req.params.serial - 1]
    if (!todo) {
        return res.status(422).send({ err: 'Invalid Serial Number' })
    }
    res.send({
        notes : todo.notes
    });
})

//4. EDIT ROUTES
//1. DUE_DATE
router.post('/todos/editDate/:serial', async (req, res, next) => {
    let todo = await Todo.find()
    todo = todo[req.params.serial - 1]
    try {
        if (todo.due_date == req.body.due_date) {
            return res.status(422).send('Same Value Entered!')
        }

        todo.due_date = req.body.due_date
        await todo.save()
        res.status(200).send({ alert: 'DATE Changed!!', details: todo })
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

//2. PRIORITY
router.post('/todos/editPriority/:serial', async (req, res, next) => {
    let todo = await Todo.find()
    todo = todo[req.params.serial - 1]
    try {
        if(todo.priority == req.body.priority) {
            return res.status(422).send('Same Value Entered!')
        }
        todo.priority = req.body.priority
        await todo.save()
        res.status(200).send({ alert: 'Priority Changed!!', details: todo })
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

//3. STATUS
router.post('/todos/deleteTodo/:serial', async (req, res, next) => {
    let todo = await Todo.find()
    todo = todo[req.params.serial - 1]
    try {
        if (todo.status == req.body.status) {
            return res.status(422).send('Same Value Entered!')
        }
        todo.status = req.body.status
        await todo.save()
        // await Todo.deleteOne({ status: true })
        res.status(200).send({details: todo })
    } catch (err) {
        return res.status(422).send(err.message);
    }
})




module.exports = router;
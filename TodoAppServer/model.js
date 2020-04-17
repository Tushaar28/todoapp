const mongoose = require('mongoose');
let timeStamp = new Date();
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique : true
    },

    description: {
        type: String,
        default : ''
    },

    due_date: {
        type: Date,
        default : `${timeStamp.getFullYear()}-${timeStamp.getMonth()}-${timeStamp.getDate()+1}`,
    },

    priority: {
        type: Number,
        default : 2
    },

    status: {
        type: Boolean,
        default: false
    },
    notes : {
        type : Array
    }
})

mongoose.model('Todo', todoSchema);
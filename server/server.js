require('./model');
const express = require('express');
const mongoose = require('mongoose');
//Calling Express to use it.
const app = express();
const http = require('http').createServer(app); 
const bodyParser = require('body-parser');
const path = require('path');
//To contain all the incoming parameters in a container
app.use(bodyParser.json());

const {mongoUrl} = require('./keys');
const authRoutes = require('./authRoutes');

app.use(authRoutes);

//Making a Connection with Database
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("Successfully Connected to mongo");
})

mongoose.connection.on('error', (error) => {
    console.log("Error Connecting to Server", error);
})

mongoose.set('useCreateIndex', true);

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, '../client', 'index.html'));})

//Make a port for our server
const port = process.env.PORT || 3001;
http.listen(port, (err) => {
    if (err) {
        console.log(`Error Connecting to Server : ${err}`);
    }
    console.log(`Server listening on  : ${port}`);
})
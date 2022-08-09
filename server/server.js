const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer'); 
const User = require('./models/User')
const PORT = process.env.PORT || 4000; 

app.use(cors());
app.use(bodyParser.json());
app.use(require('./routes/user'));
app.use(require('./routes/auth')); 

mongoose.connect('mongodb+srv://uri4587:uman0330@cluster0.owy3s.mongodb.net/MERN-Macro-Tracker', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.on('connected', ()=> {
    console.log('MongoDB Connected!')
}); 

mongoose.connection.on('error', ()=> {
    console.log('Error connecting to MongoDB')
})

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

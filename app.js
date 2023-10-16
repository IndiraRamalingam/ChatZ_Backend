const express=require('express');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser');
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')

//add middleware
app.use(bodyParser.json())
app.use(cors());

app.use('/api/users',userRoutes);
app.use('/api/message',messageRoutes);

module.exports =app;
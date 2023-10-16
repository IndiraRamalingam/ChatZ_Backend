const express=require('express')
const router=express.Router();
const messageController = require('../controllers/message/messageController');

//to get the ID of User
router.get('/getId',messageController.getUserID);

router.post('/addmsg', messageController.addMessage);
router.post('/getmsg', messageController.getMessages);

module.exports=router;
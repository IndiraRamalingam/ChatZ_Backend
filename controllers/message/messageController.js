const User = require('../../models/user');
const Messages = require('../../models/message');
const jwt = require("jsonwebtoken");
const config=require('../../utils/config');
const randomstring=require('randomstring');

const SECRET_KEY = config.SECRET_KEY;

const getTokenFrom = (request) => {
    const authHeader = request.header('Authorization');
    return authHeader;
}

const messageController ={

       //To get the ID of User
       getUserID:async(req,res)=>{
        try{
            const token = getTokenFrom(req);
            // decode the token to authorize the user
            const decodedToken = jwt.verify(token, SECRET_KEY);
            // if the token is not valid, return an error
            if(!decodedToken){
                return response.json({ message: 'token invalid' });
            }
            const user=await User.findById(decodedToken.userId).exec();
            const user_ID=user._id
            res.status(200).json({user_ID,user})
            
        }
        catch(error){
            console.error('Error in Fetching User ID',error)
            res.status(500).json({message:'Error in Fetching User ID'})
        }
    },
    getMessages:async (req, res, next) => {
        try {
          const { from, to } = req.body;
          console.log("FROM TO    :"+from +"   "+ to)
          const messages = await Messages.find({
            users: {
              $all: [from, to],
            },
          }).sort({ updatedAt: 1 });
      
          const projectedMessages = messages.map((msg) => {
            return {
              fromSelf: msg.sender.toString() === from,
              message: msg.message.text,
            };
          });
          res.json(projectedMessages);
        } catch (ex) {
          next(ex);
        }
      },
      addMessage:async (req, res, next) => {
        try {
          const { from, to, message } = req.body;
          const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
          });
      
          if (data) return res.json({ msg: "Message added successfully." });
          else return res.json({ msg: "Failed to add message to the database" });
        } catch (ex) {
          next(ex);
        }
      },

}

module.exports=messageController;
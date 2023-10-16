const config=require('./utils/config');
const mongoose=require('mongoose');
const app=require('./app');
const socket = require("socket.io");

console.log("connecting to MongoDB")
//connect with DB
// mongoose.connect(config.MONGO_URI)
//     .then(()=>{
//         console.log("Connected to MongoDB");
//       const server =  app.listen(config.PORT,() =>{
//             console.log(`Server running on PORT ${config.PORT}`);
//         });
//     })
//     .catch((error)=>{
//         console.log('Error connecting to MongoDB', error);
//     });

mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

  const server = app.listen(config.PORT, () =>
  console.log(`Server started on ${config.PORT}`)
);


    const io = socket(server, {
        cors: {
          origin: "http://localhost:5173",
          credentials: true,
        },
      });
      
      global.onlineUsers = new Map();
      io.on("connection", (socket) => {
        global.chatSocket = socket;
        socket.on("add-user", (userId) => {
          onlineUsers.set(userId, socket.id);
        });
      
        socket.on("send-msg", (data) => {
          const sendUserSocket = onlineUsers.get(data.to);
          if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
          }
        });
      });
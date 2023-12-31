const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 4000
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors())
let users = []

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected!`)  
    socket.on("message", data => {
      socketIO.emit("messageResponse", data)
    })

       socket.on("newUser", data => {
      users.push(data)
      socketIO.emit("newUserResponse", users)
    })

    socket.on("leavingUser", (data) => {
      users = users.filter(user => user.socketID !== socket.id)
      // console.log(data)
      // console.log('A user disconnected');
      users.forEach(e => console.log(e));
      let message = {
        text: `Leaved the chat`, 
        name: data.userName,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        leaved: true
        }

        console.log(message)
      socketIO.emit("disconnected", message)
      socketIO.emit("newUserResponse", users)

    })
});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

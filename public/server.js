// Setup
const express = require('express');
const app = express();

app.use(express.static('public'));

const http = require('http');
const server = http.createServer(app);

// Socket.io
const { Server } = require("socket.io");
const io = new Server(server);

// app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
}); 

let users = {}
let rooms = {}

var peopleTyping = []

class User {
    constructor(socket) {
        this.socket = socket
        this.bind(socket)
    }
    bind(socket) {
        socket.onAny((event, ...args) => {
            try {
                if (typeof this[event] === "function") this[event](...args)
            } catch {
                socket.emit("error", "Invalid arguments")
            }
        })
        if (this.socket) {
            this.socket.offAny();
        }
        this.socket = socket
    }
}

io.use((socket, next) => {
    while (users[token = btoa(Math.random())])
    users[token] = new User(socket)
    next()
})

io.on("joinRoom", (roomCode, callback) => {
    if (roomCode in rooms) {
        callback(1)
    }
    callback(0)
})

io.on('connection', (socket) => {
    socket.broadcast.emit("user connection", users[socket.id].name)

	socket.on('disconnect', () => {
        socket.broadcast.emit("user disconnection", users[socket.id])
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    });

    socket.on("started typing", (username) => {
        
        io.emit("people typing", username)
    })

    socket.on("stopped typing", (username) => {
        io.emit("stopped typing", username)
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
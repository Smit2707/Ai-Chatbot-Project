const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");


const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
        console.log("A new user connected.", socket.id)
        socket.on("disconnect", () =>{
            console.log("user disconnected", socket.id)
        })
});

httpServer.listen(3000,() =>{
    console.log("server is running on port 3000")
});
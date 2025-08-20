require("dotenv").config();
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service");


const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const chatHistory = [

]

io.on("connection", (socket) => {

    console.log("A new user connected.", socket.id)

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })

    socket.on("ai-message", async (data) => {
        console.log("Recieved AI Message", data.prompt)
        chatHistory.push({
            role: "user",
            parts: [{ text: data.prompt }]
        })
        const response = await generateResponse(chatHistory);
        chatHistory.push({
            role: "model",
            parts: [{ text: response }]
        })

        socket.emit("ai-message-response", response)
    })
});

httpServer.listen(3000, () => {
    console.log("server is running on port 3000")
});
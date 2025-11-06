require('dotenv').config()
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/services/ai.service');


const httpServer = createServer(app);

const io = new Server(httpServer, { 
    cors:{
        origin: "http://localhost:5173",
    }
 });

const chatHistory = [

]
io.on("connection", (socket) => {
    console.log("connected")

    socket.on("disconnect",()=>{
        console.log("disconnected")
    })
    // ai building

    socket.on("ai-message", async (data)=>{
        // printing what data I got
        console.log("Ai message received: ",data);
        // I wiil use json format to send data that's why I using prompt as a prop passed over .
        // after all we send this data to ai using generator function
        chatHistory.push({
            role: "user",
            parts: [{ text: data}]
        });
        const answer = await generateResponse(chatHistory)
        // now what we got answer we will print it 

        chatHistory.push({
            role: "model",
            parts: [{ text: answer}]
        })

        console.log("Ai answer is: ", answer);
        socket.emit("ai-message-response", answer)
    })
});

httpServer.listen(3000,()=>{
    console.log("server started !")
});
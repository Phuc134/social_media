const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io")
const app = express();
const httpServer = createServer(app);

const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");

const router = express.Router();
const path = require("path");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(cors());

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        console.log(req.file);
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const chatGroupRoute = require("./routes/chatGroup");
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chat-group", chatGroupRoute);
app.get("/", (req, res) => {
    res.send('<h1> hello </h1>')
})
const addUser = (socketId, userId) => {
    if (!users.some((user) => user.userId == userId)) users.push({ userId, socketId })
}

const io = new Server(httpServer, {
    cors: { origin: 'http://localhost:3000' },
});
const  users= [];
io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on('disconnect', () => {

    })
    socket.on('add_room', ({ listRoom ,id}) => {
        for (let i = 0; i < listRoom.length; i++) socket.join(listRoom[i]._id);
        users.push({socket: socket, user_id: id});
    })
    socket.on('add_room_update',({listRoom})=> {
        console.log('test');
        console.log('List Room ', listRoom);
        console.log(users);
        for (let i = 0; i < listRoom.length; i++) {
            socket.join(listRoom[i]._id);
        }

    })
    socket.on('send_message', ({ msg, userCurrent, idRoom }) => {
        console.log(msg, idRoom);
        socket.to(idRoom).emit('receive_message', { text: msg, user: userCurrent, idRoom });
    })
})
httpServer.listen(8800, () => {
    console.log("Backend server is running!");
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

// Env
dotenv.config();

// Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/SkillSet-NetWork", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(cors())

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Access"],
  })
);

// Routers
const User = require("./Router/User");
const Admin = require("./Router/Admin");
const Company = require("./Router/Company");

app.use("/", User);
app.use("/company", Company);
app.use("/admin", Admin);


// Set port
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection",(socket)=>{
  socket.on("send",(message,conversationId,sender)=>{
    io.emit("receiver",message,conversationId,sender)
  })
})

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Set port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Env
dotenv.config();

// Mongoose
mongoose
  .connect('mongodb://127.0.0.1:27017/SkillSet-NetWork', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // Remove the trailing slash
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Access'],
  })
);

// Routers
const User = require('./Router/User');
const Admin = require('./Router/Admin');
const Company = require('./Router/Company');

app.use('/', User);
app.use('/company', Company);
app.use('/admin', Admin);
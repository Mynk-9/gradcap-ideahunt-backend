const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const ideasRoutes = require('./routes/idea.routes');
const userRoutes = require('./routes/user.routes');
const loginRoutes = require('./routes/login.routes');
const commentsRoutes = require('./routes/comments.routes');

mongoose.connect('mongodb://localhost:27017/gradcap-ideahunt').then(
   () => {
      console.log('Connected to database.');
   },
   error => {
      console.log('Failed to connect to database.');
      console.log('Error log:', error);
   }
);

// logging
app.use(morgan('dev'));

// allow all origins
app.use(cors());

// parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/ideas/comments', commentsRoutes);
app.use('/ideas', ideasRoutes);
app.use('/user', userRoutes);
app.use('/login', loginRoutes);

// handle 404
app.use((req, res) => res.status(404).send());

// testing
// const userUtils = require('./utilities/user.utilities');
// const asyncWrapper = async () => {
//    let xx = await userUtils.userIdGen('mayank mathur');
//    console.log(xx);
// };
// asyncWrapper();

module.exports = app;

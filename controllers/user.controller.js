const mongoose = require('mongoose');
const User = require('./../models/user.model');

// TEMPORARY ROUTES FOR TESTING
const createUser = (req, res) => {
   const { email, name } = req.body;
   let newUser = new User({ email: email, name: name });
   newUser
      .save()
      .then(({ _id }) => {
         res.status(201).send({
            id: _id,
         });
      })
      .catch(error => {
         res.status(500).send({
            Error: error,
         });
      });
};
const getAll = (req, res) => {
   User.find()
      .exec()
      .then(data => res.status(200).send(data));
};

module.exports = { createUser, getAll };

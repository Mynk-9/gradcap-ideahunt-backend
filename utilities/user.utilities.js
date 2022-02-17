const User = require('../models/user.model');

const userIdGen = async name => {
   let userNum = 0;
   let userId = null;

   name = name.split(' ').join('').toLowerCase();

   let otherUser = await User.find({ userId: { $regex: name + '.*' } })
      .sort({ _id: -1 })
      .limit(1)
      .exec();
   const lastId = otherUser[0]?.userId;

   if (otherUser.length === 0) userNum = 0;
   else userNum = 1 + parseInt(lastId.substring(name.length, lastId.length));

   userId = name + userNum.toString();
   return userId;
};

const trimUserObject = user => {
   let joiningDate = new Date(Date.parse(user.createdAt));
   joiningDate = {
      day: joiningDate.getDate(),
      month: joiningDate.getMonth(),
      year: joiningDate.getFullYear(),
   };
   user.joiningDate = joiningDate;
   user.gradYear = new Date(user.gradYear).getFullYear();
   delete user._id;
   delete user.createdAt;
   delete user.updatedAt;
   delete user.__v;
   return user;
};

module.exports = { userIdGen, trimUserObject };

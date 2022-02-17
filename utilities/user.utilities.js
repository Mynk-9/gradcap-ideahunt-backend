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

const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
  // Get all students
  getAllUser: async (req, res) => {
    try {
      const allUsers = await User.find();
      res.status(200).json(allUsers);
  }
      
    catch(err) {
        console.log(err);
        return res.status(500).json(err);
      };
  },

  // Get a single student
  getSingleUser: async (req, res) => {
    try{
    const single = User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('thoughts friends'); 

      !single
          ? res.status(404).json({ error: ' User not found' })
          : res.status(200).json(single);
      }
      catch (err)  {
        console.log(err);
        return res.status(500).json(err);
      };
  },

  // create a new student
  createUser: async(req, res) => {
    try{
    const create = User.create(req.body)
      res.status(200).json(create)
    }
      catch(err){  res.status(500).json(err);
      }
  },

  updateUser: async(req,res)=>{
    try{
      const update = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        {new:true}
      );
      !update ? res.status(404).json({error:"no user found with that id"}) :res.status(200).json(update);
    }
    catch(error){
      console.log(error);
      res.status(500).json(error)
    }

  },

  // Delete a student and remove them from the course
  deleteUser: async (req, res) => {
    try{
    const user = User.findByIdAndDelete(req.params.userId)
        !user
          ? res.status(404).json({ message: 'No such student exists' })
          : res.status(200).json({message:"user was deleted"})

          await Thought.deleteMany({username:user.username})
      }
      catch(error){
        console.log(error);
        res.status(500).json(error)
      }
  },

  // Add an assignment to a student
  addFriend: async (req, res)=> {
    try {
      const { userId, friendId } = req.params;

      const user = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { friends: friendId } }, 
          { new: true }
      );

      !user
          ? res.status(404).json(error)
          : res.status(200).json(user);
  }
  catch (error) {
      console.error(error);
      res.status(500).json(error);
  }
  },


  removeFriend: async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: friendId } },
            { new: true }
        );

        !user
            ? res.status(404).json({ error: 'User not found' })
            : res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Issue' });
    }
}
};

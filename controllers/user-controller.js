const { User, Thought } = require("../models");

const userController = {
    // Get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: ('-__v')
            })
            .populate({
                path: 'friends',
                select: ('-__v')
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    
    // Get a user by Id
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.id })
        .populate({
            path: 'thoughts',
            select: ('-__v')
        })
        .populate({
            path: 'friends',
            select: ('-__v')
        })
          .select('-__v')
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with that Id' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
      },

    // Create a user
    createUser(req, res) {
        User.create(req.body)
          .then((user) => res.json(user))
          .catch((err) => res.status(500).json(err));
    },

    // Delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with that Id' })
              : Thought.deleteMany({ _id: { $in: user.thoughts } })
          )
          .then(() => res.json({ message: 'User along with associated thoughts deleted!' }))
          .catch((err) => res.status(500).json(err));
    },

    // Update a user
    updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { runValidators: true, new: true }
        )
        .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with this id!' })
              : res.json(user)
          )
        .catch((err) => res.status(500).json(err));
    },

    // Add a friend
    addFriend(req, res){
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId} },
            { runValidators: true, new: true }
        )
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    // Delete a friend
    deleteFriend(req, res){
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId} },
            { new: true }
        )
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
};

module.exports = userController;
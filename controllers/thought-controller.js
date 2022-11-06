const { User, Thought } = require("../models");

const thoughtController = {

  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
        .populate({
            path: 'reactions',
            select: ('-__v')
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
  },

  // Get one thought by Id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.id })
    .populate({
        path: 'reactions',
        select: ('-__v')
    })
    .select('-__v')
    .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that Id' })
          : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },

  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then( ({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )
      })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

// Delete a user
deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
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
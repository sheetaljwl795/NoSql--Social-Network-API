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
      .catch((err) => { console.error(err); res.status(500).json(err) });
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

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then( ({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )
      })
      .then((user) =>
       !user
        ? res.status(404).json({ message: 'Thought created, but no user with this Id' })
        : res.json({ message: 'Thought successfully created' })
      )
     .catch((err) => res.status(500).json(err));
  },

  // Delete a thought and remove them from the user
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this Id' })
          : User.findOneAndUpdate(
                { thoughts: req.params.id },
                { $pull: {thoughts: req.params.id }},
                { new: true }
            )
      )
      .then((user) =>
       !user
        ? res.status(404).json({ message: 'Thought deleted, but no user with this Id' })
        : res.json({ message: 'Thought successfully deleted' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with this id' })
          : res.json({ message: 'Thought successfully updated' })
      )
    .catch((err) => res.status(500).json(err));
  },

  // Create a reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
    )
    .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No thought found with this id' })
      : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  },

  // Delete a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.param.thoughtId },
        { $pull: { reactions: req.params.reactionId} },
        { new: true }
    )
    .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No reaction found with this id' })
      : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
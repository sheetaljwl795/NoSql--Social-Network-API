const router = require('express').Router();
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/user-controller');

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getSingleUser.put(updateUser).delete(deleteUser);

router.route('/:id/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;
const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage, replyMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').post(sendMessage).get(protect, admin, getMessages);
router.route('/:id').delete(protect, admin, deleteMessage);
router.route('/:id/reply').post(protect, admin, replyMessage);

module.exports = router;

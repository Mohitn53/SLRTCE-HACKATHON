const express = require('express');
const { askChatbot } = require('../controllers/chat.controller');
const router = express.Router();

router.post('/ask', askChatbot);

module.exports = router;
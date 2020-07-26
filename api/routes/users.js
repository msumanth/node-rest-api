const express = require('express');
const router = express.Router();

const userService = require('../services/user.service');

router.post('/signup', userService.user_signup);

router.post('/login', userService.user_login);

router.delete('/:userId', userService.user_delete);

module.exports = router;
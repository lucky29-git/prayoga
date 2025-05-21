const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;

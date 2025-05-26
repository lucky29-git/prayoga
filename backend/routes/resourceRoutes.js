const express = require('express');
const router = express.Router();
const resourceController = require('../src/controllers/resourceController');

router.get('/spec', resourceController.getSpec);
router.get('/state', resourceController.getState);

module.exports = router;

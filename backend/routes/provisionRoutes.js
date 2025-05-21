const express = require('express');
const router = express.Router();
const provisionController = require('../src/controllers/provisionController');

router.post('/yaml', provisionController.provisionYaml);
router.get('/spec-example', provisionController.getSpecExample);

module.exports = router;

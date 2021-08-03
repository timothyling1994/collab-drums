var express = require('express');
var router = express.Router();

let groupController = require('../controllers/groupController');

router.post('/', groupController.create_group);


module.exports = router; 
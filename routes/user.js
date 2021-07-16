var express = require('express');
var router = express.Router();

let userController = require('../controllers/userController');

router.post('/', userController.create_user);


module.exports = router; 
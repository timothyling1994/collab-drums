var express = require('express');
var router = express.Router();

let userController = require('../controllers/userController');

router.get('/', userController.get_user);

router.post('/', userController.create_user);


module.exports = router; 
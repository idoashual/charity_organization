const express = require('express');
const router = express.Router();
var indexController = require('../controller/indexController');  

router.get('/', indexController.checksesssion,indexController.getHomePage);


router.get('/logout',indexController.logout);

module.exports = router;

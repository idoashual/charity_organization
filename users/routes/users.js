const express = require('express');
const router = express.Router();
var usersController = require('../controller/usersController');  


router.get('/', usersController.checksesssion ,usersController.getUsersListPage);


router.get('/list', usersController.checksesssion,usersController.getUsersList);


router.get('/add', usersController.checksesssion, usersController.getAddUserPage);

router.post('/', usersController.checksesssion,usersController.addUser);

router.get('/edit', usersController.checksesssion, usersController.getEditPage);

router.post('/edit',usersController.checksesssion,usersController.editUser)

router.delete('/delete/:name', usersController.checksesssion,usersController.deleteUser);


module.exports = router;

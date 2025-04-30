const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

router.post('/register', userController.RegisterAccount);
router.post('/login', userController.loginAccount);
router.get('/:email', userController.getEmailbyid);
router.put('/', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/topUp', userController.topUp);

module.exports = router;
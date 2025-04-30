const express = require('express');
const multer = require('multer');

const itemController = require('../controllers/item.controller');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', upload.single('image_url'), itemController.createItem);
router.put('/', upload.single('image_url'), itemController.updateItem);
router.get('/', itemController.getItems);
router.get('/byid/:id', itemController.getItemById);
router.get('/bystoreid/:store_id', itemController.getItembyStoreId);
router.delete('/:id', itemController.deleteItem);

router.use((error, req, res, next) => {
    const message = 'This is a middleware to handle errors from multer -> ' + error.field + ' ' + error.message;
    console.error(message);
    res.status(500).json({ message });
});

module.exports = router;
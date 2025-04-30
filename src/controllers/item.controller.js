const itemRepository = require("../repository/item.repository");
const baseResponse = require("../utils/baseResponse");
const cloudinary = require("../utils/cloudinary");


exports.createItem = async (req, res) => {
    try {
        const fileStr = req.file.buffer.toString("base64");
        const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileStr}`);
        const item = {
            name: req.body.name,
            price: req.body.price,
            store_id: req.body.store_id,
            image_url: uploadResponse.url,
            stock: req.body.stock,
        };
        const result = await itemRepository.createItem(item);
        baseResponse(res, true, 201, "Item created", result);
    } catch (error) {
        console.error("Item controller error", error);
        baseResponse(res, false, 500, "Store Not Found", error);
    }
};

exports.getItems = async (req, res) => {
    try {
        const result = await itemRepository.getItems();
        baseResponse(res, true, 200, "Items found", result);
    } catch (error) {
        console.error("Item controller error", error);
        baseResponse(res, false, 500, "Items not Found", error);
    }
};

exports.getItemById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await itemRepository.getItemById(id);
        baseResponse(res, true, 200, "Item found", result);
    } catch (error) {
        console.error("Item controller error", error);
        baseResponse(res, false, 500, "Item not Found", error);
    }
};

exports.getItembyStoreId = async (req, res) => {
    try {
        const store_id = req.params.store_id;
        const result = await itemRepository.getItembyStoreId(store_id);
        baseResponse(res, true, 200, "Items found", result);
    } catch (error) {
        console.error("Item controller error", error);
        baseResponse(res, false, 500, "Store doesn't exist", error);
    }
};

exports.updateItem = async (req, res) => {
    try {
        console.log(req.body);
        const result = await itemRepository.updateItem(req.body);
        if(!result) {
            return baseResponse(res, false, 404, "Item not found", null);
        };
        baseResponse(res, true, 200, "Item updated", result);
    } catch (error) {
        console.error("Item controller error", error);
        baseResponse(res, false, 500, "Store not Found", error);
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await itemRepository.deleteItem(id);
        baseResponse(res, true, 200, "Item deleted", result);
        console.log("Item deleted", result); 
    } catch (error) {
        console.error("Item controller error", error);
        baseResponse(res, false, 500, "Item Not Found", error);
    }
}
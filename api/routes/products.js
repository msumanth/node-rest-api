const express = require('express');
const router = express.Router();
const checkAuth = require('../security/check-auth');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetye === "image/jpeg" || file.mimetye === "image/png")
        cb(new Error('Invalid File'), true);
    else cb(null, true);
}

const upload = multer(
    {
        storage: storage,
        //limits: { fileSize: 1024 * 5 },
        fileFilter: fileFilter
    });

const productService = require('../services/product.service');

router.get('/', productService.products_getAll);

router.post('/', checkAuth, upload.single('productImg'), productService.products_createNew);

router.get('/:productId', productService.product_getById);

router.patch('/:productId', checkAuth, productService.products_updateById);

router.delete('/:productId', checkAuth, productService.product_deleteById);

module.exports = router;
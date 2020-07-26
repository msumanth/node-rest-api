const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_getAll = (req, res, next) => {

    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(list => {
            console.log(list);
            res.status(200).json({
                count: list.length,
                products: list.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id

                        }
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.products_createNew = (req, res, next) => {
    console.log(req.file);
 
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created Product',
                createdObj: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id

                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

};


exports.product_getById = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(result => {
            console.log(result);
            if (result !== null)
                res.status(200).json({
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id

                    }
                });
            else
                res.status(404).json({ message: 'Not Valid Product Id' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.products_updateById =  (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id }
        , { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id

                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

};

exports.product_deleteById = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product Deleted.',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
};
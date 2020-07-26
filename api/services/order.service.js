const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.order_getAll =(req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(list => {
            console.log(list);
            res.status(200).json({
                count: list.length,
                orders: list.map(doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
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

exports.order_getById = (req, res, next) => {
    const id = req.params.orderId;

    Order.findById(id)
        .select('product quantity _id')
        .populate('product')
        .exec()
        .then(result => {
            console.log(result);
            if (result !== null)
                res.status(200).json({
                    product: doc.product,
                    quantity: doc.quantity,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
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


exports.order_createNew = (req, res, next) => {
    console.log(req.body.productId);
    Product.findById(req.body.productId)
        .exec()
        .then(result => {
            console.log(result);
            try {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId,
                });
                console.log(order);

                order.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Order successfully created',
                            createdOrder: {
                                _id: result._id,
                                product: result.product,
                                quantity: result.quantity,
                            },
                            request: {
                                type: 'GET',
                                url: `http://localhost:3000/orders/${result._id}`,
                            },
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                        });
                    });
            } catch (err) {
                console.log(err);
            }
        })
        .catch(err => {
            console.log('this is product err!');
            console.log(err)
        });
};


exports.order_updateById =(req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Order.update({ _id: id }
        , { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                product: doc.product,
                quantity: doc.quantity,
                _id: doc._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + doc._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

};


exports.order_deleteById =(req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Order Deleted.',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { product: 'String', quantity: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

};

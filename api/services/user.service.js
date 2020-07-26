const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.user_signup = (req, res, next) => {
    console.log(req.body.password);

    User.find({ email: req.body.email }).exec().then(usr => {
        console.log(usr);
        if (usr.length) {
            return res.status(409).json({
                message: 'Email Id already exists'
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: err });
                } else {
                    console.log(hash);
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(result => {
                        console.log(result);
                        return res.status(201).json({
                            message: 'Created New User'
                        });
                    }).catch(err1 => {
                        console.log(err1);
                        return res.status(500).json({ error: err1 });
                    });

                }
            });
        }
    })
};

exports.user_login = (req, res, next) => {
    console.log(process.env.MONGO_ATAS_PW);
    console.log(process.env.MONGO_ATLAS_DB);
    console.log(process.env.JWT_KEY);
    const key = process.env.JWT_KEY;
    User.find({ email: req.body.email }).exec().then(usr => {
        console.log(usr);
        if (usr.length < 1) {
            return res.status(401).json({
                message: 'Invalid email/password.'
            });
        }
        bcrypt.compare(req.body.password, usr[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Authentication Failed.'
                });
            }
            if (result) {
                const token =
                    jwt.sign(
                        {
                            email: usr[0].email, id: usr[0]._id
                        },
                        key,
                        {
                            expiresIn: '1h'
                        });
                console.log(token);
                return res.status(200).json({
                    message: 'Authentication Success.',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Authentication Failed.'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

exports.user_delete = (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User Deleted.'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}
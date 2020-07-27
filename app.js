const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

console.log('mongodbcredentials[username:' + process.env.MONGO_ATLAS_USR + ',pwd:' + process.env.MONGO_ATAS_PW + ']');

mongoose.connect(
    'mongodb+srv://' + process.env.MONGO_ATLAS_USR + ':' + process.env.MONGO_ATAS_PW + '@node-rest-shop.xe8gi.azure.mongodb.net/' + process.env.MONGO_ATLAS_DB + '?retryWrites=true&w=majority'
    , {
        //useMongoClient: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
);

mongoose.Promise = global.Promise;


const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

//Routes
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

app.use("/", (req, res, next) => { res.send("Node Rest API Build with Express and MongoDB") });

app.use((req, res, next) => {
    const error = new Error('NOT FOUND');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

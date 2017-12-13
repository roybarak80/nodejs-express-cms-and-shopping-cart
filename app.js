const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const ejs = require('ejs');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
const flash = require('connect-flash');
var fileUpload = require('express-fileupload');

mongoose.connect('mongodb://roy:12345@ds243805.mlab.com:43805/cmscart');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected');
});

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.locals.errors = null;
var Page = require('./models/page');


Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
   if (err) {
       console.log(err);
   }else{
     app.locals.pages = pages;
   }
});


app.use(fileUpload());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,

}));

// Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },

    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

var pages = require('./routes/pages.js');
var adminView = require('./routes/admin_view.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminProducts = require('./routes/admin_products.js');

app.use('/admin/pages', adminPages);
app.use('/admin_view', adminView);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);

app.use('/', pages);

var port = 3000;
app.listen(port, function () {
    console.log(`123`);
});
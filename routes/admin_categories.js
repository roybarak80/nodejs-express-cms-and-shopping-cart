var express = require('express');
var router = express.Router();

var Category = require('../models/category');


router.get('/', function (req, res) {
    Category.find(function(err, categories){
        if (err) return console.log(err);
        res.render('admin/categories', {
            categories: categories,

        });
    });



});

router.get('/add-category', function (req, res) {


    var title = '';
    res.render('admin/add_category', {
        title: title
    });

});


router.get('/add-page', function (req, res) {

    var title = 'Admin';
    var slug = '';
    var content = '';

    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content,
    });
});

router.post('/add-page', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({slug: slug}, function (err, page) {
            if (page) {
                req.flash('danger', 'page slug exists');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                var page = new Page({

                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                page.save(function (err) {
                    if (err) return console.log(err);
                    req.flash('success', 'page just added');
                    res.redirect('/admin/pages');
                });
            }
        });
    }

});

router.get('/edit-category/:id', function (req, res) {

    Category.findById( req.params.id, function (err, category) {
        if (err) return console.log(err);


        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });
    });
});

router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();


    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id:id
        });
    } else {
        Category.findOne({slug: slug, _id:{'$ne':id}}, function (err, category) {
            if (category) {
                req.flash('danger', 'category slug exists');
                res.render('admin/edit_category', {
                    title: title,
                    id:id
                });
            } else {
                Category.findById(id,function(err, category){

                    if(err) return console.log(err);
                    category.title = title;
                    category.slug = slug;
                    category.save(function (err) {
                        if (err) return console.log(err);
                        req.flash('success', 'page updated');
                        res.redirect('/admin/categories/edit-category/'+id);
                    });
                });

            }
        });
    }

});

router.post('/add-category', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title

        });
    } else {
        Category.findOne({slug: slug}, function (err, category) {
            if (category) {
                req.flash('danger', 'category title exists');
                res.render('admin/add_category', {
                    title: title,

                });
            } else {
                var category = new Category({

                    title: title,
                    slug: slug,

                });
                category.save(function (err) {
                    if (err) return console.log(err);
                    req.flash('success', 'category just added');
                    res.redirect('/admin/categories');
                });
            }
        });
    }

});

router.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, function(err){
        if(err) return console.log(err);
        req.flash('success', 'category deleted');
        res.redirect('/admin/categories/');
    })


});
module.exports = router;
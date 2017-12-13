var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {



        res.render('admin/admin_view',{
            title:'Admin Area'

        })

});

module.exports = router;
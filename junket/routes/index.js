var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    if(req.session.name) {
        if(req.session.admin == true){
            return res.redirect('/admin');
        }
        else{
            return res.redirect('/user');
        }
    }

    res.redirect('/auth/signin');
    
});

module.exports = router;
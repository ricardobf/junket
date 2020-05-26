var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    

    sess = req.session;
    if(sess.email) {
        return res.redirect('/user');
    }

    // se for user nao existente, vai pro signin
    res.redirect('/auth/signin');

    // se for user existente, vai pro user
    // se for user admin existente, vai pro admin
});

module.exports = router;
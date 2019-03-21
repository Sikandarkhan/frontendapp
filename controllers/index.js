var router = require('express').Router();
//var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


router.get('/', function (req, res) {
    res.render('index');
});


router.get('/signup', (req, res) => {
    res.render('signup');

});

router.get('/patient', (req, res) => {
    res.render('patient');

});
router.get('/scan', (req, res) => {
    res.render('scan');
});

router.get('/graph', (req, res) => {
    res.render('graph');

});
router.get('/settings', (req, res) => {
    res.render('settings');
});


module.exports = router;
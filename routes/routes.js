const express = require('express');
const router = express.Router();

const authController = require('../controllers/authenticate');

router.get('/authenticate', authController.getAuth);
router.post('/authenticate/:action', authController.postAuth);

const shopController = require('../controllers/shop');

router.get('/shop', shopController.getShop);

const adminController = require('../controllers/admin');

router.get('/admin', adminController.getAdmin);
router.post('/admin/:operation', adminController.postAdmin);

// ALWAYS LAST ROUTE

router.get('*', (req,res,next) => {
    res.status(404).send('<h1>Page not found</h1>')
});

module.exports = router;
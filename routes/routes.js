// DEFINE THE PATH / HTTP METHOD 

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authenticate');

router.get('/authenticate', authController.getAuth);
router.post('/authenticate/:action', authController.postAuth);
// const { LocalStorage } = require('node-localstorage');
// localStorage = new LocalStorage('./local_storage');

// router.get('/logout', (req,res,next) => {
//     localStorage.clear();
//     return res.redirect('/authenticate');
// });

const shopController = require('../controllers/shop');

router.get('/shop', shopController.getShop);

// const authController = require('../controllers/authenticate');
// const eventsController = require('../controllers/events');
// const profileController = require('../controllers/profile');

// router.get('/authenticate', authController.getAuth);


// router.get('/dashboard', eventsController.getEvents);
// router.post('/dashboard/events', eventsController.postAddEvent);

// router.get('/profile', profileController.getProfile);
// router.post('/profile', profileController.postProfile);
// router.post('/profile/event-delete', profileController.postDeleteFromCalendar);
// router.post('/profile/event-add', profileController.postAddFromSuggested);

// router.get('/logout', authController.logoutAuth);

// ALWAYS LAST ROUTE

router.get('*', (req,res,next) => {
    res.status(404).send('<h1>Page not found</h1>')
});

module.exports = router;
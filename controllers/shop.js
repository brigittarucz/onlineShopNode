const express = require('express');
const User = require('../models/user');
const uuid = require('uuid');
const emailValidator = require('email-validator');

const { LocalStorage } = require('node-localstorage');
const { fetchUser } = require('../models/user');
localStorage = new LocalStorage('./local_storage');

exports.getShop = (req, res, next) => {
    return res.render('shop/shop', {
        pageTitle: 'Shop',
        userId: localStorage.getItem('sessionId')
    })
}

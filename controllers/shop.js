const express = require('express');

const Product = require('../models/product');

const { LocalStorage } = require('node-localstorage');
localStorage = new LocalStorage('./local_storage');

exports.getShop = (req, res, next) => {
    // TODO: add images

    Product.fetchProducts().then(aProducts => {
        return res.render('shop/shop', {
            pageTitle: 'Shop',
            products: aProducts,
            userId: localStorage.getItem('sessionId')
        })
    }).catch(error => {
        console.log(new Error("Cannot get products"));
        return res.redirect('/authenticate');
    })
}


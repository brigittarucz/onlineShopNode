const express = require('express');

const Product = require('../models/product');

const { LocalStorage } = require('node-localstorage');
localStorage = new LocalStorage('./local_storage');

exports.getShop = (req, res, next) => {
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

exports.getViewProduct = (req, res, next) => {
    Product.fetchProducts().then(aProducts => {
        var productExists = 0;
        aProducts.forEach(product => {
            if(product._key == req.params.productId) {
                productExists = !productExists;
                return res.render('shop/item', {
                    pageTitle: product.name,
                    path: 'shop/item',
                    product: product,
                    userId: localStorage.getItem('sessionId')
                })
            }
        })

        if(!productExists) {
            return res.redirect('/shop');
        } 
    }).catch(error => {
        console.log(new Error("Cannot get product view"));
        return res.redirect('/shop');
    })
}
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
                var productView = new Product(product.brand, product.name, product.image, product.category, product.subcategory, product.form, parseFloat(product.price), parseInt(product.quantity), product.measurement_unit, parseInt(product.discount), product.ingredient);
                productExists = !productExists;

                productView.getRecommendations(product._id, product._key).then(recommendations => {
                    console.log(recommendations);
                    return res.render('shop/item', {
                        pageTitle: product.name,
                        path: 'shop/item',
                        product: product,
                        recommendations: recommendations,
                        userId: localStorage.getItem('sessionId')
                    })
                }).catch(error => {
                        console.log(new Error("Cannot get recommendations"));
                        // console.log(error);
                        return res.redirect('/shop');
                });
            }
        })

        if(!productExists) {
            return res.redirect('/shop');
        } 
        
    }).catch(error => {
        console.log(new Error("Cannot get product view"));
        // console.log(error);
        return res.redirect('/shop');
    })
}
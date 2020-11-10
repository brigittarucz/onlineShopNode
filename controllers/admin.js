const express = require('express');
const Product = require('../models/product');

exports.getAdmin = (req,res,next) => {

    Product.fetchIngredients().then(aIngredients => {
        Product.fetchEffects().then(aEffects => {
            return res.render('admin/admin', {
                pageTitle: 'Admin Panel',
                ingredients: aIngredients,
                effects: aEffects
            })
        }).catch(error => {
            console.log(new Error("Cannot get ingredient effects"));
        return res.redirect('/shop');
        })
        
    }).catch(error => {
        console.log(new Error("Cannot get ingredients"));
        return res.redirect('/shop');
    });
    
}

exports.postAdmin = (req,res,next) => {
    // return console.log(req.params.operation);
    var obj = req.body;
    return console.log(obj);

}
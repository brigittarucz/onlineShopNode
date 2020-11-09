const express = require('express');
const User = require('../models/user');
const uuid = require('uuid');
const emailValidator = require('email-validator');

const { LocalStorage } = require('node-localstorage');
const { fetchUser } = require('../models/user');
localStorage = new LocalStorage('./local_storage');

exports.getAuth = (req, res, next) => {
    return res.render('auth/authenticate', {
        pageTitle: 'Authentication',
    })
}

// exports.logoutAuth = (req, res, next) => {
//     localStorage.setItem('sessionId', '');
//     return res.render('auth/authenticate', {
//         pageTitle: 'Authentication',
//     })
// }

exports.postAuth = (req, res, next) => {
    if(req.params.action == 'login') {
        User.fetchUser(req.body.email).then(result => {4
                console.log(result[0]);
                var oUser = result[0];
                if(oUser.length) {
                    oUser = oUser[0];
                    if(oUser.password == req.body.password) {
                        localStorage.setItem('sessionId', oUser.id_users);
                        return res.redirect('/shop');
                    } else {
                        console.log(new Error("Invalid password"));
                        res.redirect('/authenticate');
                    }
                } else {
                    console.log(new Error("Invalid credentials"));
                    res.redirect('/authenticate');
                }
        }).catch(error => {
                console.log(new Error(error));
                res.redirect('/authenticate');
        });
        // console.log(req.body.email);
        // console.log(req.body.password);
    } 
    
    if(req.params.action == 'signup') {


        if(!emailValidator.validate(req.body.email)) {
            console.log(new Error("Invalid email"));
            res.redirect('/authenticate');
        } 

        if(!(req.body.password.length >= 8)) {
            console.log(new Error("Password length too short"));
            res.redirect('/authenticate');
        }

        if(!(req.body.password === req.body.repeatpassword)) {
            console.log(new Error("Passwords do not match"));
            res.redirect('/authenticate');
        }

        if(req.body.country.length === 0) {
            console.log(new Error("Country field is empty"));
            res.redirect('/authenticate');
        }

        if(req.body.city.length === 0) {
            console.log(new Error("City field is empty"));
            res.redirect('/authenticate');
        }

        fetchUser(req.body.email).then(result => {
            if(result[0].length) {
                console.log(new Error("User already exists"));
                res.redirect('/authenticate');
            } else {

                const user = new User(req.body.first_name, req.body.last_name, req.body.email, 
                    req.body.password, req.body.country, req.body.city, req.body.street.length === 0 ? 0 : req.body.street,
                    req.body.postal_code.length === 0 ? 0 : req.body.postal_code,
                    req.body.birthdate, parseInt(req.body.hair_color), parseInt(req.body.skin_color));
        
                user.createUser().then(newUser => {
                    console.log(result);
                    localStorage.setItem('sessionId', newUser[0]["insertId"]);
                    return res.redirect('/shop');
                }).catch(error => {
                    console.log(new Error("User cannot be created"));
                    res.redirect('/authenticate');
                })
            }
        })
       
    }
}


const e = require('express');
const db = require('../util/arangoDb'); 

module.exports = class Product {
    constructor(brand, name, created, image, category, subcategory, form, price, quantity, measurement_unit, discount, key_ingredients) {
        this.brand = brand;
        this.name = name;
        this.created = new Date().getTime();
        this.image = image;
        this.category = category;
        this.subcategory = subcategory;
        this.form = form;
        this.price = price;
        this.currency = 'dkk';
        this.quantity = quantity;
        this.measurement_unit = measurement_unit;
        this.discount = discount;
        this.rating = 0;
        this.total_purchases = 0;
        this.total_reviews = 0;
        this.key_ingredients = key_ingredients;
        this.key_scents = [];
    };



    // Static methods operate on the class instead of instances of the class, they are called on the class

    static fetchProducts() {
        var connection = db.query('FOR products IN productsVertices RETURN products').then(value => {
            return value.all();
        })

        return connection;
    }

    static fetchIngredients() {
        var connection = db.query('FOR ingredient IN ingredientsVertices RETURN ingredient.ingredient_name').then(value => {
            return value.all();
        })

        return connection;
    }

    static fetchEffects() {
        var connection = db.query('FOR effect IN effectsVertices RETURN effect').then(value => {
            return value.all();
        })

        return connection;
    }
}
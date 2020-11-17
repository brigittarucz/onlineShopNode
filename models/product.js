const e = require('express');
const db = require('../util/arangoDb'); 

module.exports = class Product {
    constructor(brand, name, image, category, subcategory, form, price, quantity, measurement_unit, discount, key_ingredients) {
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
        this.discount = discount != '' ? discount : 0;
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
        var connection = db.query('FOR ingredient IN ingredientsVertices RETURN ingredient').then(value => {
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

    getProductByName(name) {
        var connection = db.query({query: 'FOR product IN productsVertices FILTER product.name == @name RETURN product.name', bindVars: {name: name}}).then(value => {
            return value.all();
        })

        return connection;
    }

    createProduct(newProduct) {
        var connection = db.query({query: 'INSERT @product INTO productsVertices RETURN NEW', bindVars: {product: newProduct}}).then(value => {
            return value.all();
        })

        return connection;
    }

    createIngredient(key, name) {
        var newIngredient = {
            _key: key,
            ingredient_name: name
        }

        var connection = db.query({query: 'INSERT @ingredient INTO ingredientsVertices RETURN NEW', bindVars: {ingredient: newIngredient}}).then(value => {
            return value.all();
        })

        return connection;
    }

    getIngredientByKey(key) {
        var connection = db.query({query: 'FOR ingredient IN ingredientsVertices FILTER ingredient._key == @ingredientKey RETURN ingredient._key', bindVars: {ingredientKey: key}}).then(value => {
            return value.all();
        })

        return connection;
    }

    createEffect(key, effect) {   
        var newEffect = {
            _key: key,
            effect: effect 
        }

        var connection = db.query({query: 'INSERT @effect INTO effectsVertices RETURN NEW', bindVars: {effect: newEffect}}).then(value => {
            return value.all();
        })

        return connection;
    }

    getEffectByKey(key) {
        var connection = db.query({query: 'FOR effect IN effectsVertices FILTER effect._key == @effectKey RETURN effect._id', bindVars: {effectKey: key}}).then(value => {
            return value.all();
        })

        return connection;
    }

    createFromProductToIngredientEdge(productId, ingredientId, type) {
        var newEdge = {
            _from: productId,
            _to: ingredientId,
            type: type
        };

        var connection = db.query({query: 'INSERT @edge INTO shopEdges RETURN NEW', bindVars: {edge: newEdge}}).then(value => {
            return value.all();
        })

        return connection;
    }

    createFromIngredientToEffectEdge(ingredientId, effectId, type) {
        var newEdge = {
            _from: ingredientId,
            _to: effectId,
            type: type
        };

        var connection = db.query({query: 'INSERT @edge INTO shopEdges RETURN NEW', bindVars: {edge: newEdge}}).then(value => {
            return value.all();
        })

        return connection;
    }
}
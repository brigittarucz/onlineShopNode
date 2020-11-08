const e = require('express');
const db = require('../util/mariaDb'); 

module.exports = class User {
    constructor(first_name, last_name, email, password, created, country, city, street,
                postal_code, birthdate, hair_color, skin_color) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        // TODO: hash
        this.password = password;
        this.created = created;
        this.country = country;
        this.city = city;
        this.street = street ? street : "";
        this.postal_code = postal_code ? postal_code : 0;
        this.birthdate = birthdate ? birthdate : "1900-01-01";
        this.hair_color = hair_color ? hair_color : 0;
        this.skin_color = skin_color ? skin_color : 0;
        this.previous_transactions = "";
        this.dominating_brand = "";
        this.dominating_product_subcategory = "";
        this.product_reviews = "";
    }

    // static fetchUser(email) {
    //     return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    // }

    createUser() {
        return db.execute('INSERT INTO users (first_name, last_name, email, password, created, country, city, street, postal_code, birthdate, hair_color, skin_color, previous_transactions, dominating_brand, dominating_product_subcategory, product_reviews ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [ this.first_name, this.last_name, this.email, this.password, this.created, this.country, this.city, this.street, this.postal_code, this.birthdate, this.hair_color, this.skin_color, this.previous_transactions, this.dominating_brand, this.dominating_product_subcategory, this.product_reviews]);
    }

    // static fetchUserById(id) {
    //     return db.execute('SELECT * FROM users WHERE users.id = ?', [id]);
    // }

    // saveUser() {
    //     return db.execute('UPDATE users SET email = ?, password = ?, proffesion = ?, experience = ?, interests = ? WHERE users.id = ?', 
    //     [this.email, this.password, this.proffesion, this.experience, this.interests, this.id]);
    // }

    // static updateUserEvents(id, event) {
    //     return db.execute('UPDATE users SET events = ? WHERE users.id = ?', [event, id]);
    // }

}

const express = require('express');
const Product = require('../models/product');
const db = require('../util/arangoDb');

exports.getAdmin = (req, res, next) => {

    Product.fetchIngredients().then(aIngredients => {
        Product.fetchEffects().then(aEffects => {
            Product.fetchProducts().then(aProducts => {
                return res.render('admin/admin', {
                    pageTitle: 'Admin Panel',
                    ingredients: aIngredients,
                    effects: aEffects,
                    products: aProducts
                })
            }).catch(error => {
                console.log(new Error("Cannot get products"));
                return res.redirect('/shop');
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

exports.postAdmin = (req, res, next) => {
    console.log(req.params.operation);

    if(req.params.operation == "create") {
        // Add to it if you add a new input field
        var iInputFieldsToJumpOver = 11;
        var aIngredientsSanitized = [];
        var obj = req.body;
        var aIngredientsExistent = [];
        var iIngredientCount;
        
        obj.ingredient.forEach(ingredient => {
            aIngredientsExistent.push(ingredient);
        })

        // If ingredient_name property exists on object
        if (obj.ingredient_name) {
            // If ingredient_name !empty || typeof(string)
            if (obj.ingredient_name.length != 0) {
                if (typeof (obj.ingredient_name) != "string") {
                    iIngredientCount = obj.ingredient_name.length;
                } else {
                    iIngredientCount = 1;
                }
            }
        } else {
            iIngredientCount = 0;
        }

        if (iIngredientCount) {

            var properties = Object.getOwnPropertyNames(obj);

            if (iIngredientCount != 1) {
                // Builds initial sanitized ingredients object
                for (let i = 0; i < obj.ingredient_name.length; i++) {
                    aIngredientsSanitized[i] = {
                        name: obj.ingredient_name[i],
                        effects: []
                    };
                    obj.ingredient.push(obj.ingredient_name[i].replace(/\s+/g, '-'));
                }
            } else {
                aIngredientsSanitized[0] = {
                    name: obj.ingredient_name,
                    effects: []
                };
                obj.ingredient.push(obj.ingredient_name.replace(/\s+/g, '-'));
            }

            for (let i = iInputFieldsToJumpOver; i < properties.length; i++) {
                // Checks if property is empty
                if (obj[properties[i]].length) {
                    var iArrayObject = parseInt(properties[i].match(/\d+/g));
                    if (properties[i].includes("ingredient_effect")) {
                        aIngredientsSanitized[iArrayObject - 1].effects.push(obj[properties[i]]);
                    }

                    // If property includes key then it has a new effect added
                    if (properties[i].includes("_key")) {

                        // Check if form has empty submitted effects
                        if (obj[properties[i]][0].length != 0) {
                            if (typeof (obj[properties[i]]) == "string") {
                                var oNewEffect = {
                                    // Make sure effect key does not have space
                                    effect_key: obj[properties[i]].replace(/\s+/g, '-'),
                                    effect_description: obj[properties[i + 1]],
                                    effect_type: obj[properties[i + 2]]
                                }

                                aIngredientsSanitized[iArrayObject - 1].new_effect = oNewEffect;

                            } else {

                                var aNewEffects = [];

                                obj[properties[i]].forEach(effectProperty => {

                                    // Check if any array effect is empty
                                    if (effectProperty.length != 0) {
                                        var oNewEffect = {
                                            effect_key: effectProperty.replace(/\s+/g, '-'),
                                            effect_description: obj[properties[i + 1]][aNewEffects.length],
                                            effect_type: obj[properties[i + 2]][aNewEffects.length]
                                        }

                                        aNewEffects.push(oNewEffect);
                                    }

                                });

                                aIngredientsSanitized[iArrayObject - 1].new_effect_1 = aNewEffects[0] ? aNewEffects[0] : 0;
                                aIngredientsSanitized[iArrayObject - 1].new_effect_2 = aNewEffects[1] ? aNewEffects[1] : 0;
                            }
                        }
                        i + 2;
                    }
                }
            }

            // Remove all strings added and add the sanitized object
            for (let i = iInputFieldsToJumpOver; i < properties.length; i++) {
                delete obj[properties[i]];
            }
        }

        // console.log(aIngredientsSanitized);
        var newProduct = new Product(obj.brand, obj.name, obj.image, obj.category, obj.subcategory, obj.form, parseFloat(obj.price), parseInt(obj.quantity), obj.measurement_unit, parseInt(obj.discount), obj.ingredient);
        newProduct.getProductByName(newProduct.name).then(productExists => {
            if(!productExists.length) {
                newProduct.createProduct(newProduct).then(resultCreateProduct => {
                    var sNewProductKey = resultCreateProduct[0]._key;
                    var sNewProductId = resultCreateProduct[0]._id;
                    var sIngredientCollection = "ingredientsVertices/";
            
                    // If new ingredient exists
                    if (aIngredientsSanitized) {
                        aIngredientsSanitized.forEach(oIngredient => {
                            var sIngredientKey = oIngredient.name.replace(/\s+/g, '-');
            
                            // Check if ingredient exists in the db
                            var sNewIngredientCreated = newProduct.getIngredientByKey(sIngredientKey).then(keyExists => {
            
                                // console.log("Ingredient exists:" + keyExists + " " + keyExists.length);
            
                                if (keyExists.length) {
            
                                    // Connect product - ingredient edge
                                    newProduct.createFromProductToIngredientEdge(sNewProductId, sIngredientCollection + sIngredientKey, "has").then(resultNewEdgePI => {
                                        // console.log(resultNewEdgePI);
                                    }).catch(error => {
                                        return console.log(error.response.body);
                                    })
            
                                    console.log("Did not create new ingredient, only new edge. User input on new ingredient consisted of existent one.");
                                    return 0;
            
                                } else {
                                    // Add new ingredient to the db
            
                                    newProduct.createIngredient(sIngredientKey, oIngredient.name).then(() => {
            
                                        // Connect product - ingredient edge
                                        newProduct.createFromProductToIngredientEdge(sNewProductId, sIngredientCollection + sIngredientKey, "has").then(resultNewEdgePI => {
                                            // console.log(resultNewEdgePI);
                                        }).catch(error => {
                                            return console.log("Error when creating product to ingredient edge: " + error.response.body.message);
                                        })
                                        
                                    }).catch(error => {
                                        return console.log("Error when creating new ingredient: " + error.response.body.message);
                                    })
            
                                    console.log("Did create both ingredient and new edge");
                                    return 1;
                                }
                            })
            
                            // Check if ingredient has new effects and if yes store them in new array
                            var ingredientProperties = Object.getOwnPropertyNames(oIngredient);
                            var ingredientNewEffectsProperties = [];
                            if (ingredientProperties.length > 2) {
                                ingredientNewEffectsProperties = ingredientProperties.slice(2, ingredientProperties.length);
                            }
            
                            // sNewIngredientCreated.then(result => console.log(result));
            
                            sNewIngredientCreated.then(sNewIngredientCreatedStatus => {
                                // If new effects exist from user
                                if (ingredientNewEffectsProperties.length) {
            
                                    // Store new effect in the db
                                    ingredientNewEffectsProperties.forEach(sEffectSelector => {
            
                                        // Check each effect if it exists in the database
                                        newProduct.getEffectByKey(oIngredient[sEffectSelector].effect_key).then(keyExists => {
                                            // console.log(keyExists);
                                            // console.log(sNewIngredientCreatedStatus);
            
                                            if (keyExists.length) {
                                                if (!sNewIngredientCreatedStatus) {
                                                    console.log("Effect and ingredient already exists; no new edge between the two");
                                                    return 0;
                                                } else {
            
                                                    // If ingredient did not exist before one ought to create ingredient - effect edge
                                                    newProduct.createFromIngredientToEffectEdge(sIngredientCollection + sIngredientKey, keyExists[0], oIngredient[sEffectSelector].effect_type).then(resultNewEdgeIE => {
                                                        // console.log(resultNewEdgeIE);
                                                        console.log("Did not create new effect because it exists, but created new edge between ingredient and effect");
                                                    }).catch(error => {
                                                        return console.log("Error when creating ingredient to effect edge: " + error.response.body.message);
                                                    })
                                                }
                                            } else {
            
            
                                                // If effect does not exist
            
                                                newProduct.createEffect(oIngredient[sEffectSelector].effect_key, oIngredient[sEffectSelector].effect_description).then(resultNewEffect => {
            
                                                    // Connect ingredient - effect edge
                                                    newProduct.createFromIngredientToEffectEdge(sIngredientCollection + sIngredientKey, resultNewEffect[0]._id, oIngredient[sEffectSelector].effect_type).then(resultNewEdgeIE => {
                                                        // console.log(resultNewEdgeIE);
                                                        console.log("Created both effect and effect ingredient edge");
                                                    }).catch(error => {
                                                        return console.log("Error when creating ingredient to effect edge: " + error.response.body.message);
                                                    })
                        
            
                                                }).catch(error => {
                                                    return console.log("Error when creating effect: " + error.response.body.message);
                                                })
                        
                                            }
                                            
                                        })
                                        
                                    });
                                }
            
                            })
                        
                        });
            
            
                    }
            
                    // Draw edges between existent ingredient and product
                    if (aIngredientsExistent) {
                        aIngredientsExistent.forEach(ingredientExistent => {
                            // Connect product - ingredient edge
                            newProduct.createFromProductToIngredientEdge(sNewProductId, sIngredientCollection + ingredientExistent, "has").then(resultNewEdgePI => {
                                // console.log(resultNewEdgePI);
                            }).catch(error => {
                                return console.log("Error when creating product to ingredient edge: " + error.response.body.message);
                            })
            
                            console.log("Created edge between existent ingredient and new product");
            
                        })
                    }
            
                }).catch(error => {
                    console.log(error.response.body.message);
                })
            
            }
        })
    }

    if(req.params.operation == "remove") {
        console.log("remove");
    }
    
}
var selectCategory = document.querySelector("#select-category");
var selectSubcategory = document.querySelector("#select-subcategory");

selectCategory.addEventListener("change", generateSelectSubcategory);

function generateSelectSubcategory() {
    selectSubcategory.innerHTML = "";
    var category = event.target.value;

    switch(category) {
        case "skin-care":
            var aSubcategories = ['facial-care', 'body-care'];
            break;
        case "makeup":
            var aSubcategories = ['face', 'lips', 'eyes'];
            break;
        case "hair":
            var aSubcategories = ['hair-care', 'hair-styling'];
    }

    aSubcategories.forEach(subcategory => {
        var htmlTemplate = `<option value="${subcategory}">${subcategory.includes('-') ? subcategory.replace('-',' ') : subcategory}</option>`;
        selectSubcategory.insertAdjacentHTML('beforeend', htmlTemplate);
    });


}

var createIngredientBtn = document.querySelector("#create-ingredient");
var ingredientContainer = document.querySelector(".ingredients__container-new");

var ingredientTemplate = document.querySelector("#template-ingredient").content;
var effectTemplate = document.querySelector("#template-effect").content;

createIngredientBtn.addEventListener("click", addIngredientFormElements);

var counterIngredientFields = 1; 

function addIngredientFormElements() {
    event.preventDefault();

    if(ingredientContainer.children.length < 3) {
        var clone = ingredientTemplate.cloneNode(true);
        var createIngredientBtn = clone.querySelector("#create-effect");

        clone.querySelector("#ingredient_name-input").setAttribute("name", `ingredient[${counterIngredientFields}][ingredient_name]`);
        clone.querySelector("#ingredient_effect-select_a").setAttribute("name", `ingredient[${counterIngredientFields}][ingredient_effect-a]`);
        clone.querySelector("#ingredient_effect-select_b").setAttribute("name", `ingredient[${counterIngredientFields}][ingredient_effect-b]`);
        clone.querySelector("#ingredient_effect-select_c").setAttribute("name", `ingredient[${counterIngredientFields}][ingredient_effect-c]`);
        counterIngredientFields++;
        createIngredientBtn.addEventListener("click", addEffectFormElements);

        clone.querySelector("#remove-ingredient").addEventListener("click", () => {
            event.target.parentElement.remove();
        });

        ingredientContainer.appendChild(clone);
    } else {
        alert('No more ingredients allowed!');
    }
}


function addEffectFormElements() {
    event.preventDefault();

    var effectContainer = event.target.parentElement.querySelector(".effects__container-new");
    
    if(effectContainer.children.length < 2) {
        var counterParentElement = event.target.parentElement.querySelector("#ingredient_name-input").getAttribute("name");
        counterParentElement = counterParentElement.match(/\d+/g); 

        var clone = effectTemplate.cloneNode(true);
        clone.querySelector("#effect_key-input").setAttribute("name", `ingredient[${counterParentElement[0]}][effect_key${effectContainer.children.length === 0 ? '-a' : '-b'}]`);
        clone.querySelector("#effect_description-input").setAttribute("name", `ingredient[${counterParentElement[0]}][effect_description]`);
        clone.querySelector("#effect_type-select").setAttribute("name", `ingredient[${counterParentElement[0]}][effect_type]`);
        
        clone.querySelector("#remove-effect").addEventListener("click", () => {
            event.target.parentElement.remove();
        });        
        effectContainer.appendChild(clone);
    } else {
        alert('No more effects allowed!');
    }
}




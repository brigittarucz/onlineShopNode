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

function addIngredientFormElements() {
    event.preventDefault();
    var clone = ingredientTemplate.cloneNode(true);
    var createIngredientBtn = clone.querySelector("#create-effect");
    createIngredientBtn.addEventListener("click", addEffectFormElements);

    clone.querySelector("#remove-ingredient").addEventListener("click", () => {
        console.log("here");
        event.target.parentElement.remove();
    });
    ingredientContainer.appendChild(clone);
}

function addEffectFormElements() {
    event.preventDefault();
    var effectContainer = event.target.parentElement.querySelector(".effects__container-new");
    console.log(effectContainer.children.length);
    if(effectContainer.children.length < 2) {
        var clone = effectTemplate.cloneNode(true);
        clone.querySelector("#remove-effect").addEventListener("click", () => {
            event.target.parentElement.remove();
        });        
        effectContainer.appendChild(clone);
    } else {
        alert('No more effects allowed!');
    }
}




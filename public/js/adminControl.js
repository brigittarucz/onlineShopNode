window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".remove-product").forEach(form => {
        form.querySelectorAll("button").forEach(button => {
            console.log(button);
            button.addEventListener("click", removeProduct);
        })
    });
});

function removeProduct() {
    var productId = event.target.parentElement.querySelector("input").value;
    document.querySelector(`[data-productid="${productId}"]`).remove();
    document.querySelector(`[data-formproductid="${productId}"]`).remove();
}


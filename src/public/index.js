const socket=io();
const table= document.getElementById("real-time-products-table");
const deleteButton= document.getElementById("delete-product-button");

function addProduct() {
    let form = document.getElementById("add-product-form");
    form.style.display = "block";
  }
  
  document.getElementById("newProductForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    Swal.fire({
        title: "Product",
        text: "Product added successfully!",
        icon: "success",
        width: '300px',
        height: '110px',
        allowOutsideClick: false
        });
});

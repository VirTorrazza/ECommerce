const socket=io();
const table= document.getElementById("real-time-products-table");
const deleteButton= document.getElementById("delete-product-button");

function addProduct() {
    let form = document.getElementById("add-product-form");
    form.style.display = "block";
  }

function deleteProduct(id){
  Swal.fire({
    title: "Product deletion",
    text: "Are you sure you want to delete this product?",
    icon: "warning",
    width: '300px',
    height: '110px',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "The product has been deleted.",
        icon: "success",
        width: '300px',
        height: '110px',
        allowOutsideClick: false
      });
    }
  }); 
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

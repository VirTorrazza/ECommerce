const socket = io();
let form = document.getElementById("add-product-form");
function addProduct() {
  form.style.display = "block";
}

function addProductToTable(event) {
  event.preventDefault(); 

  let body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value
  };

  fetch('/products', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(result => result.json())
  .then(result => {
    if (result.status === 'error') {
      throw new Error(result.error);
    }
    socket.emit('productsList', result.payload);
    form.style.display = "none";
    Swal.fire({
      title: "Product",
      text: "Product added successfully!",
      icon: "success",
      width: '300px',
      height: '110px',
      allowOutsideClick: false
    });
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Error: ' + err.message);
  });
}

function deleteProduct(id) {
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

document.getElementById("newProductForm").addEventListener("submit", addProductToTable);

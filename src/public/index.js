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
    method: 'POST',
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

async function deleteProduct(pid) {
  try {
    const response = await fetch(`/products/${pid}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      const result = await response.json();
      
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
          socket.emit('productsList', result.payload);
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
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error.message);
    
  }
}

socket.on("updateProducts",(data) =>{
  let table= document.getElementById("real-time-products-table");
  let HTMLTable=`
  <thead>
    <tr>
      <th scope="col">Title</th>
      <th scope="col">Description</th>
      <th scope="col">Code</th>
      <th scope="col">Price</th>
      <th scope="col">Stock</th>
      <th scope="col">Category</th>
    </tr>
  </thead>`

  data.forEach(element => {

    HTMLTable += `
    <tr>
          <td>${element.title}</td>
          <td>${element.description}</td>
          <td>${element.code}</td>
          <td>${element.price}</td>
          <td>${element.stock}</td> 
          <td>${element.category}</td>
          <td>
            <div class="btn-group" role="group" aria-label="Product Actions">
              <button class="btn btn-outline-danger" id="delete-product-button" data-product-id="delete-${element.id}" type="button" data-bs-toggle="tooltip" onclick="deleteProduct(${this.id})" data-bs-placement="top" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
            <td>
              <button class="btn btn-outline-primary" id="add-product-button" data-product-id="add-${element.id}" type="button" data-bs-toggle="tooltip" onclick="addProduct()" data-bs-placement="top" title="Add">
                <i class="fas fa-plus"></i>
              </button>
            </td>
          </div>
        </tr>
    `
  });

table.innerHTML=HTMLTable;
})

document.getElementById("newProductForm").addEventListener("submit", addProductToTable);

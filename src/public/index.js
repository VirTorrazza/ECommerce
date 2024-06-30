const socket = io();
let form = document.getElementById("add-product-form");
function addProduct() {
  form.style.display = "block";
}

function capitalizeFirstLetter(string) {   // Function to standarize data format to be stored
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function addProductToTable(event) {
  event.preventDefault(); 
  let title = document.getElementById("title").value.trim();
  let code = document.getElementById("code").value.trim();
  let price = document.getElementById("price").value.trim();
  let stock = document.getElementById("stock").value.trim();
  let category = document.getElementById("category").value.trim();
  let description = document.getElementById("description").value.trim();

  let titleInput = document.getElementById("title");
  let codeInput = document.getElementById("code");
  let priceInput = document.getElementById("price");
  let stockInput = document.getElementById("stock");
  let categoryInput = document.getElementById("category");
  let descriptionInput = document.getElementById("description");

  titleInput.style.border = '';
  codeInput.style.border = '';
  priceInput.style.border = '';
  stockInput.style.border = '';
  categoryInput.style.border = '';


  if (title === "" || code === "" || price === "" || stock === "" || category === ""|| description === "") {
    Swal.fire({
      title: "Error",
      text: "All fields must be filled out",
      icon: "error",
      toast: true,
      position: "center",
      allowEscapeKey: false ,
      allowEnterKey :false ,
      stopKeyDownPropagation :true,
      confirmButtonColor:'#FA8072',
      confirmButtonAriaLabel:'Ok'
    });
    
    if (titleInput.value.trim() === "") {
      titleInput.style.border = '2px solid #FA8072';
    }
    if (codeInput.value.trim() === "") {
      codeInput.style.border = '2px solid #FA8072';
    }
    if (priceInput.value.trim() === "") {
      priceInput.style.border = '2px solid #FA8072';
    }
    if (stockInput.value.trim() === "") {
      stockInput.style.border = '2px solid #FA8072';
    }
    if (categoryInput.value.trim() === "") {
      categoryInput.style.border = '2px solid #FA8072';
    }
    if (descriptionInput.value.trim() === "") {
      descriptionInput.style.border = '1px solid #FA8072';
    }

    setTimeout(() => {
      titleInput.style.border = '';
      codeInput.style.border = '';
      priceInput.style.border = '';
      stockInput.style.border = '';
      categoryInput.style.border = '';
      descriptionInput.style.border = '';
    }, 5000);

      return; 
  }

  if ((isNaN(parseFloat(price)) || parseFloat(price) < 0) && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
    Swal.fire({
      title: "Error",
      text: "Price and stock must be valid non-negative numbers",
      icon: "error",
      toast: true,
      position: "center",
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeyDownPropagation: true,
      confirmButtonColor: '#FA8072',
      confirmButtonAriaLabel: 'Ok'
    });
    priceInput.style.border = '2px solid #FA8072';
    stockInput.style.border = '2px solid #FA8072';

    setTimeout(() => {
      priceInput.style.border = '';
      stockInput.style.border = '';
    }, 5000);
    return;
  }

  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    Swal.fire({
      title: "Error",
      text: "Price must be a valid numberic value",
      icon: "error",
      toast: true,
      position: "center",
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeyDownPropagation: true,
      confirmButtonColor: '#FA8072',
      confirmButtonAriaLabel: 'Ok'
     
    });
    priceInput.style.border = '2px solid #FA8072';
    
    setTimeout(() => {
      priceInput.style.border = '';
    }, 5000);

    return;
  }

  if (isNaN(parseInt(stock)) || parseInt(stock) < 0){
    Swal.fire({
      title: "Error",
      text: "Stock must be a valid numberic value",
      icon: "error",
      toast: true,
      position: "center",
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeyDownPropagation: true,
      confirmButtonColor: '#FA8072',
      confirmButtonAriaLabel: 'Ok'
    });
    stockInput.style.border = '2px solid #FA8072';

    setTimeout(() => {
      stockInput.style.border = '';
    }, 5000);

    return;
  }
  
  const tableRows = document.querySelectorAll('#real-time-products-table tbody tr');
  for (let row of tableRows) {
    let rowCode = row.cells[2].textContent; 
    if (rowCode === code) { // Check if a product with the same code already exists
      Swal.fire({
        title: "Error",
        text: "A product with the same code already exists",
        icon: "error",
        toast: true,
        position: "center",
        allowEscapeKey: false ,
        allowEnterKey :false ,
        stopKeyDownPropagation :true,
        confirmButtonColor:'#FA8072',
        confirmButtonAriaLabel:'Ok'
      });
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("code").value = "";
      document.getElementById("price").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("category").value = "";
      return; 
    }
  }


  let body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value
  };

  console.log("soy el body"+ JSON.stringify(body))
  fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(async result =>  {
    const r = await result.json()
    console.log("soy el resultado" + JSON.stringify(r) )

    return r
  })
  .then(result => {
    if (result.message === 'Internal Server Error') {
      console.log ("Soy result 2" + result)
      throw new Error(result.message);
    }
    let r= result;
    console.log("segundo episodio" + r);
  return r
  })
  .then(()=>fetch(
    '/api/products', {
      method:'GET'
    }
  ))
  .then (async result=> {
    const r = await result.json()
    console.log("soy el resultado 2episodio2" + JSON.stringify(r) )

    
   return r
  })
  .then(result => {
    console.log("Soy result" + result)
    if (result.message === ' Internal Server Error') {
      throw new Error(result.message);
    }
    socket.emit('productsList', result.payload);
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("code").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("category").value = "";
    
    form.style.display = "none";
    Swal.fire({
      title: "Product",
      text: "Product added successfully!",
      icon: "success",
      toast: true,
      position: "center",
      allowEscapeKey: false ,
      allowEnterKey :false ,
      stopKeyDownPropagation :true,
      confirmButtonColor:'#90EE90',
      confirmButtonAriaLabel:'Ok'
    });
  })
  .catch(err => {
    //console.log('Error:'+ err);
    alert('Error: ' + err.message);
  });
}

function deleteProduct(pid) {
  console.log("soy el pid" +pid)
  Swal.fire({ // Ask for confirmation before deleting
    title: "Are you sure you want to delete this product?",
    text: "This action cannot be undone.",
    icon: "warning",
    toast: true,
    position: "center",
    showCancelButton: true,
    allowEscapeKey: false,
    allowEnterKey: false,
    stopKeyDownPropagation: true,
    confirmButtonColor: "#90EE90",
    cancelButtonColor: "#FA8072",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    confirmButtonAriaLabel: 'Confirm deletion',
    didOpen: () => { 
      document.querySelectorAll('.btn').forEach(btn => {
        btn.style.display = 'none';
      });
    },
    didClose: () => {     
      document.querySelectorAll('.btn').forEach(btn => {
        btn.style.display = '';
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {      
      fetch(`/api/products/${pid}`, {
        method: 'DELETE',
      })
        .then(result => {
          console.log("soy el result status"+ result.status)
          if (result.status === 204) {
            socket.emit('deletedProduct');
            Swal.fire({
              title: "Deleted!",
              text: "The product has been deleted.",
              icon: "success",
              toast: true,
              position: "center",
              allowEscapeKey: false,
              allowEnterKey: false,
              stopKeyDownPropagation: true,
              confirmButtonColor: '#90EE90',
              confirmButtonAriaLabel: 'Ok',
              didOpen: () => { // Hide icons when alert is opened
                document.querySelectorAll('.btn').forEach(btn => {
                  btn.style.display = 'none';
                });
              },
              didClose: () => {     // Restore icons when alert is closed
                document.querySelectorAll('.btn').forEach(btn => {
                  btn.style.display = '';
                });
              }              
            });
          } else {
            console.error("Error deleting product:", result.statusText);
            Swal.fire({
              title: "Error",
              text: "An error occurred while deleting the product.",
              icon: "error",
              toast: true,
              position: "center",
              allowEscapeKey: false,
              allowEnterKey: false,
              stopKeyDownPropagation: true,
              confirmButtonColor: '#FA8072',
              confirmButtonAriaLabel: 'Ok'
            });
          }
        })
        .catch(error => {
          console.error("Error deleting product:", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while deleting the product.",
            icon: "error",
            toast: true,
            position: "center",
            allowEscapeKey: false,
            allowEnterKey: false,
            stopKeyDownPropagation: true,
            confirmButtonColor: '#FA8072',
            confirmButtonAriaLabel: 'Ok'
          });
        });
    }
  });
}

socket.on("updateProducts",(data) =>{
  console.log("DATA" +JSON.stringify(data))
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

  data.docs.forEach(element => {
    let code = element.code.toUpperCase();
    let title = capitalizeFirstLetter(element.title);
    let description = capitalizeFirstLetter(element.description)

    HTMLTable += `
    <tr>
          <td>${title}</td>
          <td>${description}</td>
          <td>${code}</td>
          <td>${element.price}</td>
          <td>${element.stock}</td> 
          <td>${element.category}</td>
          <td>
            <div class="btn-group" role="group" aria-label="Product Actions">
              <button class="btn btn-outline-danger" id="delete-product-button" data-product-id="delete-${element.id}" type="button" data-bs-toggle="tooltip" onclick="deleteProduct((${element.id}))" data-bs-placement="top" title="Delete">
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

// ... (tu código actual, asegurando las importaciones y setup)

// Función para actualizar la lista de productos
async function updateProductList() {
  try {
      // Obtener los productos actualizados de la API
      const updatedProducts = await añadirProductos();

      // Renderizar la lista de productos actualizada
      renderProducts(updatedProducts);
  } catch (error) {
      console.error('Error al actualizar la lista de productos:', error);
  }
}

// Función para renderizar los productos en el DOM
function renderProducts(products) {
  const productsContainer = document.getElementById('products-container'); // Corregir selector
  productsContainer.innerHTML = ''; // Limpia el contenido anterior

  products.forEach(product => {
      const productCard = `
            <div class="card" data-id="${product.id}"> <!-- Asegúrate de que cada tarjeta tenga un data-id -->
                <img class="image" src="${product.url}" alt="${product.name}"/>
                <div class="card-container--info">
                    <p class="name">${product.name}</p>
                    <div class="card-container--value">
                        <p class="price">$ ${product.price.toFixed(2)}</p>
                        <button class="btn__eliminar__producto" type="button" data-id="${product.eliminate}"> <!-- Asignamos el data-id correcto aquí -->
                            <img src="./assets/bote-de-basura.png" alt="Eliminar producto"/>
                        </button>
                    </div>
                </div>
            </div>
        `;
      productsContainer.innerHTML += productCard;
  });

  // Añadir eventos a los botones de borrar después de renderizar
  attachDeleteEventListeners();
}

// Función para manejar la eliminación de productos
function attachDeleteEventListeners() {
  document.querySelectorAll('.btn__eliminar__producto').forEach(button => {
      button.addEventListener('click', async () => {
          const productId = button.getAttribute('data-id'); // Ahora esto obtendrá el id del botón
          console.log('Intentando eliminar el producto con ID:', productId); 
          try {
              await eliminarProducto(productId);
              console.log('Producto eliminado correctamente'); 
              alert('Producto eliminado exitosamente.');
              await updateProductList();
          } catch (error) {
              console.error('Error al eliminar producto:', error);
              alert('Ocurrió un error al eliminar el producto.');
          }
      });
  });
}


// Dentro del manejo del envío del formulario
productForm.addEventListener('submit', async event => {
  event.preventDefault();

  const name = document.querySelector("[data-name]").value.trim();
  const price = document.querySelector("[data-price]").value.trim();
  const url = document.querySelector("[data-url]").value.trim();

  if (!name || !price || !url) {
      alert('Por favor, completa todos los campos.');
      return;
  }

  const newProduct = { name, price: parseFloat(price), url };

  try {
      console.log('Enviando producto:', newProduct);
      await enviarProducto(newProduct);
      alert('Producto agregado exitosamente.');
      productForm.reset();
      await updateProductList();
  } catch (error) {
      console.log('Error al agregar producto:', error);
      alert('Ocurrió un error al agregar el producto.');
  }
});

  
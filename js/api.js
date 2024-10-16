// API functions
async function listarProductos() {
    try {
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) throw new Error('Error en la red');
        return await response.json();
    } catch (error) {
        console.error('Error al listar productos:', error);
        return [];
    }
}

// Eliminar productos
async function enviarProducto(producto) {
    try {
        const response = await fetch("http://localhost:3000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            throw new Error('Error al enviar el producto');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en enviar producto:', error);
    }
}

// Eliminar productos
async function eliminarProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        
        // Función para eliminar un producto
        async function handleDelete(event) {
        try {
            // Obtener el ID del producto a eliminar
            const productId = parseInt(event.target.closest('.card').dataset.id);
        
            // Eliminar el producto de la API
            await eliminarProducto(productId);
        
            // Actualizar la lista de productos
            updateProductList();
          } catch (error) {
            console.error('Error al eliminar el producto:', error);
          }
        }
    }
}

// Función para actualizar la lista de productos
async function updateProductList() {
  try {
    // Obtener los productos actualizados de la API
    const updatedProducts = await listarProductos();

    // Renderizar la lista de productos actualizada
    renderProducts(updatedProducts);
  } catch (error) {
    console.error('Error al actualizar la lista de productos:', error);
  }
}

// Renderizar productos
function renderProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = ''; // Limpiar contenido anterior

    products.forEach(product => {
        const productCard = `
            <div class="card" data-id="${product.id}">
                <img class="image" src="${product.url}" alt="${product.name}"/>
                <div class="card-container--info">
                    <p class="name">${product.name}</p>
                    <div class="card-container--value">
                        <p class="price">${product.price}</p>
                        <button class="btn__eliminar__producto" type="button">
                          <img src="./assets/bote-de-basura.png" alt="Eliminar producto">
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });

    // Añadir eventos a los botones de borrar después de renderizar
    document.querySelectorAll('.btn__eliminar__producto').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

// Inicializar la lista de productos
async function init() {
  try {
    const products = await listarProductos();
    renderProducts(products);
  } catch (error) {
    console.error('Error al inicializar la lista de productos:', error);
  }
}

// Ejecutar la inicialización
init();
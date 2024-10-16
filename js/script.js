// Importar funciones desde la API
import { enviarProducto, añadirProductos, eliminarProducto } from './conexionAPI.js';

const productsContainer = document.getElementById('products-container');
const productForm = document.getElementById('product-form');
const clearFormButton = document.getElementById('clearFormBtn');

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        const productos = await listarProductos();
        renderProducts(productos);
    } catch (error) {
        console.error('Error al inicializar:', error);
    }
}

// Evento para agregar un producto
productForm.addEventListener('submit', async event => {
    event.preventDefault();

    const name = document.querySelector("[data-name]").value.trim();
    const price = document.querySelector("[data-price]").value.trim();
    const url = document.querySelector("[data-url]").value.trim();

    // Validación del precio: sólo números enteros o un decimal
    const pricePattern = /^\d+(\.\d{1,2})?$/; // Patrón: uno o más dígitos, opcionalmente seguidos de un punto y uno o dos dígitos

    if (!name || !price || !url) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Verificar si el precio es válido
    if (!pricePattern.test(price)) {
        alert('El precio debe ser un número entero o un número decimal (por ejemplo: 10 o 10.50).');
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
        console.error('Error al agregar producto:', error);
        alert('Ocurrió un error al agregar el producto.');
    }
});

clearFormButton.addEventListener('click', clearForm);

function clearForm() {
    productForm.reset();
}

function renderProducts(products) {
    const productsContainer = document.getElementById('products-container'); 
    productsContainer.innerHTML = ''; 
  
    products.forEach(product => {
        const productCard = `
            <div class="card" data-id="${product.id}">
                <img class="image" src="${product.url}" alt="${product.name}"/>
                <div class="card-container--info">
                    <p class="name">${product.name}</p>
                    <div class="card-container--value">
                        <p class="price">$ ${product.price.toFixed(2)}</p>
                        <button class="btn__eliminar__producto" type="button" data-id="${product.id}"> <!-- Correctamente asignando el data-id -->
                            <img src="./assets/bote-de-basura.png" alt="Eliminar producto"/>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });

    attachDeleteEventListeners(); // Añade eventos a los botones de borrar
}

async function updateProductList() {
    try {
        const updatedProducts = await listarProductos();
        renderProducts(updatedProducts);
    } catch (error) {
        console.error('Error al actualizar la lista de productos:', error);
        alert('Error al actualizar la lista de productos.');
    }
}

function attachDeleteEventListeners() {
    document.querySelectorAll('.btn__eliminar__producto').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');
            try {
                await eliminarProducto(productId);
                alert('Producto eliminado exitosamente.');
                await updateProductList();
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Ocurrió un error al eliminar el producto.');
            }
        });
    });
}

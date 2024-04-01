// Función para verificar el estado de inicio de sesión del usuario y si es administrador
function checkLoginStatus() {
    const token = localStorage.getItem('jwt_token'); // Obtener el token JWT del almacenamiento local
    const isAdmin = parseInt(localStorage.getItem('admin')); // Obtener el estado de administrador del almacenamiento local como número entero

    if (token) {
        // Si hay un token JWT almacenado, el usuario está autenticado
        setLoginButtonText(true, isAdmin === 1); // Comparar el estado de administrador con el número entero 1
    } else {
        // Si no hay un token JWT almacenado, el usuario no está autenticado
        setLoginButtonText(false, false);
    }
}// Función para cambiar el texto del botón de inicio de sesión y habilitar/deshabilitar el enlace al panel de administrador y mostrar u ocultar el botón de subir archivo
function setLoginButtonText(isLoggedIn, isAdmin) {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLink = document.getElementById('adminLink');
    const uploadButton = document.getElementById('uploadButton'); // Agregar el ID al botón de subir archivo en tu HTML

    if (isLoggedIn) {
        loginBtn.style.display = 'none'; // Oculta el botón de Inicio de Sesión
        logoutBtn.style.display = 'block'; // Muestra el botón de Cerrar Sesión
        adminLink.style.display = isAdmin ? 'block' : 'none'; // Muestra u oculta el enlace al panel de administrador según el estado del usuario
        uploadButton.style.display = isAdmin ? 'block' : 'none'; // Muestra u oculta el botón de subir archivo según si el usuario es administrador
        const editButtons = document.querySelectorAll('.edit-button'); // Selecciona todos los botones de edición
        editButtons.forEach(button => {
            button.style.display = isAdmin ? 'block' : 'none'; // Muestra u oculta el botón de edición según el estado de administrador
        });
    } else {
        loginBtn.style.display = 'block'; // Muestra el botón de Inicio de Sesión
        logoutBtn.style.display = 'none'; // Oculta el botón de Cerrar Sesión
        adminLink.style.display = 'none'; // Oculta el enlace al panel de administrador
        uploadButton.style.display = 'none'; // Oculta el botón de subir archivo cuando el usuario no está logueado
        const editButtons = document.querySelectorAll('.edit-button'); // Selecciona todos los botones de edición
        editButtons.forEach(button => {
            button.style.display = 'none'; // Oculta todos los botones de edición
        });
    }
}



// Función para mostrar u ocultar el botón "Editar Producto" según el estado de administrador
function showEditButton(isAdmin) {
    const editButtons = document.querySelectorAll('.edit-button'); // Selecciona todos los botones de edición

    editButtons.forEach(button => {
        button.style.display = isAdmin ? 'block' : 'none'; // Muestra u oculta el botón de edición según el estado de administrador
    });
}

// Llama a la función para verificar el estado de inicio de sesión del usuario cuando la página se carga
document.addEventListener('DOMContentLoaded', checkLoginStatus);


// Función para cerrar sesión
function logout() {
    // Eliminar el token JWT del almacenamiento local
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('admin'); // También eliminamos el estado de administrador
    // Actualizar la interfaz de usuario
    setLoginButtonText(false, false);
    showEditButton(false); // Oculta todos los botones de edición al cerrar sesión
    // Redirigir al usuario a la página de inicio
    location.reload();
}
// Función para obtener todos los datos de los productos desde el servidor
function getProductsFromServer() {
    // Realizar una solicitud GET al servidor para obtener todos los datos de los productos
    fetch('https://zcappe.pythonanywhere.com/producto/')
        .then(response => {
            // Verificar si la respuesta del servidor es exitosa
            if (!response.ok) {
                throw new Error('No se pudo obtener los productos del servidor');
            }
            // Convertir la respuesta del servidor a formato JSON
            return response.json();
        })
        .then(products => {
            // Llamar a la función para organizar y mostrar los productos en la interfaz de usuario
            displayProducts(products);
            // Verificar si el usuario es administrador y mostrar u ocultar el botón "Editar Producto" en consecuencia
            const isAdmin = parseInt(localStorage.getItem('admin')); // Obtener el estado de administrador del almacenamiento local como número entero
            showEditButton(isAdmin === 1); // Comparar el estado de administrador con el número entero 1
        })
        .catch(error => {
            // Manejar errores en caso de que la solicitud falle
            console.error('Error al obtener los productos:', error);
        });
}

function displayProducts(products) {
    // Organizar los productos según su categoría

    const categorias = {
        'Niño': [],
        'Hombre': [],
        'Mujer': [],
        'Mochila': [],
        'Mas': [] // Agregamos una categoría para productos sin categoría definida
    };
    console.log(products)
    
    // Clasificar los productos en las categorías correspondientes
    products.forEach(product => {
        if (product.genero && categorias.hasOwnProperty(product.genero)) {
            categorias[product.genero].push(product);
        } else {
            categorias['Mas'].push(product); // Agrega a una categoría "Otros" si no se encuentra la categoría correspondiente
        }
    });
    
    // Llamar a funciones para mostrar los productos de cada categoría en la interfaz de usuario
    displayProductsByCategory('ninos', categorias['Niño']);
    displayProductsByCategory('hombres', categorias['Hombre']);
    displayProductsByCategory('mujeres', categorias['Mujer']);
    displayProductsByCategory('mochilas', categorias['Mochila']);
    // Llama a más funciones para mostrar productos de otras categorías si es necesario
}

function displayProductsByCategory(categoryId, products) {
    const categorySection = document.getElementById(categoryId);

    if (categorySection) {
        const productsContainer = categorySection.querySelector('.products');
        productsContainer.innerHTML = '';

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            const firstImageUrl = product.url[0];

            const productAnchor = document.createElement('a');
            productAnchor.href = `./detalleProducto/detalleProducto.html?id=${product.idproducto}`;

            const productInfo = document.createElement('div');
            productInfo.classList.add('product-info');

            const productImage = document.createElement('img');
            productImage.src = firstImageUrl;
            productImage.alt = product.descripcion;
            productImage.classList.add('product-image');
            productImage.onerror = function() {
                this.onerror = null;
                this.src = 'predeterminado.png';
            };

            productAnchor.appendChild(productImage);

            productInfo.innerHTML = `
                <div class="product-details">
                    <h3>Descripción del producto</h3>
                    
                    <p>${product.descripcion}</p>
                    <h3>Precio</h3>
                    <p>$${product.precio}</p>
                </div>
            `;

            productElement.appendChild(productAnchor);
            productElement.appendChild(productInfo);

            productsContainer.appendChild(productElement);

            if (localStorage.getItem('jwt_token') && parseInt(localStorage.getItem('admin')) === 1) {
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar Producto';
                editButton.addEventListener('click', () => {
                    window.location.href = `./editarProducto/producto.html?id=${product.idproducto}`;
                });

                productElement.appendChild(editButton);
            }
            if (localStorage.getItem('jwt_token') && parseInt(localStorage.getItem('admin')) === 1) {
                const editButton = document.createElement('button');
                editButton.textContent = 'Eliminar Producto!';
                editButton.addEventListener('click', () => {
                    const idimagen = product.idimagen;
                    eliminarProducto(product.idproducto)
                });

                productElement.appendChild(editButton);
            }
        });
    }
}
function eliminarProducto(idproducto) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.');

    if (confirmDelete) {
        // Enviar una solicitud al servidor para eliminar el producto
        fetch(`https://zcappe.pythonanywhere.com/producto/${idproducto}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('El producto se eliminó correctamente.');
                // Redirigir al usuario a la página principal u otra página deseada después de eliminar el producto
                window.location.href = './index.html';
            } else {
                alert('Hubo un problema al intentar eliminar el producto.');
            }
        })
        .catch(error => {
            console.error('Error al intentar eliminar el producto:', error);
            alert('Error al intentar eliminar el producto. Consulta la consola para más detalles.');
        });
    }
}


// Llama a la función para obtener los datos de los productos desde el servidor
getProductsFromServer();
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Verificar si se ha proporcionado un ID de producto válido
    if (productId) {
        // Realizar una solicitud al servidor para obtener los detalles del producto
        fetch(`https://zcappe.pythonanywhere.com/producto/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los detalles del producto del servidor');
                }
                return response.json();
            })
            .then(product => {
                // Llamar a una función para mostrar los detalles del producto en la interfaz de usuario
                displayProductDetails(product);
                // Inicializar el carousel de imágenes
                initImageCarousel(product.imagenes);
            })
            .catch(error => {
                console.error('Error al obtener los detalles del producto:', error);
            });
    } else {
        console.error('No se proporcionó un ID de producto válido en la URL');
    }
});

function displayProductDetails(product) {
    // Obtener el contenedor donde se mostrarán los detalles del producto
    const productDetailsContainer = document.getElementById('productDetailsContainer');

    // Crear elementos HTML para mostrar los detalles del producto
    const productName = document.createElement('h2');
    productName.textContent = product.name;
    productName.classList.add('product-name'); // Agregar clase al nombre del producto

    const productDescription = document.createElement('p');
    productDescription.textContent = product.descripcion;
    productDescription.classList.add('product-description'); // Agregar clase a la descripción del producto

    const productPrice = document.createElement('p');
    productPrice.textContent = `Precio: $${product.precio}`;
    productPrice.classList.add('product-price'); // Agregar clase al precio del producto

    // Agregar los elementos al contenedor
    productDetailsContainer.appendChild(productName);
    productDetailsContainer.appendChild(productDescription);
    productDetailsContainer.appendChild(productPrice);

    // Agregar un log para verificar las imágenes
    console.log(product.imagenes);

    // Inicializar el carousel de imágenes
    initImageCarousel(product.imagenes);
}

function initImageCarousel(images) {
    const carouselInner = document.getElementById('carouselInner');

    // Verificar si carouselInner existe y no es null
    if (carouselInner) {
        // Limpiar el contenido previo del carousel
        carouselInner.innerHTML = '';

        // Filtrar las imágenes vacías
        const filteredImages = images.filter(imageUrl => imageUrl.trim() !== '');

        // Obtener la cantidad de imágenes a mostrar
        const numImages = Math.min(filteredImages.length, 5); // Limitar a un máximo de 5 imágenes

        // Agregar las imágenes al carousel
        for (let i = 0; i < numImages; i++) {
            const imageUrl = filteredImages[i]; // Obtener la URL de la imagen
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');

            // Activar el primer elemento del carousel
            if (i === 0) {
                carouselItem.classList.add('active');
            }

            const image = document.createElement('img');
            image.src = imageUrl;
            image.alt = 'Producto';
            image.classList.add('d-block', 'w-100'); // Utilizar la clase 'w-100' para ocupar todo el ancho del carrusel

            carouselItem.appendChild(image);
            carouselInner.appendChild(carouselItem);
        }
    } else {
        console.error('No se encontró el elemento con ID "carouselInner"');
    }
}

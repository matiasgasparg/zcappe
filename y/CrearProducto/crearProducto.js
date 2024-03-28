document.addEventListener('DOMContentLoaded', () => {
    const productRegistrationForm = document.getElementById ('productRegistrationForm');
    

    productRegistrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const genero = document.getElementById('genero').value;
        const url = document.getElementById('url').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;

        const productData = {
            genero: genero,
            url: url,
            descripcion: descripcion,
            precio: precio // Convierte el precio a un número de punto flotante
        };

        try {
            const response = await fetch('https://zcappe.pythonanywhere.com/upload/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Producto registrado exitosamente:', responseData);

                alert('Producto registrado exitosamente');

                
                // Agrega aquí la lógica para redirigir o mostrar un mensaje de éxito
            } else {
                console.error('Error al registrar el producto:', response.statusText);
                alert('Error al registrar el producto. Por favor, inténtalo de nuevo.');
                // Agrega aquí la lógica para mostrar un mensaje de error
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud. Por favor, inténtalo de nuevo.');
            // Agrega aquí la lógica para mostrar un mensaje de error en caso de que falle la solicitud
        }
    });

    // Abre el modal cuando se hace clic en el botón de edición de imagen
    editImageButton.addEventListener('click', () => {
        imageModal.style.display = 'block';
    });

    // Cierra el modal cuando se hace clic en la "X"
    closeModal.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });


    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('https://zcappe.pythonanywhere.com/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen');
            }

            // Extraer el nombre del archivo de la respuesta del servidor
            const data = await response.json();
            const fileName = data.fileName; // Asegúrate de que el servidor devuelva el nombre del archivo
            
            // Construir la URL correcta utilizando el nombre del archivo
            const storageUrl = `https://firebasestorage.googleapis.com/v0/b/zcappetienda.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;

            console.log(storageUrl); // Muestra la URL correcta en la consola
            return storageUrl; // Devuelve la URL de la imagen desde el almacenamiento de Firebase
        } catch (error) {
            console.error('Error al enviar la imagen:', error);
            return null; // Devuelve nulo en caso de error
        }
    };

    const updateImageButton = document.getElementById('updateImageButton');

    updateImageButton.addEventListener('click', async () => {
        const fileInput = document.getElementById('newImageInput');
        const file = fileInput.files[0];
        
        if (file) {
            try {
                const imageUrl = await uploadImage(file);
                if (imageUrl) {
                    // Rellenar el campo de URL de imagen en el formulario
                    document.getElementById('url').value = imageUrl;
                    // Actualizar el campo de la imagen en el servidor
                } else {
                    console.error('No se pudo obtener la URL de la imagen desde el servidor.');
                    alert('Error al subir la imagen.');
                }
            } catch (error) {
                console.error('Error al subir la imagen:', error);
                alert('Error al subir la imagen.');
            }
        } else {
            alert('Seleccione una imagen para subir.');
        }
    });
});

volver.addEventListener('click', () => {
    location.href = '../index.html';
});

document.getElementById('volver').addEventListener('click', function() {
    window.history.back(); // Redirigir al usuario a la página anterior
});

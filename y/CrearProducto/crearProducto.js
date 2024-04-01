document.addEventListener('DOMContentLoaded', () => {
    const productRegistrationForm = document.getElementById('productRegistrationForm');
    let currentUrlField; // Variable para almacenar el campo de URL actual

    productRegistrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const genero = document.getElementById('genero').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;

        // Obtener todas las URL de imagen
        const url = Array.from(document.querySelectorAll('[id^="url"]')).map(field => field.value);

        const productData = {
            genero: genero,
            url: url,
            descripcion: descripcion,
            precio: precio // Convierte el precio a un número de punto flotante
        };

        try {
            const response = await fetch('https://zcappe.pythonanywhere.com/producto/crear', {
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

    // Función para manejar el evento de clic en los botones de subir imagen
    const handleUploadButtonClick = (event) => {
        const urlFieldId = event.target.dataset.urlField;
        currentUrlField = document.getElementById(urlFieldId);
        if (currentUrlField) {
            imageModal.style.display = 'block';
        } else {
            console.error('Error: No se pudo encontrar el campo de URL correspondiente.');
        }
    };

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', handleUploadButtonClick);
    });

    closeModal.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });

    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('https://zcappe.pythonanywhere.com/imagen/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen');
            }

            const data = await response.json();
            const fileName = data.fileName;
            const storageUrl = `https://firebasestorage.googleapis.com/v0/b/zcappetienda.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;

            console.log(storageUrl);
            return storageUrl;
        } catch (error) {
            console.error('Error al enviar la imagen:', error);
            return null;
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
                    if (currentUrlField) {
                        currentUrlField.value = imageUrl;
                    } else {
                        console.error('Error: No se pudo encontrar el campo de URL correspondiente.');
                        alert('Error al subir la imagen.');
                    }
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

document.getElementById('volver').addEventListener('click', function() {
    window.history.back();
});

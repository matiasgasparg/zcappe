const idimagen = localStorage.getItem('idimagen');

const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://127.0.0.1:5000/upload', {
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
                // Actualizar el campo de la imagen en el servidor
                updateProductField('url', imageUrl);
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

function updateProductField(field, value) {
    const url = `http://127.0.0.1:5000/upload/${idimagen}`;
    const data = {
        field: field,
        value: value
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result.message.includes('actualizado exitosamente')) {
            alert('Producto actualizado exitosamente.');
            location.reload();
        } else {
            alert('Error al actualizar producto.');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud. Consulta la consola para más detalles.');
    });
}

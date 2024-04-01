const productId = localStorage.getItem('productId');


const uploadImages = async (files) => {
    const imageUrls = [];

    try {
        for (const file of files) {
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

            imageUrls.push(storageUrl);
        }

        return imageUrls;
    } catch (error) {
        console.error('Error al enviar las imágenes:', error);
        return null;
    }
};

const updateImageButton = document.getElementById('updateImageButton');
updateImageButton.addEventListener('click', async () => {
    const fileInput = document.getElementById('newImageInput');
    const files = fileInput.files;

    if (files.length > 0 && files.length <= 5) { // Limita la cantidad de imágenes a 5 o menos
        try {
            const imageUrls = await uploadImages(files);
            if (imageUrls) {
                // Actualizar el campo de las imágenes en el servidor
                updateProductField('url', imageUrls);
                alert('Imágenes actualizadas exitosamente.');
            } else {
                console.error('No se pudieron obtener las URL de las imágenes desde el servidor.');
                alert('Error al subir las imágenes.');
            }
        } catch (error) {
            console.error('Error al subir las imágenes:', error);
            alert('Error al subir las imágenes.');
        }
    } else {
        alert('Seleccione de 1 a 5 imágenes para subir.');
    }
});

function updateProductField(field, value) {
    const url = `https://zcappe.pythonanywhere.com/producto/${productId}`;
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
        if (result.message.includes('URLs actualizados exitosamente')) {
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

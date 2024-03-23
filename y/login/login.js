const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe normalmente

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
        // Hacer una solicitud al backend de Flask para iniciar sesión
        const response = await fetch('http://127.0.0.1:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Verificar si la respuesta del servidor es exitosa
        if (response.ok) {
            // Obtener los datos de usuario del cuerpo de la respuesta
            const userData = await response.json();

            // Obtener el token JWT y el estado de administrador del cuerpo de la respuesta
            const { token, admin } = userData;

            // Guardar el token JWT y el estado de administrador en el almacenamiento local del navegador
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('admin', admin);

            // Redirigir al usuario al index.html u otra página después del inicio de sesión exitoso
            window.location.href = '../index.html';
        } else {
            // Manejar errores de inicio de sesión
            mostrarMensajeError();

            const errorMessage = await response.text();

            console.error('Error al iniciar sesión:', errorMessage);
        }
    } catch (error) {
        // Manejar errores de red u otros errores
        console.error('Error al iniciar sesión:', error.message);
    }
});

function mostrarMensajeError() {
    // Crear un elemento de div para el cuadro de diálogo
    const dialogo = document.createElement('div');
    dialogo.textContent = 'Usuario o contraseña incorrectos';
    dialogo.style.backgroundColor = 'red';
    dialogo.style.color = 'white';
    dialogo.style.padding = '10px';
    dialogo.style.position = 'fixed';
    dialogo.style.top = '50%';
    dialogo.style.left = '50%';
    dialogo.style.transform = 'translate(-50%, -50%)';
    dialogo.style.zIndex = '1000'; // Asegura que el cuadro de diálogo esté por encima de otros elementos

    // Agregar el cuadro de diálogo al cuerpo del documento
    document.body.appendChild(dialogo);

    // Eliminar el cuadro de diálogo después de 3 segundos
    setTimeout(function() {
        document.body.removeChild(dialogo);
    }, 3000);
}

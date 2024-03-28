document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
  
    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío del formulario por defecto
  
        // Obtén los valores de los campos del formulario
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Construye el objeto de datos a enviar al servidor
        const userData = {
            name: name,
            username: username,
            email: email,
            password: password,
            // Agrega otros campos aquí si es necesario
        };
  
        try {
            const response = await fetch('https://zcappe.pythonanywhere.com/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
  
  
            if (response.status===201) {
                const responseData = await response.json();
                console.log('Usuario registrado exitosamente:', responseData);
                alert("Registro Exitosox",responseData);
  
                window.location.href = "../login/login.html"; // Redireccionar a la página de inicial
  
                // Agrega aquí la lógica para redirigir o mostrar un mensaje de éxito
            } else if(response.status===400) {
                    alert('Email o usuario ya en uso!')
                    console.error('Error al registrar usuario:', response.statusText);
  
                // Agrega aquí la lógica para mostrar un mensaje de error
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    });
  });
  
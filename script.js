document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const selectedProductsTextarea = document.getElementById('selectedProducts');
    const orderConfirmation = document.getElementById('orderConfirmation');
    const addToOrderButtons = document.querySelectorAll('.add-to-order');

    let selectedProducts = []; // Array para almacenar los productos seleccionados

    // Función para actualizar la lista de productos en el textarea
    const updateSelectedProducts = () => {
        selectedProductsTextarea.value = selectedProducts.join('\n');
    };

    // Añadir evento a los botones "Añadir al Pedido"
    addToOrderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.product;
            if (!selectedProducts.includes(productName)) {
                selectedProducts.push(productName);
                updateSelectedProducts();
                alert(`${productName} ha sido añadido a tu pedido.`);
            } else {
                alert(`${productName} ya está en tu pedido.`);
            }
        });
    });

    // Manejar el envío del formulario de pedido
    if (orderForm) {
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evitar el envío por defecto del formulario

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            // Simple validación (puedes añadir más si es necesario)
            if (name === "" || email === "" || phone === "" || selectedProducts.length === 0) {
                alert("Por favor, rellena todos los campos requeridos y selecciona al menos un producto.");
                return;
            }

            // Aquí es donde normalmente enviarías los datos a un servidor.
            // Para GitHub Pages, no puedes procesar formularios directamente en el servidor.
            // Opciones:
            // 1. Usar un servicio de terceros como Formspree, Netlify Forms, o Getform.io
            // 2. Generar un enlace de mailto: (menos robusto para pedidos complejos)

            // Ejemplo usando Formspree (tendrías que configurar tu cuenta):
            // const formData = new FormData(orderForm);
            // fetch('https://formspree.io/f/your_form_id', { // ¡REEMPLAZA 'your_form_id' CON EL TUYO!
            //     method: 'POST',
            //     body: formData,
            //     headers: {
            //         'Accept': 'application/json'
            //     }
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data.ok) {
            //         orderForm.reset(); // Limpiar el formulario
            //         selectedProducts = []; // Limpiar productos seleccionados
            //         updateSelectedProducts();
            //         orderForm.classList.add('hidden');
            //         orderConfirmation.classList.remove('hidden');
            //     } else {
            //         alert('Hubo un error al enviar tu pedido. Por favor, inténtalo de nuevo.');
            //     }
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     alert('Hubo un error de red. Por favor, inténtalo de nuevo más tarde.');
            // });

            // **OPCIÓN SIMPLIFICADA PARA DEMOSTRACIÓN (sin envío real a servidor)**
            // Simplemente muestra la confirmación y limpia el formulario
            orderForm.reset();
            selectedProducts = [];
            updateSelectedProducts();
            orderForm.classList.add('hidden');
            orderConfirmation.classList.remove('hidden');
            console.log("Pedido simulado enviado:", { name, email, phone, products: selectedProductsTextarea.value, message });

            // Puedes reiniciar la visibilidad del formulario después de unos segundos
            setTimeout(() => {
                orderConfirmation.classList.add('hidden');
                orderForm.classList.remove('hidden');
            }, 5000); // Ocultar confirmación después de 5 segundos
        });
    }
});
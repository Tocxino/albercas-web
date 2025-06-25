document.addEventListener('DOMContentLoaded', () => {
    // Lista de bollos disponibles
    const bollos = [
        "Bollo de Canela Clásico",
        "Bollo de Chocolate Intenso",
        "Bollo de Frutos Rojos",
        "Bollo de Queso y Jalapeño", // Ejemplo de más bollos
        "Bollo de Manzana y Especias"
    ];

    // Lógica para los botones "Lo Quiero" en index.html
    const loQuieroButtons = document.querySelectorAll('.lo-quiero-btn');
    if (loQuieroButtons.length > 0) {
        loQuieroButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const bolloSeleccionado = event.target.dataset.bollo;
                // Guardar el bollo en localStorage para recuperarlo en la página de pedidos
                localStorage.setItem('bolloPedido', bolloSeleccionado);
                window.location.href = 'pedidos.html';
            });
        });
    }

    // Lógica para la página de pedidos (pedidos.html)
    const tipoPedidoSelect = document.getElementById('tipoPedido');
    const productosIndividualDiv = document.getElementById('productos-individual');
    const productosGrupalDiv = document.getElementById('productos-grupal');
    const bolloIndividualSelect = document.getElementById('bolloIndividual');
    const addBolloGrupalButton = document.getElementById('addBolloGrupal');
    const bollosAgregadosDiv = document.getElementById('bollos-agregados');
    const orderForm = document.getElementById('orderForm');

    if (tipoPedidoSelect) { // Asegúrate de que estamos en la página de pedidos
        // Función para llenar los selects de bollos
        const fillBolloSelect = (selectElement, excludeFirstOption = false) => {
            selectElement.innerHTML = ''; // Limpiar opciones existentes
            if (!excludeFirstOption) {
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Selecciona un Bollo';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                selectElement.appendChild(defaultOption);
            }
            bollos.forEach(bollo => {
                const option = document.createElement('option');
                option.value = bollo;
                option.textContent = bollo;
                selectElement.appendChild(option);
            });
        };

        // Llenar el select individual al cargar la página
        fillBolloSelect(bolloIndividualSelect);

        // Recuperar el bollo pre-seleccionado si viene de la página de productos
        const bolloPreseleccionado = localStorage.getItem('bolloPedido');
        if (bolloPreseleccionado) {
            bolloIndividualSelect.value = bolloPreseleccionado;
            localStorage.removeItem('bolloPedido'); // Limpiar después de usar
        }

        // Función para mostrar/ocultar secciones según el tipo de pedido
        const togglePedidoType = () => {
            if (tipoPedidoSelect.value === 'individual') {
                productosIndividualDiv.classList.remove('hidden');
                productosGrupalDiv.classList.add('hidden');
                bollosAgregadosDiv.innerHTML = ''; // Limpiar los agregados grupales
                // Asegurarse de que el select individual tenga la opción predeterminada
                fillBolloSelect(bolloIndividualSelect);
                if (bolloPreseleccionado) { // Si hay un bollo preseleccionado
                    bolloIndividualSelect.value = bolloPreseleccionado;
                }
            } else {
                productosIndividualDiv.classList.add('hidden');
                productosGrupalDiv.classList.remove('hidden');
                // Añadir un bollo inicial al seleccionar "Grupal"
                if (bollosAgregadosDiv.children.length === 0) {
                    addBolloRow();
                }
            }
        };

        // Manejar el cambio en el tipo de pedido
        tipoPedidoSelect.addEventListener('change', togglePedidoType);

        // Función para añadir una fila de bollo y cantidad para pedidos grupales
        const addBolloRow = (preselectedBollo = '') => {
            const div = document.createElement('div');
            div.classList.add('bollo-group-item'); // Clase para estilos específicos

            const bolloSelect = document.createElement('select');
            bolloSelect.name = 'bolloGrupal';
            fillBolloSelect(bolloSelect, true); // No añadir opción por defecto si ya hay otros bollos
            if (preselectedBollo) {
                bolloSelect.value = preselectedBollo;
            }

            const cantidadSelect = document.createElement('select');
            cantidadSelect.name = 'cantidadGrupal';
            for (let i = 1; i <= 5; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                cantidadSelect.appendChild(option);
            }

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.classList.add('remove-bollo');
            removeButton.textContent = 'x';
            removeButton.addEventListener('click', () => {
                div.remove();
            });

            div.appendChild(bolloSelect);
            div.appendChild(cantidadSelect);
            div.appendChild(removeButton);
            bollosAgregadosDiv.appendChild(div);
        };

        // Añadir bollo al hacer clic en el botón "Añadir Otro Bollo"
        addBolloGrupalButton.addEventListener('click', () => addBolloRow());

        // Inicializar la vista correcta al cargar la página
        togglePedidoType();
        // Si hay un bollo preseleccionado y el tipo de pedido es individual, asegurarlo
        if (bolloPreseleccionado && tipoPedidoSelect.value === 'individual') {
            bolloIndividualSelect.value = bolloPreseleccionado;
        } else if (bolloPreseleccionado && tipoPedidoSelect.value === 'grupal') {
            // Si el bollo preseleccionado vino de productos, agregarlo a la lista grupal
            // y luego asegurarse de que el tipo de pedido sea "grupal"
            tipoPedidoSelect.value = 'grupal';
            togglePedidoType(); // Para mostrar la sección grupal
            addBolloRow(bolloPreseleccionado); // Añadir el bollo a la lista grupal
        }


        // Manejar el envío del formulario
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evitar el envío predeterminado del formulario

            const nombre = document.getElementById('nombre').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const tipoPedido = document.getElementById('tipoPedido').value;
            const especificaciones = document.getElementById('especificaciones').value;

            let mensajePedido = `¡Hola! Mi nombre es ${nombre} y me gustaría hacer el siguiente pedido:\n\n`;

            if (tipoPedido === 'individual') {
                const bolloSeleccionado = document.getElementById('bolloIndividual').value;
                if (!bolloSeleccionado) {
                    alert('Por favor, selecciona un bollo para tu pedido individual.');
                    return;
                }
                mensajePedido += `- ${bolloSeleccionado} (Individual)\n`;
            } else { // Grupal
                const bollosPedidos = [];
                const bolloGrupalItems = bollosAgregadosDiv.querySelectorAll('.bollo-group-item');
                if (bolloGrupalItems.length === 0) {
                    alert('Por favor, añade al menos un bollo para tu pedido grupal.');
                    return;
                }
                bolloGrupalItems.forEach(item => {
                    const bollo = item.querySelector('select[name="bolloGrupal"]').value;
                    const cantidad = item.querySelector('select[name="cantidadGrupal"]').value;
                    if (bollo) { // Solo añadir si se ha seleccionado un bollo
                        bollosPedidos.push(`${bollo} (x${cantidad})`);
                    }
                });

                if (bollosPedidos.length === 0) {
                     alert('Por favor, selecciona un bollo y una cantidad para cada artículo en tu pedido grupal.');
                     return;
                }
                mensajePedido += `Pedido Grupal:\n`;
                mensajePedido += bollosPedidos.map(item => `- ${item}`).join('\n');
                mensajePedido += '\n';
            }

            if (especificaciones) {
                mensajePedido += `\nEspecificaciones: ${especificaciones}\n`;
            }

            mensajePedido += `\nMi número de WhatsApp es: ${whatsapp}`;

            // Codificar el mensaje para la URL de WhatsApp
            const encodedMessage = encodeURIComponent(mensajePedido);
            // Reemplaza 'XXXXXXXXXX' con tu número de WhatsApp real (sin el +)
            const whatsappUrl = `https://wa.me/521234567890?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank'); // Abrir en una nueva pestaña
            alert('Tu pedido ha sido preparado para ser enviado por WhatsApp. ¡Revisa la nueva pestaña!');
            orderForm.reset(); // Reiniciar el formulario después del envío
            bollosAgregadosDiv.innerHTML = ''; // Limpiar bollos agregados
            togglePedidoType(); // Resetear a individual
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Lista de bollos disponibles
    const bollos = [
        "Bollo de Canela Clásico",
        "Bollo de Chocolate Intenso",
        "Bollo de Frutos Rojos",
        "Bollo de Queso y Jalapeño",
        "Bollo de Manzana y Especias"
    ];

    // Lógica para los botones "Lo Quiero" en index.html
    const loQuieroButtons = document.querySelectorAll('.lo-quiero-btn');
    if (loQuieroButtons.length > 0) {
        loQuieroButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const bolloSeleccionado = event.target.dataset.bollo;
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
        let bolloGroupCounter = 0; // Para dar nombres únicos a los campos grupales

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
                bolloGroupCounter = 0; // Resetear contador al cambiar a individual
                fillBolloSelect(bolloIndividualSelect);
                if (bolloPreseleccionado) {
                    bolloIndividualSelect.value = bolloPreseleccionado;
                }
            } else {
                productosIndividualDiv.classList.add('hidden');
                productosGrupalDiv.classList.remove('hidden');
                if (bollosAgregadosDiv.children.length === 0) {
                    addBolloRow(); // Añadir un bollo inicial si no hay ninguno
                }
            }
        };

        // Manejar el cambio en el tipo de pedido
        tipoPedidoSelect.addEventListener('change', togglePedidoType);

        // Función para añadir una fila de bollo y cantidad para pedidos grupales
        const addBolloRow = (preselectedBollo = '') => {
            bolloGroupCounter++; // Incrementar contador para nombres únicos
            const div = document.createElement('div');
            div.classList.add('bollo-group-item');

            const bolloSelect = document.createElement('select');
            // Nombre único para Formspree: bollo_grupal_1, bollo_grupal_2, etc.
            bolloSelect.name = `bollo_grupal_${bolloGroupCounter}`;
            fillBolloSelect(bolloSelect, true);
            if (preselectedBollo) {
                bolloSelect.value = preselectedBollo;
            }

            const cantidadSelect = document.createElement('select');
            // Nombre único para Formspree: cantidad_grupal_1, cantidad_grupal_2, etc.
            cantidadSelect.name = `cantidad_grupal_${bolloGroupCounter}`;
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
            tipoPedidoSelect.value = 'grupal';
            togglePedidoType();
            addBolloRow(bolloPreseleccionado);
        }

        // Ya no manejamos el envío del formulario de pedidos con JS. Formspree lo hará.
        // Puedes añadir un evento 'submit' si necesitas algo de lógica antes del envío,
        // pero la acción principal la manejará Formspree.
    }
});

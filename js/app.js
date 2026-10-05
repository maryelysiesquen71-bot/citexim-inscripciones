// ==============================================
// INICIALIZACIÓN Y FLUJO PRINCIPAL DE LA APP
// ==============================================

function initApp() {
    console.log("Inicializando aplicación...");

    const ticketSelect = document.getElementById('ticket-type');
    const qtyInput = document.getElementById('ticket-quantity');

    if (!ticketSelect || !qtyInput) {
        console.error("No se encontraron los elementos del formulario.");
        return;
    }

    // 1. Cargar Configuración Inicial desde CONFIG
    if (typeof CONFIG !== 'undefined') {
        const logoImg = document.getElementById('event-logo');
        if (logoImg && CONFIG.evento && CONFIG.evento.logo) {
            logoImg.src = CONFIG.evento.logo;
        }

        if (CONFIG.pago) {
            document.getElementById('bcp-account').textContent = CONFIG.pago.cuenta || '';
            document.getElementById('cci-account').textContent = CONFIG.pago.cci || '';
            document.getElementById('account-holder').textContent = CONFIG.pago.titular || '';
        }

        // Asignar dinámicamente el copiado a los botones
        const btnBcp = document.getElementById('btn-copy-bcp');
        const btnCci = document.getElementById('btn-copy-cci');
        if (btnBcp) btnBcp.onclick = () => copyToClipboard(CONFIG.pago.cuenta);
        if (btnCci) btnCci.onclick = () => copyToClipboard(CONFIG.pago.cci);

        // Poblar opciones del Select de Entradas
        if (Array.isArray(CONFIG.entradas)) {
            ticketSelect.innerHTML = '';
            CONFIG.entradas.forEach(ticket => {
                const option = document.createElement('option');
                option.value = ticket.id;
                option.textContent = ticket.nombre;
                ticketSelect.appendChild(option);
            });
        }
    }

    // 2. Función para recalcular Precios y actualizar Asistentes
    function updateFormState() {
        const selectedTicketId = ticketSelect.value;
        const qty = parseInt(qtyInput.value, 10) || 1;

        if (typeof calculatePricing === 'function') {
            const priceInfo = calculatePricing(selectedTicketId, qty);
            document.getElementById('summary-unit-price').textContent = `S/ ${priceInfo.unitPrice.toFixed(2)}`;
            document.getElementById('summary-qty').textContent = qty;
            document.getElementById('summary-total').textContent = `S/ ${priceInfo.total.toFixed(2)}`;
        }

        const countLabel = document.getElementById('attendees-count-label');
        if (countLabel) countLabel.textContent = qty;

        if (typeof renderAttendeeFields === 'function') {
            renderAttendeeFields(qty);
        }
    }

    // Escuchar eventos en los controles
    ticketSelect.addEventListener('change', updateFormState);
    qtyInput.addEventListener('input', updateFormState);

    // Ejecución inicial automática
    updateFormState();

    // 3. Control del envío del formulario
    const form = document.getElementById('registration-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (typeof validateRegistrationForm === 'function' && !validateRegistrationForm()) {
                return;
            }

            const qty = parseInt(qtyInput.value, 10) || 1;
            const selectedTicket = CONFIG.entradas.find(t => t.id === ticketSelect.value);
            const pricing = calculatePricing(ticketSelect.value, qty);
            const fileInput = document.getElementById('payment-receipt');
            const currentFile = fileInput ? fileInput.files[0] : null;

            const attendeesList = [];
            for (let i = 1; i <= qty; i++) {
                const nameInp = document.querySelector(`input[name="attendee_name_${i}"]`);
                const phoneInp = document.querySelector(`input[name="attendee_phone_${i}"]`);
                const emailInp = document.querySelector(`input[name="attendee_email_${i}"]`);

                attendeesList.push({
                    nombre: nameInp ? nameInp.value.trim() : '',
                    telefono: phoneInp ? phoneInp.value.trim() : '',
                    correo: emailInp ? emailInp.value.trim() : ''
                });
            }

            const currentPayload = {
                idInscripcion: 'REG-' + Date.now(),
                fecha: new Date().toLocaleString(),
                buyerName: document.getElementById('buyer-name').value.trim(),
                buyerEmail: document.getElementById('buyer-email').value.trim(),
                ticketId: ticketSelect.value,
                ticketName: selectedTicket ? selectedTicket.nombre : ticketSelect.value,
                quantity: qty,
                unitPrice: pricing.unitPrice,
                totalPrice: pricing.total,
                fileName: currentFile ? currentFile.name : 'Sin archivo',
                attendees: attendeesList
            };

            if (typeof openSummaryModal === 'function') {
                openSummaryModal(currentPayload);
            }
        });
    }

    // 4. Modal
    const btnEdit = document.getElementById('btn-edit-modal');
    if (btnEdit) btnEdit.addEventListener('click', closeModal);
}

// Escuchador seguro para asegurar que el DOM esté listo antes de ejecutar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
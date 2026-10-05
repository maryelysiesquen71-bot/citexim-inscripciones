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

    // 1. Cargar Configuración Inicial en la UI
    if (typeof CONFIG !== 'undefined') {
        document.getElementById('event-logo').src = CONFIG.evento.logo;
        document.getElementById('bcp-account').textContent = CONFIG.pago.cuenta;
        document.getElementById('cci-account').textContent = CONFIG.pago.cci;
        document.getElementById('account-holder').textContent = CONFIG.pago.titular;

        // Poblar / Asegurar opciones desde CONFIG
        ticketSelect.innerHTML = '';
        CONFIG.entradas.forEach(ticket => {
            const option = document.createElement('option');
            option.value = ticket.id;
            option.textContent = ticket.nombre;
            ticketSelect.appendChild(option);
        });
    }

    // 2. Función de Actualización de Precios y Asistentes
    function updateFormState() {
        const selectedTicketId = ticketSelect.value;
        const qty = parseInt(qtyInput.value, 10) || 1;

        if (typeof calculatePricing === 'function') {
            const priceInfo = calculatePricing(selectedTicketId, qty);
            document.getElementById('summary-unit-price').textContent = `S/ ${priceInfo.unitPrice.toFixed(2)}`;
            document.getElementById('summary-qty').textContent = qty;
            document.getElementById('summary-total').textContent = `S/ ${priceInfo.total.toFixed(2)}`;
        }

        document.getElementById('attendees-count-label').textContent = qty;
        if (typeof renderAttendeeFields === 'function') {
            renderAttendeeFields(qty);
        }
    }

    ticketSelect.addEventListener('change', updateFormState);
    qtyInput.addEventListener('input', updateFormState);

    // Ejecutar render inicial
    updateFormState();

    // 3. Envío de Formulario
    let currentPayload = null;
    let currentFile = null;

    const form = document.getElementById('registration-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (typeof validateRegistrationForm === 'function' && !validateRegistrationForm()) {
            return;
        }

        const qty = parseInt(qtyInput.value, 10);
        const selectedTicket = CONFIG.entradas.find(t => t.id === ticketSelect.value);
        const pricing = calculatePricing(ticketSelect.value, qty);
        const fileInput = document.getElementById('payment-receipt');
        currentFile = fileInput.files[0];

        const attendeesList = [];
        for (let i = 1; i <= qty; i++) {
            attendeesList.push({
                nombre: document.querySelector(`input[name="attendee_name_${i}"]`).value.trim(),
                telefono: document.querySelector(`input[name="attendee_phone_${i}"]`).value.trim(),
                correo: document.querySelector(`input[name="attendee_email_${i}"]`).value.trim()
            });
        }

        currentPayload = {
            idInscripcion: 'REG-' + Date.now(),
            fecha: new Date().toLocaleString(),
            buyerName: document.getElementById('buyer-name').value.trim(),
            buyerEmail: document.getElementById('buyer-email').value.trim(),
            ticketId: ticketSelect.value,
            ticketName: selectedTicket.nombre,
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

    // 4. Eventos del Modal
    const btnEdit = document.getElementById('btn-edit-modal');
    const btnConfirm = document.getElementById('btn-confirm-modal');

    if (btnEdit) btnEdit.addEventListener('click', closeModal);

    if (btnConfirm) {
        btnConfirm.addEventListener('click', async () => {
            btnConfirm.disabled = true;
            btnConfirm.textContent = 'Procesando inscripción...';

            try {
                if (typeof sendRegistrationData === 'function') {
                    await sendRegistrationData(currentPayload, currentFile);
                }
                alert('¡Inscripción registrada con éxito!');
                window.location.reload();
            } catch (err) {
                alert('Ocurrió un inconveniente al enviar tu inscripción.');
                btnConfirm.disabled = false;
                btnConfirm.textContent = 'CONFIRMAR INSCRIPCIÓN';
            }
        });
    }
}

// Ejecución al cargar DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
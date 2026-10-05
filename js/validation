// ==============================================
// VALIDACIONES DE FORMULARIO Y COMPROBANTE
// ==============================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    // Acepta dígitos de celular (9 dígitos en Perú o formato internacional)
    const re = /^[0-9+\s-]{7,15}$/;
    return re.test(phone.trim());
}

function validateFile(fileInput) {
    const errorElement = document.getElementById('file-error');
    errorElement.style.display = 'none';
    errorElement.textContent = '';

    if (!fileInput.files || fileInput.files.length === 0) {
        errorElement.textContent = 'Por favor, adjunta tu comprobante de pago.';
        errorElement.style.display = 'block';
        return false;
    }

    const file = fileInput.files[0];
    const allowedTypes = CONFIG.comprobante.tiposPermitidos;
    const maxSizeBytes = CONFIG.comprobante.tamanoMaximoMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        errorElement.textContent = 'Formato no permitido. Por favor sube una imagen (JPG, PNG) o PDF.';
        errorElement.style.display = 'block';
        return false;
    }

    if (file.size > maxSizeBytes) {
        errorElement.textContent = `El archivo supera el tamaño máximo de ${CONFIG.comprobante.tamanoMaximoMB}MB.`;
        errorElement.style.display = 'block';
        return false;
    }

    return true;
}

function validateRegistrationForm() {
    const buyerName = document.getElementById('buyer-name').value.trim();
    const buyerEmail = document.getElementById('buyer-email').value.trim();
    const ticketQuantity = parseInt(document.getElementById('ticket-quantity').value, 10);
    const fileInput = document.getElementById('payment-receipt');

    if (!buyerName) {
        alert('Por favor, ingresa el nombre de contacto del responsable.');
        return false;
    }

    if (!validateEmail(buyerEmail)) {
        alert('Por favor, ingresa un correo electrónico de contacto válido.');
        return false;
    }

    if (isNaN(ticketQuantity) || ticketQuantity < 1) {
        alert('Selecciona una cantidad de entradas válida.');
        return false;
    }

    // Validar datos de cada asistente generado
    for (let i = 1; i <= ticketQuantity; i++) {
        const nameInput = document.querySelector(`input[name="attendee_name_${i}"]`);
        const phoneInput = document.querySelector(`input[name="attendee_phone_${i}"]`);
        const emailInput = document.querySelector(`input[name="attendee_email_${i}"]`);

        if (!nameInput || !nameInput.value.trim()) {
            alert(`Por favor, completa el nombre del Asistente ${i}.`);
            return false;
        }

        if (!phoneInput || !validatePhone(phoneInput.value)) {
            alert(`Por favor, ingresa un teléfono válido para el Asistente ${i}.`);
            return false;
        }

        if (!emailInput || !validateEmail(emailInput.value)) {
            alert(`Por favor, ingresa un correo válido para el Asistente ${i}.`);
            return false;
        }
    }

    // Validar archivo de comprobante
    if (!validateFile(fileInput)) {
        return false;
    }

    return true;
}
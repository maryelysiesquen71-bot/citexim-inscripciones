function renderAttendeeFields(quantity) {
    const container = document.getElementById('attendees-container');
    container.innerHTML = ''; // Limpiar campos existentes

    for (let i = 1; i <= quantity; i++) {
        const card = document.createElement('div');
        card.className = 'attendee-card';
        card.style.cssText = "background: #fff; border: 1px solid #e0e6ed; padding: 15px; border-radius: 8px; margin-bottom: 15px;";
        
        card.innerHTML = `
            <h4 style="margin-top:0; color:#134074;">ASISTENTE ${String(i).padStart(2, '0')}</h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Nombre completo</label>
                    <input type="text" name="attendee_name_${i}" placeholder="Como aparecerá en su entrada" required>
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="tel" name="attendee_phone_${i}" placeholder="Número de contacto" required>
                </div>
            </div>
            <div class="form-group">
                <label>Correo electrónico</label>
                <input type="email" name="attendee_email_${i}" placeholder="asistente@correo.com" required>
            </div>
        `;
        container.appendChild(card);
    }
}
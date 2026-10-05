
// ==============================================
// CONEXIÓN Y ENVÍO DE DATOS HACIA EL BACKEND / WEBHOOK
// ==============================================

async function sendRegistrationData(payloadData, fileObject) {
    const formData = new FormData();
    
    // Adjuntar datos en formato JSON en un campo del FormData
    formData.append('data', JSON.stringify(payloadData));
    
    // Adjuntar el archivo del comprobante
    formData.append('comprobante', fileObject);

    try {
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al enviar la inscripción:', error);
        throw error;
    }
}
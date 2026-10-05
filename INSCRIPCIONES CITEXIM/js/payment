// ==============================================
// FUNCIONALIDAD DE COPIADO RÁPIDO DE CUENTAS
// ==============================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('¡Número copiado al portapapeles!');
    }).catch(err => {
        // Fallback en caso de navegadores antiguos
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('¡Número copiado al portapapeles!');
    });
}
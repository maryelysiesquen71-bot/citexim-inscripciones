// ==============================================
// CÁLCULO DINÁMICO DE PRECIOS Y PROMOCIONES
// ==============================================

function calculatePricing(ticketId, quantity) {
    if (!CONFIG || !CONFIG.entradas) {
        console.error("CONFIG no está disponible");
        return { unitPrice: 0, total: 0 };
    }

    const id = String(ticketId).trim().toLowerCase();
    const qty = parseInt(quantity, 10) || 1;

    // Buscar la entrada por ID (ej. "basico", "vip", "premium")
    const ticket = CONFIG.entradas.find(t => String(t.id).toLowerCase() === id);

    if (!ticket) {
        console.warn("No se encontró el tipo de entrada:", ticketId);
        return { unitPrice: 0, total: 0 };
    }

    let unitPrice = 0;

    if (id === 'basico') {
        unitPrice = ticket.precios.default || 30.00;
    } else {
        // Para VIP y PREMIUM revisamos la escala de cantidad
        const p = ticket.precios;
        if (qty >= 20) {
            unitPrice = p[20] || p["20"];
        } else if (qty >= 5) {
            unitPrice = p[5] || p["5"];
        } else {
            unitPrice = p[1] || p["1"];
        }
    }

    unitPrice = parseFloat(unitPrice) || 0;
    const total = unitPrice * qty;

    return {
        unitPrice: unitPrice,
        total: total
    };
}
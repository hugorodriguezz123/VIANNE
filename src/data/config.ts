// Configuración del sitio — edita estos valores con los datos reales de la tienda.

// Número de WhatsApp para pedidos: se define en el archivo .env (VITE_WHATSAPP_NUMBER).
// Formato: código de país + número, sin '+'. Ejemplo Colombia: 573001234567
// Se limpian espacios, '+' y guiones por si se escribe con formato.
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

if (!WHATSAPP_NUMBER) {
  console.warn('VIANNE: falta VITE_WHATSAPP_NUMBER en el archivo .env — los botones de WhatsApp no tendrán número.')
}

// Cantidad a partir de la cual un producto se marca como "Últimas unidades"
export const LOW_STOCK_THRESHOLD = 3

export const SITE_NAME = 'VIANNE'

// Zona donde se acepta pago contraentrega (se muestra en varias partes de la página)
export const CASH_ON_DELIVERY_AREA = 'área metropolitana de Bucaramanga'

import type { OrderPayloadType } from '@/types'

const STORE_PHONE = '5554992181886'

export function buildWhatsAppUrl(order: OrderPayloadType): string {
  const lines: string[] = []

  lines.push('🛍 *Novo Pedido — Mocellin Joias*\n')

  lines.push('*Itens:*')
  for (const item of order.items) {
    const subtotal = (item.product.price * item.quantity).toFixed(2)
    lines.push(`• ${item.product.name} x${item.quantity} — R$ ${subtotal}`)
  }

  lines.push(`\n*Subtotal:* R$ ${order.subtotal.toFixed(2)}`)

  if (order.shipping !== null) {
    lines.push(`*Frete:* ${order.shippingName} — R$ ${order.shipping.toFixed(2)}`)
  } else {
    lines.push('*Entrega:* Retirada no local')
  }

  lines.push(`*Total:* R$ ${order.total.toFixed(2)}`)

  lines.push(`\n*Pagamento:* ${formatPayment(order.form.payment)}`)
  lines.push(`\n*Cliente:* ${order.form.name}`)
  lines.push(`*Telefone:* ${order.form.phone}`)

  if (order.form.delivery === 'envio') {
    const { street, number, complement, neighborhood, city, state, cep } = order.form
    const line1 = complement ? `${street}, ${number} — ${complement}` : `${street}, ${number}`
    lines.push(`\n*Endereço de entrega:*`)
    lines.push(line1)
    lines.push(`${neighborhood} — ${city}/${state}`)
    lines.push(`CEP: ${cep}`)
  }

  const message = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${STORE_PHONE}?text=${message}`
}

function formatPayment(method: OrderPayloadType['form']['payment']): string {
  const map = { pix: 'Pix', cartao: 'Cartão de crédito', dinheiro: 'Dinheiro' }
  return map[method]
}

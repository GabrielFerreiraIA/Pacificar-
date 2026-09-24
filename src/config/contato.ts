/* Contato da Ana Carla. O número vem de VITE_ANA_WHATSAPP (público, não é segredo),
   só dígitos com DDI e DDD, ex.: 5547999998888. Sem número, o WhatsApp abre para
   a pessoa escolher o contato, com a mensagem já escrita. */
const numero = (import.meta.env.VITE_ANA_WHATSAPP ?? '').replace(/\D/g, '');

export function linkWhatsAppAna(mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

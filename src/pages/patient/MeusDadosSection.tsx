import React, { useEffect, useId, useState } from 'react';
import { Download, ShieldCheck, Trash2, Check } from 'lucide-react';
import { Button, Card, Field, SectionTitle, inputClass } from '../../components/ui/Primitives';
import { baixarMeusDados, pedidoAberto, pedirExclusao, type PedidoExclusao } from '../../lib/api/lgpd';

/* Direitos LGPD no perfil (T-63): baixar a cópia dos dados e pedir a exclusão da conta.
   O pedido não apaga nada na hora: a Ana avalia e conclui (guarda legal de registros). */

const MSG_ERRO = 'Não foi possível concluir agora. Confira a internet e tente de novo.';

export const MeusDadosSection: React.FC<{ userId: string }> = ({ userId }) => {
  const [baixando, setBaixando] = useState(false);
  const [pedido, setPedido] = useState<PedidoExclusao | null>(null);
  const [formAberto, setFormAberto] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [baixado, setBaixado] = useState(false);
  const idMotivo = useId();

  useEffect(() => {
    let vivo = true;
    pedidoAberto(userId)
      .then(p => vivo && setPedido(p))
      .catch(() => {
        /* offline: só não mostra o status */
      });
    return () => {
      vivo = false;
    };
  }, [userId]);

  const baixar = async () => {
    setErro(null);
    setBaixando(true);
    try {
      await baixarMeusDados(userId);
      setBaixado(true);
      window.setTimeout(() => setBaixado(false), 5000);
    } catch {
      setErro(MSG_ERRO);
    } finally {
      setBaixando(false);
    }
  };

  const enviarPedido = async () => {
    if (!window.confirm('Enviar o pedido de exclusão da sua conta para a Ana Carla?')) return;
    setErro(null);
    setEnviando(true);
    try {
      setPedido(await pedirExclusao(userId, motivo));
      setFormAberto(false);
      setMotivo('');
    } catch {
      setErro(MSG_ERRO);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="space-y-3 border-t border-line pt-6">
      <SectionTitle
        eyebrow="Privacidade"
        title="Seus dados"
        hint="Você é dona das suas informações. Pode levar uma cópia ou pedir que sejam apagadas."
      />

      <Card className="space-y-3">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
            <Download className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink">Baixar uma cópia dos meus dados</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-3">
              Anamnese, check-ins, prescrição, protocolos e links dos exames, num arquivo (JSON).
            </p>
          </div>
        </div>
        <Button variant="secondary" full icon={baixado ? Check : Download} loading={baixando} onClick={() => void baixar()}>
          {baixado ? 'Cópia baixada' : 'Baixar meus dados'}
        </Button>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay-50 text-clay-600">
            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink">Excluir minha conta</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-3">
              O pedido vai para a Ana Carla, que confirma com você e conclui a exclusão. Nada é apagado na hora.
            </p>
          </div>
        </div>

        {pedido ? (
          <p
            role="status"
            className="flex items-start gap-2.5 rounded-field border border-ochre-100 bg-ochre-50 px-4 py-3 text-[13px] leading-relaxed text-ochre-700"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            Pedido de exclusão enviado em {new Date(pedido.created_at).toLocaleDateString('pt-BR')}. A Ana vai entrar
            em contato para concluir.
          </p>
        ) : formAberto ? (
          <div className="space-y-3">
            <Field label="Quer contar o motivo? (opcional)" htmlFor={idMotivo}>
              <textarea
                id={idMotivo}
                rows={3}
                maxLength={1000}
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </Field>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="danger" icon={Trash2} loading={enviando} onClick={() => void enviarPedido()}>
                Enviar pedido de exclusão
              </Button>
              <Button variant="ghost" onClick={() => setFormAberto(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" full icon={Trash2} onClick={() => setFormAberto(true)}>
            Pedir exclusão da conta
          </Button>
        )}
      </Card>

      {erro && (
        <p role="alert" className="rounded-field border border-clay-100 bg-clay-50 px-4 py-3 text-[13px] leading-relaxed text-clay-600">
          {erro}
        </p>
      )}
    </section>
  );
};

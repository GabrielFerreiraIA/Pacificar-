import React from 'react';
import { HeartHandshake, LogOut, MessageCircle } from 'lucide-react';
import { Button, Logo } from '../../components/ui/Primitives';
import { useAuth } from '../../context/AuthContext';
import { linkWhatsAppAna } from '../../config/contato';

/**
 * Acesso suspenso (T-23): reembolso ou chargeback deixam profiles.access_status = 'revoked'.
 * Nada é apagado (D2): o histórico fica guardado e o acesso pode ser reativado.
 */
export const SuspendedPage: React.FC = () => {
  const { session, profile, signOut } = useAuth();
  const nome = profile?.full_name?.split(' ')[0];

  return (
    <div className="grain flex min-h-dvh flex-col bg-canvas">
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10">
        <section className="card rise p-7 text-center">
          <Logo className="mx-auto mb-5 h-12 w-12" />
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ochre-50 text-ochre-600">
            <HeartHandshake className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p className="eyebrow mb-2">Acesso pausado</p>
          <h2 className="text-[24px] leading-tight text-ink">
            {nome ? `${nome}, sua jornada está pausada` : 'Sua jornada está pausada'}
          </h2>
          <p className="mx-auto mt-3 max-w-[34ch] text-[14px] leading-relaxed text-ink-2">
            O acesso a esta conta foi suspenso, geralmente por um reembolso ou cancelamento da compra. Seus registros
            continuam guardados com cuidado.
          </p>
          <p className="mx-auto mt-3 max-w-[34ch] text-[14px] leading-relaxed text-ink-2">
            Se isso foi um engano ou você quer voltar, fale com a Ana Carla. Ela reativa seu acesso.
          </p>

          <div className="mt-7 flex flex-col gap-2.5">
            <a
              href={linkWhatsAppAna(
                `Olá, Ana! Meu acesso ao Pacificar aparece como pausado (${session?.user.email ?? ''}). Pode me ajudar?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="tap press inline-flex items-center justify-center gap-2 rounded-full border border-leaf-600 bg-leaf-600 px-6 py-4 text-[15px] font-semibold text-white shadow-leaf-sm hover:bg-leaf-700"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Falar com a Ana no WhatsApp
            </a>
            <Button variant="ghost" icon={LogOut} onClick={() => void signOut()}>
              Sair e entrar com outra conta
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

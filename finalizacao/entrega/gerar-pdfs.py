# Gera os PDFs de entrega do Pacificar (para a entrega "Arquivos" da Eduzz).
# A entrega "Customizado" da Eduzz só aceita uma URL, então quem explica o acesso à
# compradora é este PDF de uma página, entregue junto.
#
# Uso (na raiz do projeto):  py finalizacao/entrega/gerar-pdfs.py
# Saída: finalizacao/entrega/como-acessar-pacificar.pdf  (produtos de 21 e de 7 dias)
#        finalizacao/entrega/como-acessar-upgrade.pdf    (produto de upgrade)
# Se o endereço do app mudar (domínio próprio), altere APP_URL abaixo e gere de novo.
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfgen import canvas

APP_URL = "https://detoxpacificar21.vercel.app"

PASTA = Path(__file__).resolve().parent
LOGO = PASTA.parent.parent / "public" / "logo.png"

FOLHA = HexColor("#2D6B48")
FOLHA_CLARA = HexColor("#E1EFE6")
OCRE = HexColor("#D0954A")
PERGAMINHO = HexColor("#F7F5F0")
TINTA = HexColor("#16211C")
TINTA_2 = HexColor("#4A5750")
LINHA = HexColor("#DAD6CB")

W, H = A4
M = 48
LARG = W - 2 * M


def paragrafo(c, texto, x, y, largura, fonte="Helvetica", tam=11, cor=TINTA_2, entrelinha=1.45):
    """Escreve texto com quebra de linha. Devolve o y logo abaixo do bloco."""
    c.setFont(fonte, tam)
    c.setFillColor(cor)
    for linha in simpleSplit(texto, fonte, tam, largura):
        c.drawString(x, y, linha)
        y -= tam * entrelinha
    return y


def altura(texto, largura, fonte="Helvetica", tam=11, entrelinha=1.45):
    return len(simpleSplit(texto, fonte, tam, largura)) * tam * entrelinha


def cartao(c, y, numero, titulo, corpo, destaque_url=None):
    """Cartão branco com número. Devolve o y abaixo do cartão."""
    pad = 16
    x_texto = M + pad + 34
    larg_texto = LARG - pad * 2 - 34
    h = pad * 2 + 16 + 4 + altura(corpo, larg_texto)
    if destaque_url:
        h += 26
    topo = y
    c.setFillColor(white)
    c.setStrokeColor(LINHA)
    c.roundRect(M, topo - h, LARG, h, 12, fill=1, stroke=1)
    # número
    c.setFillColor(FOLHA)
    c.circle(M + pad + 12, topo - pad - 9, 12, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(M + pad + 12, topo - pad - 13, str(numero))
    # título
    c.setFillColor(TINTA)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(x_texto, topo - pad - 12, titulo)
    cursor = topo - pad - 12 - 18
    if destaque_url:
        c.setFillColor(FOLHA)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(x_texto, cursor, destaque_url)
        c.linkURL(destaque_url, (x_texto, cursor - 3, x_texto + c.stringWidth(destaque_url, "Helvetica-Bold", 14), cursor + 12))
        cursor -= 24
    paragrafo(c, corpo, x_texto, cursor, larg_texto)
    return topo - h - 12


def caixa(c, y, titulo, linhas, fundo, borda, cor_titulo):
    pad = 16
    larg = LARG - pad * 2
    h = pad * 2 + 14 + sum(altura(t, larg, tam=10.5) + 4 for t in linhas)
    c.setFillColor(fundo)
    c.setStrokeColor(borda)
    c.roundRect(M, y - h, LARG, h, 12, fill=1, stroke=1)
    c.setFillColor(cor_titulo)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(M + pad, y - pad - 10, titulo)
    cursor = y - pad - 10 - 18
    for t in linhas:
        cursor = paragrafo(c, t, M + pad, cursor, larg, tam=10.5) - 4
    return y - h - 12


def cabecalho(c):
    c.setFillColor(PERGAMINHO)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    topo = H - M
    if LOGO.exists():
        c.drawImage(str(LOGO), M, topo - 44, 44, 44, mask="auto")
    c.setFillColor(TINTA)
    c.setFont("Times-Bold", 22)
    c.drawString(M + 56, topo - 22, "Pacificar")
    c.setFont("Helvetica", 9.5)
    c.setFillColor(TINTA_2)
    c.drawString(M + 56, topo - 38, "Ana Carla Nesi  |  Saúde Integrativa & Ayurveda")
    c.setStrokeColor(LINHA)
    c.line(M, topo - 58, W - M, topo - 58)
    return topo - 58


def rodape(c):
    texto = (
        "O Pacificar é um programa educativo e de acompanhamento em saúde integrativa. "
        "Ele não substitui consulta, diagnóstico ou tratamento médico."
    )
    c.setStrokeColor(LINHA)
    c.line(M, 62, W - M, 62)
    paragrafo(c, texto, M, 48, LARG, tam=8.5, cor=TINTA_2, entrelinha=1.4)


def gerar_acesso(destino):
    c = canvas.Canvas(str(destino), pagesize=A4)
    c.setTitle("Como acessar o Pacificar")
    c.setAuthor("Ana Carla Nesi")
    y = cabecalho(c) - 42
    c.setFillColor(FOLHA)
    c.setFont("Times-Bold", 30)
    c.drawString(M, y, "Seu acesso está liberado")
    y -= 24
    y = paragrafo(
        c,
        "Sua conta já foi criada com o mesmo e-mail da sua compra. Você não vai receber "
        "nenhum e-mail do aplicativo: é só seguir os 3 passos abaixo.",
        M, y, LARG, tam=12,
    ) - 12

    y = cartao(c, y, 1, "Abra o aplicativo", "Toque no endereço acima ou digite no navegador do celular ou do computador.", APP_URL)
    y = cartao(c, y, 2, "Digite o e-mail da compra", "Use exatamente o mesmo e-mail que você informou ao comprar na Eduzz. É por ele que o seu acesso é reconhecido.")
    y = cartao(
        c, y, 3, "Escolha a sua senha",
        "No primeiro acesso, a senha que você digitar (mínimo de 8 caracteres) fica salva como a sua. "
        "Anote em um lugar seguro. Depois é só entrar com e-mail e senha. Em seguida, aceite o termo "
        "e comece pelo Dia 1.",
    )
    y = caixa(
        c, y, "Instale no celular (recomendado)",
        [
            "iPhone (Safari): toque em Compartilhar e depois em Adicionar à Tela de Início.",
            "Android (Chrome): toque no menu (três pontinhos) e depois em Instalar aplicativo ou Adicionar à tela inicial.",
            "Assim o Pacificar abre como um aplicativo, com o ícone na sua tela.",
        ],
        FOLHA_CLARA, HexColor("#C3DFCE"), FOLHA,
    )
    caixa(
        c, y, "Algo não funcionou?",
        [
            "Confira se o e-mail foi digitado exatamente como na compra, sem espaço no fim.",
            "Se ainda assim não conseguir entrar, fale com a Ana pelo e-mail de suporte que aparece na sua compra na Eduzz.",
        ],
        white, LINHA, OCRE,
    )
    rodape(c)
    c.showPage()
    c.save()


def gerar_upgrade(destino):
    c = canvas.Canvas(str(destino), pagesize=A4)
    c.setTitle("Seu upgrade para os 21 dias do Pacificar")
    c.setAuthor("Ana Carla Nesi")
    y = cabecalho(c) - 42
    c.setFillColor(FOLHA)
    c.setFont("Times-Bold", 30)
    c.drawString(M, y, "Seu upgrade está liberado")
    y -= 24
    y = paragrafo(
        c,
        "Os dias 8 a 21 já fazem parte da sua jornada. Você continua exatamente de onde parou, "
        "com a anamnese, os check-ins e os exames que já registrou.",
        M, y, LARG, tam=12,
    ) - 12

    y = cartao(c, y, 1, "Volte para o aplicativo", "Abra o Pacificar no mesmo aparelho de sempre.", APP_URL)
    y = cartao(
        c, y, 2, "Veja os dias se abrirem",
        "O aplicativo confere a sua compra sozinho, em alguns minutos. Se o dia 8 ainda estiver com "
        "cadeado, feche o aplicativo e abra de novo. Boleto pode levar até 3 dias úteis para confirmar.",
    )
    y = cartao(
        c, y, 3, "Siga para o Dia 8",
        "A semana 2 (Agni e vitalidade) e a semana 3 (harmonia mente-corpo) estão te esperando, "
        "com os relatórios dos dias 14 e 21.",
    )
    caixa(
        c, y, "Algo não funcionou?",
        [
            "Confira se a compra do upgrade foi feita com o mesmo e-mail que você usa para entrar no aplicativo.",
            "Se os dias continuarem bloqueados, fale com a Ana pelo e-mail de suporte que aparece na sua compra na Eduzz.",
        ],
        white, LINHA, OCRE,
    )
    rodape(c)
    c.showPage()
    c.save()


if __name__ == "__main__":
    gerar_acesso(PASTA / "como-acessar-pacificar.pdf")
    gerar_upgrade(PASTA / "como-acessar-upgrade.pdf")
    print("PDFs gerados em", PASTA)

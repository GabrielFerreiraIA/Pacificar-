# Prompts das imagens de impacto muito alto (com a marca PACIFICAR)

Gerado por script. O **bloco de marca** já está embutido em cada prompt (cada um é independente, é só copiar e colar). O arquivo `prompts-imagens-marca.json` traz os mesmos dados para automação.

**Ordem de execução:** (1) botão "Ver receita" na refeição, que não usa imagem nova; (2) Preparo; (3) Anamnese e doshas.

**Dois formatos de prompt:**
- **Foto individual** (Preparo) e **ícone individual** (Fase 3a): um prompt gera uma imagem.
- **Folha de ícones** (Fases 3b a 3e): **um mega prompt gera uma imagem grande 1:1 com 4 ícones em grade 2x2**, que depois é recortada. Mais rápido e o traço sai idêntico nos 4. Cada folha tem um "Plano B" com os prompts individuais, caso a IA erre a grade.

## Identidade da marca usada nos prompts

| Elemento | Valor |
|---|---|
| Logo | Quadrado arredondado verde-floresta com uma folha branca e um pequeno sol dourado |
| Verde floresta (primária) | `#2D6B48` (claro `#61A681`, folha `#E1EFE6`) |
| Cúrcuma / ocre (acento) | `#D0954A` |
| Fundo pergaminho | `#F7F5F0` |
| Argila (só detalhe mínimo) | `#BA3C3C` |
| Tinta (contornos finos) | `#16211C` |
| Doshas (já no app) | Vata `#BA7A3C` · Pitta `#3C8E5E` · Kapha `#B04C2E` |
| Tipografia do app | Fraunces (títulos) e Plus Jakarta Sans (texto). Nenhuma imagem deve ter texto; as letras ficam por conta do app |
| Humor | Calmo, orgânico, ayurvédico, acolhedor, minimalista, com muito respiro |

**Bloco de FOTO** (fim de cada prompt do Preparo):
> Style: editorial top-down still-life photograph with a slight 20° angle, the same look as the PACIFICAR dish photos. Handmade off-white speckled ceramic and natural materials on a light natural wood table, an olive-green linen cloth, soft diffused window light from the left, shallow depth of field, realistic and appetizing/calm. Brand palette: forest green (#2D6B48), turmeric ochre (#D0954A), warm parchment cream (#F7F5F0), warm wood tones. Mood: calm, organic, Ayurvedic wellness, warm and welcoming, minimalist with generous breathing room. A small sprig of fresh herb or a leaf as a prop. No text, no letters, no logos, no brand names, no people, no hands. 4:3 landscape.

**Bloco de ILUSTRAÇÃO** (fim de cada prompt de ícone individual):
> Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.

## Como usar as folhas de ícones (Fases 3b a 3e)

1. Cole o mega prompt da folha na ferramenta e gere em **formato quadrado (1:1)**. Quanto maior a resolução, melhor (ideal 2048 px; se vier 1024 px também serve).
2. Confira **antes de recortar**: os 4 ícones estão na ordem pedida, cada um no centro da sua célula, sem linhas, sem texto, mesmo traço e mesma escala. Se algum saiu errado, **peça só a correção** ("redesenhe o ícone do canto superior direito como …, mantendo os demais idênticos") ou gere a folha de novo.
3. **Jogue os arquivos numa pasta qualquer** (qualquer nome serve, desde que contenha o nome do item: `climas.png`, `Raspador de lingua.png`, `sabor-doce · Doce.png`…) e rode `npm run imagens:importar -- "caminho/da/pasta"`. O script reconhece o nome, **renomeia e organiza** cada arquivo em `imagens-origem/<grupo>/` e põe as folhas em `_folhas/`.
4. Rode `npm run imagens`. Ele **corta as folhas** exatamente nos quadrantes (`clima-frio.png`…), **converte tudo para WebP leve** e grava em `public/` (preparo, anamnese, doshas e pratos). Depois é só commitar `public/`.
5. Se a IA não respeitar a grade de jeito nenhum, use o **Plano B** (prompts individuais) da mesma seção.

**Dica:** gere as 4 folhas **na mesma conversa**, começando pela de clima. Depois de aprovada, peça "mesmo estilo da folha anterior" para as demais, assim as 15 ilustrações ficam como uma série só.

## Como salvar (ícones e fotos individuais)

| Grupo | Pasta | Nome do arquivo |
|---|---|---|
| Preparo | `imagens-origem/preparo/` | o **ID** (ex.: `raspador.png`) |
| Anamnese (sabores) | `imagens-origem/anamnese/` | o **ID** (ex.: `sabor-doce.png`) |
| Folhas | `imagens-origem/<pasta>/_folhas/` | o nome da folha (ex.: `clima.png`) |

Essas pastas ficam fora do git (como as dos pratos). Depois eu converto tudo para WebP e ligo cada imagem na tela.

**Cuidados:** confira se não saiu nenhum texto ou marca nas embalagens. O kit de desparasitação inclui ivermectina, que exige receita: a imagem usa embalagens genéricas e sem texto de propósito.

## Fase 2 · Preparo (impacto muito alto)

Fotos dos 7 itens da aba **Preparo**. A pessoa precisa reconhecer o produto na hora da compra. Estilo: fotografia, igual à das refeições.

**raspador** · Raspador de língua de cobre · 4:3

```
Editorial still-life photograph of: A polished copper tongue scraper (a U-shaped thin copper strip with two small handle loops), resting on a folded linen cloth, with a small glass of warm water beside it.
Style: editorial top-down still-life photograph with a slight 20° angle, the same look as the PACIFICAR dish photos. Handmade off-white speckled ceramic and natural materials on a light natural wood table, an olive-green linen cloth, soft diffused window light from the left, shallow depth of field, realistic and appetizing/calm. Brand palette: forest green (#2D6B48), turmeric ochre (#D0954A), warm parchment cream (#F7F5F0), warm wood tones. Mood: calm, organic, Ayurvedic wellness, warm and welcoming, minimalist with generous breathing room. A small sprig of fresh herb or a leaf as a prop. No text, no letters, no logos, no brand names, no people, no hands. 4:3 landscape.
```

**zeolita** · Zeólita clinoptilolita · 4:3

```
Editorial still-life photograph of: A small glass jar of fine pale grey-beige mineral powder with no label, the lid beside it, a wooden spoon with a little powder, and a glass of water, on a ceramic saucer.
Style: editorial top-down still-life photograph with a slight 20° angle, the same look as the PACIFICAR dish photos. Handmade off-white speckled ceramic and natural materials on a light natural wood table, an olive-green linen cloth, soft diffused window light from the left, shallow depth of field, realistic and appetizing/calm. Brand palette: forest green (#2D6B48), turmeric ochre (#D0954A), warm parchment cream (#F7F5F0), warm wood tones. Mood: calm, organic, Ayurvedic wellness, warm and welcoming, minimalist with generous breathing room. A small sprig of fresh herb or a leaf as a prop. No text, no letters, no logos, no brand names, no people, no hands. 4:3 landscape.
```

**desparasitacao** · Kit de desparasitação lunar · 4:3

```
Editorial still-life photograph of: Three unbranded wellness items neatly arranged: a plain white blister pack of tablets, a small amber glass dropper bottle, and a small jar of black activated charcoal capsules, with a subtle full moon motif (a round pale ceramic disc) in the background. All packaging completely blank, no text anywhere.
Style: editorial top-down still-life photograph with a slight 20° angle, the same look as the PACIFICAR dish photos. Handmade off-white speckled ceramic and natural materials on a light natural wood table, an olive-green linen cloth, soft diffused window light from the left, shallow depth of field, realistic and appetizing/calm. Brand palette: forest green (#2D6B48), turmeric ochre (#D0954A), warm parchment cream (#F7F5F0), warm wood tones. Mood: calm, organic, Ayurvedic wellness, warm and welcoming, minimalist with generous breathing room. A small sprig of fresh herb or a leaf as a prop. No text, no letters, no logos, no brand names, no people, no hands. 4:3 landscape.
```

**massalas** · Massalas ayurvédicas · 4:3

```
Editorial still-life photograph of: Three small handmade ceramic bowls of spice blends in three colors (golden ochre, olive green, terracotta), surrounded by whole spices: cumin seeds, fennel seeds, coriander seeds, cinnamon sticks, cardamom pods, turmeric root, with tiny wooden spoons.
Style: editorial top-down still-life photograph with a slight 20° angle, the same look as the PACIFICAR dish photos. Handmade off-white speckled ceramic and natural materials on a light natural wood table, an olive-green linen cloth, soft diffused window light from the left, shallow depth of field, realistic and appetizing/calm. Brand palette: forest green (#2D6B48), turmeric ochre (#D0954A), warm parchment cream (#F7F5F0), warm wood tones. Mood: calm, organic, Ayurvedic wellness, warm and welcoming, minimalist with generous breathing room. A small sprig of fresh herb or a leaf as a prop. No text, no letters, no logos, no brand names, no people, no hands. 4:3 landscape.
```

**gorduras** · Manteiga ghee e óleo de coco · 4:3

```
Editorial still-life photograph of: A glass jar of golden ghee with a spoon showing its creamy texture, next to a small jar of white coconut oil and half a coconut, on a linen cloth.
Style: editorial top-down still-life photograph with a slight 20° angle, the same look as the PACIFICAR dish photos. Handmade off-white speckled ceramic and natural materials on a light natural wood table, an olive-green linen cloth, soft diffused window light from the left, shallow depth of field, realistic and appetizing/calm. Brand palette: forest green (#2D6B48), turmeric ochre (#D0954A), warm parchment cream (#F7F5F0), warm wood tones. Mood: calm, organic, Ayurvedic wellness, warm and welcoming, minimalist with generous breathing room. A small sprig of fresh herb or a leaf as a prop. No text, no letters, no logos, no brand names, no people, no hands. 4:3 landscape.
```

**ricino** · Óleo de rícino · 4:3

```
Editorial still-life photograph of: A small dark amber glass bottle with a plain dropper, a few castor seeds, and a soft folded cotton cloth, with a warm candle glow in the background.
Style: editorial top-down still-life photograph with a slight 20° angle, the same look as the PACIFICAR dish photos. Handmade off-white speckled ceramic and natural materials on a light natural wood table, an olive-green linen cloth, soft diffused window light from the left, shallow depth of field, realistic and appetizing/calm. Brand palette: forest green (#2D6B48), turmeric ochre (#D0954A), warm parchment cream (#F7F5F0), warm wood tones. Mood: calm, organic, Ayurvedic wellness, warm and welcoming, minimalist with generous breathing room. A small sprig of fresh herb or a leaf as a prop. No text, no letters, no logos, no brand names, no people, no hands. 4:3 landscape.
```

**chas** · Chás e ervas digestivas · 4:3

```
Editorial still-life photograph of: A rustic ceramic teapot and a cup of herbal tea, surrounded by loose dried herbs in small bowls: chamomile flowers, fennel seeds, lemongrass, and fresh ginger, mint and basil leaves.
Style: editorial top-down still-life photograph with a slight 20° angle, the same look as the PACIFICAR dish photos. Handmade off-white speckled ceramic and natural materials on a light natural wood table, an olive-green linen cloth, soft diffused window light from the left, shallow depth of field, realistic and appetizing/calm. Brand palette: forest green (#2D6B48), turmeric ochre (#D0954A), warm parchment cream (#F7F5F0), warm wood tones. Mood: calm, organic, Ayurvedic wellness, warm and welcoming, minimalist with generous breathing room. A small sprig of fresh herb or a leaf as a prop. No text, no letters, no logos, no brand names, no people, no hands. 4:3 landscape.
```


## Fase 3a · Anamnese: "Qual sabor você mais gosta?" (6 sabores / rasas)

Ilustrações pequenas, um prompt por ícone.

**sabor-doce** · Doce · 1:1

```
Icon-style illustration for the answer "Doce" (sabor preferido): a ripe golden date and a slice of sweet potato, simple and soft.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**sabor-salgado** · Salgado · 1:1

```
Icon-style illustration for the answer "Salgado" (sabor preferido): a small ceramic bowl of coarse sea salt crystals with a tiny wooden spoon.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**sabor-acido** · Ácido · 1:1

```
Icon-style illustration for the answer "Ácido" (sabor preferido): half a lemon with a wedge, bright and juicy.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**sabor-picante** · Picante · 1:1

```
Icon-style illustration for the answer "Picante" (sabor preferido): a fresh ginger root piece and a red chili pepper.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**sabor-amargo** · Amargo · 1:1

```
Icon-style illustration for the answer "Amargo" (sabor preferido): a few dark green bitter leaves (arugula or dandelion) with a small turmeric root.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**sabor-adstringente** · Adstringente · 1:1

```
Icon-style illustration for the answer "Adstringente" (sabor preferido): a pomegranate half showing its seeds and a green unripe banana.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```


## Fase 3b · Anamnese: "Qual clima você se sente mais desconfortável?"

Folha única com 4 ícones (2x2).

**Folha `clima`** · salvar em `imagens-origem/anamnese/_folhas/clima.png` · ordem do recorte: clima-frio → clima-quente → clima-seco → clima-chuvoso

```
Create ONE square image (1:1, 2048x2048) that is an icon sheet with 4 separate icons for a wellness app questionnaire (climate that feels uncomfortable). Treat it like a sticker/sprite sheet that will be cropped afterwards.

LAYOUT (very important): divide the canvas into an invisible 2x2 grid of four exactly equal square cells (each 1024x1024). Exactly one icon per cell, in this order:
- top-left = "Frio": a soft knitted scarf and a snowflake-like frost crystal, cool and cozy
- top-right = "Quente": a warm round sun with gentle rays above a small cactus-like leaf, sunny and hot
- bottom-left = "Seco": a cracked dry earth patch with a single dry leaf and a gentle wind swirl
- bottom-right = "Chuvoso": a calm rain cloud with soft raindrops falling over a small green leaf

GRID RULES: each icon is centered in its own cell, all icons at the same scale (about 60% of the cell width), with at least 20% empty margin to every cell edge so a crop along the exact middle lines never touches the artwork. Absolutely no grid lines, no borders, no frames, no cards, no dividers, no captions. Nothing may cross the middle lines. One continuous flat parchment background (#F7F5F0) shared by the whole sheet, with no shadows or vignette at the edges.

ICONS:
(1) Frio: a soft knitted scarf and a snowflake-like frost crystal, cool and cozy
(2) Quente: a warm round sun with gentle rays above a small cactus-like leaf, sunny and hot
(3) Seco: a cracked dry earth patch with a single dry leaf and a gentle wind swirl
(4) Chuvoso: a calm rain cloud with soft raindrops falling over a small green leaf

Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. Identical style, line weight, shading and brightness across all icons. Each icon is a single simple subject, readable at about 80 px. No text, no letters, no numbers, no watermark.
```

<details><summary>Plano B: prompts individuais (4 ícones)</summary>

**clima-frio** · Frio · 1:1

```
Icon-style illustration for the answer "Frio" (clima desconfortável): a soft knitted scarf and a snowflake-like frost crystal, cool and cozy.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**clima-quente** · Quente · 1:1

```
Icon-style illustration for the answer "Quente" (clima desconfortável): a warm round sun with gentle rays above a small cactus-like leaf, sunny and hot.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**clima-seco** · Seco · 1:1

```
Icon-style illustration for the answer "Seco" (clima desconfortável): a cracked dry earth patch with a single dry leaf and a gentle wind swirl.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**clima-chuvoso** · Chuvoso · 1:1

```
Icon-style illustration for the answer "Chuvoso" (clima desconfortável): a calm rain cloud with soft raindrops falling over a small green leaf.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

</details>

## Fase 3c · Anamnese: "Sua pele tem tendência predominante:"

Folha única com 4 ícones (2x2).

**Folha `pele`** · salvar em `imagens-origem/anamnese/_folhas/pele.png` · ordem do recorte: pele-seca → pele-oleosa → pele-normal → pele-mista

```
Create ONE square image (1:1, 2048x2048) that is an icon sheet with 4 separate icons for a wellness app questionnaire (skin tendency). Treat it like a sticker/sprite sheet that will be cropped afterwards.

LAYOUT (very important): divide the canvas into an invisible 2x2 grid of four exactly equal square cells (each 1024x1024). Exactly one icon per cell, in this order:
- top-left = "Seca": a close, abstract pale skin surface with fine dry flaky texture, shown as a soft rounded patch, delicate and matte
- top-right = "Oleosa": a close, abstract skin surface with a glossy dewy sheen and a few tiny shiny droplets, shown as a soft rounded patch
- bottom-left = "Média": a close, abstract healthy even skin surface, smooth and balanced, shown as a soft rounded patch
- bottom-right = "Mista": a rounded patch divided into two zones: one side matte and dry, the other glossy and dewy, softly blended

GRID RULES: each icon is centered in its own cell, all icons at the same scale (about 60% of the cell width), with at least 20% empty margin to every cell edge so a crop along the exact middle lines never touches the artwork. Absolutely no grid lines, no borders, no frames, no cards, no dividers, no captions. Nothing may cross the middle lines. One continuous flat parchment background (#F7F5F0) shared by the whole sheet, with no shadows or vignette at the edges.

ICONS:
(1) Seca: a close, abstract pale skin surface with fine dry flaky texture, shown as a soft rounded patch, delicate and matte
(2) Oleosa: a close, abstract skin surface with a glossy dewy sheen and a few tiny shiny droplets, shown as a soft rounded patch
(3) Média: a close, abstract healthy even skin surface, smooth and balanced, shown as a soft rounded patch
(4) Mista: a rounded patch divided into two zones: one side matte and dry, the other glossy and dewy, softly blended

Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. Identical style, line weight, shading and brightness across all icons. Each icon is a single simple subject, readable at about 80 px. No text, no letters, no numbers, no watermark.
```

<details><summary>Plano B: prompts individuais (4 ícones)</summary>

**pele-seca** · Seca · 1:1

```
Icon-style illustration for the answer "Seca" (tendência da pele): a close, abstract pale skin surface with fine dry flaky texture, shown as a soft rounded patch, delicate and matte.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**pele-oleosa** · Oleosa · 1:1

```
Icon-style illustration for the answer "Oleosa" (tendência da pele): a close, abstract skin surface with a glossy dewy sheen and a few tiny shiny droplets, shown as a soft rounded patch.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**pele-normal** · Média · 1:1

```
Icon-style illustration for the answer "Média" (tendência da pele): a close, abstract healthy even skin surface, smooth and balanced, shown as a soft rounded patch.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**pele-mista** · Mista · 1:1

```
Icon-style illustration for the answer "Mista" (tendência da pele): a rounded patch divided into two zones: one side matte and dry, the other glossy and dewy, softly blended.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

</details>

## Fase 3d · Anamnese: "Pratica exercício físico?"

Folha única com 3 ícones + 1 célula vazia. Pessoas sempre sem rosto, em formas simples.

**Folha `exercicio`** · salvar em `imagens-origem/anamnese/_folhas/exercicio.png` · ordem do recorte: exercicio-suave → exercicio-moderado → exercicio-vigoroso

```
Create ONE square image (1:1, 2048x2048) that is an icon sheet with 3 separate icons for a wellness app questionnaire (exercise intensity). Treat it like a sticker/sprite sheet that will be cropped afterwards.

LAYOUT (very important): divide the canvas into an invisible 2x2 grid of four exactly equal square cells (each 1024x1024). Exactly one icon per cell, in this order:
- top-left = "Suave": a person seated in a calm yoga pose (easy pose) with a soft leaf beside them; faceless, simple shapes
- top-right = "Moderado": a person walking at a steady pace with a gentle stride; faceless, simple shapes
- bottom-left = "Vigoroso": a person running with dynamic posture; faceless, simple shapes
- bottom-right = leave this cell completely empty (plain parchment, nothing drawn)

GRID RULES: each icon is centered in its own cell, all icons at the same scale (about 60% of the cell width), with at least 20% empty margin to every cell edge so a crop along the exact middle lines never touches the artwork. Absolutely no grid lines, no borders, no frames, no cards, no dividers, no captions. Nothing may cross the middle lines. One continuous flat parchment background (#F7F5F0) shared by the whole sheet, with no shadows or vignette at the edges.

ICONS:
(1) Suave: a person seated in a calm yoga pose (easy pose) with a soft leaf beside them; faceless, simple shapes
(2) Moderado: a person walking at a steady pace with a gentle stride; faceless, simple shapes
(3) Vigoroso: a person running with dynamic posture; faceless, simple shapes

Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. Identical style, line weight, shading and brightness across all icons. Each icon is a single simple subject, readable at about 80 px. No text, no letters, no numbers, no watermark.
```

<details><summary>Plano B: prompts individuais (3 ícones)</summary>

**exercicio-suave** · Suave · 1:1

```
Icon-style illustration for the answer "Suave" (intensidade do exercício): a person seated in a calm yoga pose (easy pose) with a soft leaf beside them; faceless, simple shapes.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**exercicio-moderado** · Moderado · 1:1

```
Icon-style illustration for the answer "Moderado" (intensidade do exercício): a person walking at a steady pace with a gentle stride; faceless, simple shapes.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**exercicio-vigoroso** · Vigoroso · 1:1

```
Icon-style illustration for the answer "Vigoroso" (intensidade do exercício): a person running with dynamic posture; faceless, simple shapes.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

</details>

## Fase 3e · Teste de doshas (T-53) e resultado

Folha única com os 3 emblemas + 1 célula vazia. As cores de cada dosha são as mesmas das Massalas do app.

**Folha `doshas`** · salvar em `imagens-origem/doshas/_folhas/doshas.png` · ordem do recorte: dosha-vata → dosha-pitta → dosha-kapha

```
Create ONE square image (1:1, 2048x2048) that is an icon sheet with 3 separate icons for a wellness app questionnaire (the three Ayurvedic doshas, as emblems). Treat it like a sticker/sprite sheet that will be cropped afterwards.

LAYOUT (very important): divide the canvas into an invisible 2x2 grid of four exactly equal square cells (each 1024x1024). Exactly one icon per cell, in this order:
- top-left = "Vata": The Vata dosha (air and ether): a light swirling breeze and a few floating dry leaves around a slender crescent form, airy, light and fast, mainly in warm ochre-brown (#BA7A3C) with forest-green accents
- top-right = "Pitta": The Pitta dosha (fire and water): a gentle flame rising from a clear water drop, balanced between warmth and coolness, mainly in fresh green (#3C8E5E) with ochre accents
- bottom-left = "Kapha": The Kapha dosha (earth and water): a smooth round stone resting by a calm water pool with a small sprouting leaf, grounded, steady and soft, mainly in terracotta (#B04C2E) with green accents
- bottom-right = leave this cell completely empty (plain parchment, nothing drawn)

GRID RULES: each icon is centered in its own cell, all icons at the same scale (about 60% of the cell width), with at least 20% empty margin to every cell edge so a crop along the exact middle lines never touches the artwork. Absolutely no grid lines, no borders, no frames, no cards, no dividers, no captions. Nothing may cross the middle lines. One continuous flat parchment background (#F7F5F0) shared by the whole sheet, with no shadows or vignette at the edges.

ICONS:
(1) Vata: The Vata dosha (air and ether): a light swirling breeze and a few floating dry leaves around a slender crescent form, airy, light and fast, mainly in warm ochre-brown (#BA7A3C) with forest-green accents
(2) Pitta: The Pitta dosha (fire and water): a gentle flame rising from a clear water drop, balanced between warmth and coolness, mainly in fresh green (#3C8E5E) with ochre accents
(3) Kapha: The Kapha dosha (earth and water): a smooth round stone resting by a calm water pool with a small sprouting leaf, grounded, steady and soft, mainly in terracotta (#B04C2E) with green accents

Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. Identical style, line weight, shading and brightness across all icons. Each icon is a single simple subject, readable at about 80 px. No text, no letters, no numbers, no watermark.
```

<details><summary>Plano B: prompts individuais (3 ícones)</summary>

**dosha-vata** · Vata · 1:1

```
Icon-style illustration for the answer "Vata" (dosha): The Vata dosha (air and ether): a light swirling breeze and a few floating dry leaves around a slender crescent form, airy, light and fast, mainly in warm ochre-brown (#BA7A3C) with forest-green accents.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**dosha-pitta** · Pitta · 1:1

```
Icon-style illustration for the answer "Pitta" (dosha): The Pitta dosha (fire and water): a gentle flame rising from a clear water drop, balanced between warmth and coolness, mainly in fresh green (#3C8E5E) with ochre accents.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

**dosha-kapha** · Kapha · 1:1

```
Icon-style illustration for the answer "Kapha" (dosha): The Kapha dosha (earth and water): a smooth round stone resting by a calm water pool with a small sprouting leaf, grounded, steady and soft, mainly in terracotta (#B04C2E) with green accents.
Style: soft hand-painted gouache illustration with a subtle paper grain, flat shapes, generous rounded organic forms, thin fine ink outlines (#16211C) used sparingly, calm and minimal. Strict brand palette: forest green (#2D6B48 and lighter #61A681), pale leaf green (#E1EFE6), turmeric ochre (#D0954A), warm clay red (#BA3C3C) only as a tiny accent, on a flat warm parchment background (#F7F5F0). Brand motif: echo the PACIFICAR logo language, a leaf with a small golden sun dot, as a subtle detail when it fits. One single centered subject with at least 15% empty margin on every side, no scene clutter, readable at very small sizes (about 80 px). Identical line weight, shading and style across the whole series. No text, no letters, no numbers, no watermark. Square 1:1, 1024x1024.
```

</details>

## Ficam para depois (impacto alto)

Check-in noturno (estufamento e vontade de doce), Protocolos (zeólita e 5 luas), Massalas, rituais de autocuidado, relatório semanal e boas-vindas. Esses também podem virar folhas de ícones na mesma base de marca.

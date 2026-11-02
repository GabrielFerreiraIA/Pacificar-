/* Opções de refeição sugeridas pela Ana Carla.
   Não seguem a ordem dos dias: aparecem como alternativas ("Ver outra opção")
   em cada cartão de refeição, somadas à refeição própria do dia. */

export type MealKind = 'breakfast' | 'lunch' | 'dinner';

export const MEAL_OPTIONS: Record<MealKind, string[]> = {
  breakfast: [
    'Omelete de 2 ovos com espinafre, mamão com chia',
    'Tapioca com ovo mexido e tomate',
    'Vitamina de banana, abacate e leite de coco, castanhas',
    'Cuscuz de milho com ovo e abacate',
    'Panqueca de banana e ovo com canela e frutas vermelhas',
    'Mingau de chia com leite de coco e maçã com canela',
    'Ovos mexidos com cogumelos, abacate, fruta',
    'Tapioca com coco ralado sem açúcar e banana',
    'Iogurte de coco sem açúcar com frutas, sementes de abóbora e castanhas',
    'Crepioca com frango desfiado, fruta',
    'Smoothie verde (couve, abacaxi, gengibre, água de coco), 2 ovos cozidos',
    'Mingau de aveia certificada sem glúten (ou flocos de quinoa) com maçã e canela',
    'Ovos mexidos com tomate e manjericão, batata-doce assada',
    'Tapioca com abacate e ovo',
    'Panqueca de banana com pasta de amendoim 100% amendoim',
    'Vitamina de mamão com leite de coco e linhaça, castanhas',
    'Cuscuz com ovo e couve refogada, fruta',
    'Mingau de chia com coco e frutas vermelhas',
    'Crepioca com tomate e orégano, abacate',
    'Ovos mexidos, abacate, mamão, castanhas'
  ],
  lunch: [
    'Frango grelhado, arroz, feijão, couve refogada, cenoura ralada',
    'Carne moída com chuchu e cenoura, purê de batata-doce, folhas',
    'Moqueca de peixe, arroz, salada',
    'Frango ao molho de tomate caseiro com abobrinha, arroz, feijão',
    'Carne moída com purê de mandioca, salada de folhas',
    'Lentilha refogada, arroz, couve, filé de peixe',
    'Galinhada (arroz, frango, cenoura, ervilha), repolho refogado',
    'Sardinha assada, batata-doce, folhas com beterraba',
    'Carne de panela com mandioca, feijão, couve',
    'Tilápia ao forno com ervas, purê de abóbora, arroz, brócolis',
    'Almôndegas com molho de tomate, arroz, feijão, salada',
    'Frango ao curry com leite de coco, arroz, couve-flor',
    'Salmão assado, arroz com brócolis, rúcula',
    'Bife acebolado, arroz, feijão, vagem refogada, salada',
    'Frango assado com batata, cenoura e alecrim, folhas',
    'Camarão refogado com abobrinha, arroz, salada',
    'Carne moída com chuchu e quiabo, arroz, feijão',
    'Peixe ensopado com tomate e pimentão, arroz, salada',
    'Frango desfiado com mandioquinha, arroz, feijão, salada de beterraba',
    'Espetinho de frango com legumes, arroz, farofa de ovos'
  ],
  dinner: [
    'Sopa de abóbora com gengibre e frango desfiado',
    'Peixe assado com limão, brócolis no vapor, quinoa',
    'Omelete de forno com legumes, rúcula',
    'Caldo verde (batata, couve, azeite) com ovo cozido',
    'Salada de folhas com atum, ovo, grão-de-bico e azeite',
    'Creme de mandioquinha com frango desfiado',
    'Espaguete de abobrinha com molho de tomate e carne moída',
    'Sopa de lentilha com legumes',
    'Omelete de legumes, salada de tomate e pepino',
    'Caldo de osso com legumes e frango',
    'Salada morna de quinoa com legumes assados e grão-de-bico',
    'Sopa de feijão com legumes',
    'Creme de abóbora com coco e castanhas, ovo cozido',
    'Torta de legumes (ovos, abobrinha, cenoura), salada verde',
    'Caldo de mandioca com carne desfiada e agrião',
    'Omelete recheada com frango e legumes',
    'Sopa de legumes com grão-de-bico',
    'Salada de sardinha com batata, ovo e folhas',
    'Abobrinha recheada com carne moída',
    'Caldo de legumes com ovo pochê e folhas refogadas'
  ]
};

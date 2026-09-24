/* Dados fictícios da demonstração local (T-56).
   Só existem em desenvolvimento: no build de produção DEMO vira null e o
   mockData (com a paciente fictícia e fotos do Unsplash) sai do bundle. */
import * as mock from './mockData';

export const DEMO = import.meta.env.DEV ? mock : null;

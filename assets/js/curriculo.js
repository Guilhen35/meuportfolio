'use strict';

// Computador: abre a impressão ("Salvar como PDF").
// Celular: o iPhone ignora a margem zero da impressão e corta as páginas,
// então baixa o PDF pronto (gerado no computador).
const toque = window.matchMedia('(pointer: coarse)').matches;

document.querySelector('[data-imprimir]')?.addEventListener('click', () => {
  if (!toque) return window.print();
  const link = document.createElement('a');
  link.href = '/curriculo.pdf';
  link.download = 'Curriculo-Paulo-Henrique.pdf';
  document.body.append(link);
  link.click();
  link.remove();
});

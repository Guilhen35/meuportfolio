'use strict';

// Abre a janela de impressão; ali a pessoa escolhe "Salvar como PDF"
document.querySelector('[data-imprimir]')?.addEventListener('click', () => window.print());

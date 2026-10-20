'use strict';

// Menu do celular: abre/fecha e mantém o leitor de tela informado (aria-expanded)
const botaoMenu = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

function fecharMenu() {
  menu.classList.remove('aberto');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

botaoMenu.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) fecharMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('aberto')) {
    fecharMenu();
    botaoMenu.focus();
  }
});

// Destaca no menu a seção visível na tela
const links = menu.querySelectorAll('a');
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    links.forEach((link) => {
      const ativo = link.getAttribute('href') === `#${entrada.target.id}`;
      ativo ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach((secao) => observador.observe(secao));

// textContent (e não innerHTML) evita injeção de HTML/XSS
document.querySelectorAll('[data-ano]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

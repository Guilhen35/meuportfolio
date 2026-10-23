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

// ============ Formulário de contato ============
const form = document.querySelector('[data-form-contato]');

if (form) {
  const status = form.querySelector('.form__status');
  const botao = form.querySelector('.form__enviar');
  const mensagens = {
    valueMissing: 'Preencha este campo.',
    typeMismatch: 'Digite um e-mail válido.',
    tooShort: 'Texto muito curto.',
    tooLong: 'Texto muito longo.'
  };

  function mostrarStatus(texto, tipo) {
    status.textContent = texto;
    status.dataset.tipo = tipo;
  }

  const campos = [...form.querySelectorAll('.campo input, .campo select, .campo textarea')];

  // Espaço fixo para o erro: mostrar/esconder não muda a altura do form (evita "layout shift")
  campos.forEach((campo) => {
    const erro = document.createElement('p');
    erro.className = 'campo__erro';
    erro.id = `${campo.id}-erro`;
    campo.parentElement.append(erro);
    campo.setAttribute('aria-describedby', erro.id);
  });

  // Validação no navegador é só conforto; a validação real é no servidor
  function validarCampo(campo) {
    const erro = document.getElementById(`${campo.id}-erro`);
    if (campo.validity.valid) {
      erro.textContent = '';
      campo.removeAttribute('aria-invalid');
      return true;
    }
    const tipo = Object.keys(mensagens).find((k) => campo.validity[k]) || 'valueMissing';
    erro.textContent = mensagens[tipo];
    campo.setAttribute('aria-invalid', 'true');
    return false;
  }

  campos.forEach((campo) => {
    campo.addEventListener('blur', () => validarCampo(campo));
    // Some com o erro enquanto a pessoa corrige
    campo.addEventListener('input', () => {
      if (campo.getAttribute('aria-invalid')) validarCampo(campo);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot preenchido = robô: finge sucesso e não envia
    if (form.elements._gotcha.value) {
      mostrarStatus('Mensagem enviada!', 'sucesso');
      return;
    }

    const invalidos = campos.filter((campo) => !validarCampo(campo));
    if (!form.elements.consentimento.checked) {
      mostrarStatus('Marque a caixa de consentimento para enviar.', 'erro');
      return;
    }
    if (invalidos.length) {
      invalidos[0].focus();
      mostrarStatus('Confira os campos destacados.', 'erro');
      return;
    }

    botao.disabled = true;
    botao.textContent = 'Enviando...';
    mostrarStatus('', '');

    try {
      const resposta = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

      form.reset();
      mostrarStatus('Mensagem enviada! Obrigado pelo contato, respondo em breve.', 'sucesso');
      // Pausa de 30s contra envios repetidos
      setTimeout(() => { botao.disabled = false; botao.textContent = 'Enviar mensagem'; }, 30000);
      botao.textContent = 'Enviado ✓';
    } catch (erro) {
      mostrarStatus('Não foi possível enviar agora. Tente de novo ou me chame no LinkedIn.', 'erro');
      botao.disabled = false;
      botao.textContent = 'Enviar mensagem';
    }
  });
}

// textContent (e não innerHTML) evita injeção de HTML/XSS
document.querySelectorAll('[data-ano]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Filtro de projetos por fase. Sem JavaScript, os filtros ficam escondidos e todos os projetos aparecem.
const filtros = document.querySelector('[data-filtros]');
if (filtros) {
  const cards = [...document.querySelectorAll('.projeto[data-fase]')];
  const botoes = [...filtros.querySelectorAll('[data-fase]')];

  const vazio = document.querySelector('[data-filtro-vazio]');

  filtros.addEventListener('click', (e) => {
    const botao = e.target.closest('button[data-fase]');
    if (!botao) return;
    const fase = botao.dataset.fase;
    botoes.forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
    cards.forEach((c) => { c.hidden = fase !== 'todos' && c.dataset.fase !== fase; });
    // Fase sem projetos (ex.: nada em desenvolvimento no momento): mostra um aviso no lugar da grade
    if (vazio) vazio.hidden = cards.some((c) => !c.hidden);
  });

  filtros.hidden = false;
}

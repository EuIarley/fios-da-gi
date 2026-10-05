const CONTATO = {
  whatsapp: '555180538243',
  mensagemWhatsapp: 'Olá, Gi! Vim pelo site da Fios da Gi e gostaria de saber mais sobre as peças.',
  instagram: 'fiosdagii_',
};

(function () {
  'use strict';

  const raiz = document.documentElement;
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const comportamentoRolagem = () => (movimentoReduzido.matches ? 'auto' : 'smooth');

  function iniciarRevelar() {
    const alvos = document.querySelectorAll('.revelar, [data-observar]');

    if (!('IntersectionObserver' in window) || movimentoReduzido.matches) {
      alvos.forEach((el) => el.classList.add('is-visivel'));
      return;
    }

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visivel');
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    alvos.forEach((el) => observador.observe(el));
  }

  function iniciarNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const links = Array.from(document.querySelectorAll('.menu__link'));
    const secoes = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    let agendado = false;

    function atualizar() {
      agendado = false;
      const y = window.scrollY;
      const total = raiz.scrollHeight - window.innerHeight;

      navbar.classList.toggle('is-rolado', y > 24);
      navbar.style.setProperty('--progresso', total > 0 ? Math.min(y / total, 1).toFixed(4) : '0');

      if (!secoes.length) return;

      const linha = window.innerHeight * 0.4;
      let ativa = secoes[0];
      secoes.forEach((secao) => {
        if (secao.getBoundingClientRect().top <= linha) ativa = secao;
      });
      if (y + window.innerHeight >= raiz.scrollHeight - 4) ativa = secoes[secoes.length - 1];

      links.forEach((link) => {
        const atual = link.getAttribute('href') === '#' + ativa.id;
        link.classList.toggle('is-ativo', atual);
        if (atual) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }

    function agendar() {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(atualizar);
    }

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    atualizar();
  }

  function iniciarMenu() {
    const navbar = document.getElementById('navbar');
    const menu = document.getElementById('menu');
    const botao = document.querySelector('.menu-botao');
    if (!navbar || !menu || !botao) return;

    const fundo = [document.querySelector('main'), document.querySelector('.rodape')].filter(Boolean);
    const telaPequena = window.matchMedia('(max-width: 860px)');
    const estaAberto = () => menu.classList.contains('is-aberto');

    function abrir() {
      menu.classList.add('is-aberto');
      document.body.classList.add('sem-rolagem');
      botao.setAttribute('aria-expanded', 'true');
      botao.setAttribute('aria-label', 'Fechar menu');
      fundo.forEach((el) => { el.inert = true; });
      const primeiroLink = menu.querySelector('a');
      if (primeiroLink) primeiroLink.focus({ preventScroll: true });
    }

    function fechar(devolverFoco) {
      if (!estaAberto()) return;
      menu.classList.remove('is-aberto');
      document.body.classList.remove('sem-rolagem');
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-label', 'Abrir menu');
      fundo.forEach((el) => { el.inert = false; });
      if (devolverFoco) botao.focus();
    }

    botao.addEventListener('click', () => (estaAberto() ? fechar(false) : abrir()));

    navbar.addEventListener('click', (evento) => {
      if (evento.target.closest('a')) fechar(false);
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && estaAberto()) fechar(true);
    });

    telaPequena.addEventListener('change', (evento) => {
      if (!evento.matches) fechar(false);
    });
  }

  const numeroWhatsapp = String(CONTATO.whatsapp || '').replace(/\D/g, '');
  const usuarioInstagram = String(CONTATO.instagram || '').replace(/^@/, '').trim();
  const linkInstagram = usuarioInstagram
    ? 'https://www.instagram.com/' + encodeURIComponent(usuarioInstagram) + '/'
    : '';

  function abrirEmNovaAba(link) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  let temporizadorAviso;

  function mostrarAviso(...conteudo) {
    const aviso = document.getElementById('aviso');
    if (!aviso) return;
    aviso.classList.add('is-visivel');
    aviso.replaceChildren(...conteudo);
    window.clearTimeout(temporizadorAviso);
    temporizadorAviso = window.setTimeout(() => aviso.classList.remove('is-visivel'), 6000);
  }

  function iniciarContatos() {
    if (linkInstagram) {
      document.querySelectorAll('[data-contato="instagram"]').forEach((link) => {
        link.href = linkInstagram;
        abrirEmNovaAba(link);
      });
      document.querySelectorAll('[data-instagram-usuario]').forEach((el) => {
        el.textContent = '@' + usuarioInstagram;
      });
    }

    document.querySelectorAll('[data-contato="whatsapp"]').forEach((link) => {
      if (numeroWhatsapp) {
        link.href = 'https://wa.me/' + numeroWhatsapp + '?text=' + encodeURIComponent(CONTATO.mensagemWhatsapp);
        abrirEmNovaAba(link);
        return;
      }

      link.addEventListener('click', (evento) => {
        evento.preventDefault();
        if (!linkInstagram) {
          mostrarAviso('Nosso WhatsApp ainda não está disponível por aqui.');
          return;
        }
        const perfil = document.createElement('a');
        perfil.href = linkInstagram;
        perfil.textContent = '@' + usuarioInstagram;
        abrirEmNovaAba(perfil);
        mostrarAviso('Nosso WhatsApp ainda não está disponível por aqui. Fale com a gente pelo Instagram ', perfil, '.');
      });
    });
  }

  function iniciarProdutos() {
    const itens = Array.from(document.querySelectorAll('.produto'));
    const modal = document.getElementById('modal-produto');
    if (!itens.length || !modal) return;

    const imagem = modal.querySelector('.modal__imagem');
    const titulo = modal.querySelector('.modal__titulo');
    const texto = modal.querySelector('.modal__texto');
    const numero = modal.querySelector('[data-modal-numero]');
    const total = modal.querySelector('[data-modal-total]');
    const doisDigitos = (n) => String(n).padStart(2, '0');
    let atual = 0;
    let gatilho = null;
    let temporizadorTroca;

    total.textContent = doisDigitos(itens.length);

    function preencher(indice) {
      atual = (indice + itens.length) % itens.length;
      const item = itens[atual];
      const foto = item.querySelector('.produto__midia img');
      const detalhes = item.querySelector('.produto__detalhes');

      titulo.textContent = item.querySelector('.produto__nome').textContent;
      numero.textContent = doisDigitos(atual + 1);
      texto.replaceChildren(
        detalhes
          ? detalhes.content.cloneNode(true)
          : document.createTextNode(item.querySelector('.produto__descricao').textContent)
      );

      function trocarImagem() {
        imagem.src = foto.getAttribute('src');
        imagem.alt = foto.alt;
        imagem.setAttribute('width', foto.getAttribute('width'));
        imagem.setAttribute('height', foto.getAttribute('height'));
        const mostrar = () => imagem.classList.remove('is-trocando');
        if (typeof imagem.decode === 'function') imagem.decode().then(mostrar, mostrar);
        else mostrar();
      }

      window.clearTimeout(temporizadorTroca);
      if (modal.open && !movimentoReduzido.matches) {
        imagem.classList.add('is-trocando');
        temporizadorTroca = window.setTimeout(trocarImagem, 180);
      } else {
        trocarImagem();
      }
    }

    function abrir(indice, origem) {
      gatilho = origem;
      modal.classList.remove('is-fechando');
      imagem.loading = 'eager';
      preencher(indice);
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
      document.body.classList.add('sem-rolagem');
    }

    function concluirFechamento() {
      if (typeof modal.close === 'function') modal.close();
      else {
        modal.removeAttribute('open');
        modal.dispatchEvent(new Event('close'));
      }
    }

    function fechar() {
      if (!modal.open || modal.classList.contains('is-fechando')) return;
      if (movimentoReduzido.matches) {
        concluirFechamento();
        return;
      }
      modal.classList.add('is-fechando');
      window.setTimeout(concluirFechamento, 280);
    }

    modal.addEventListener('close', () => {
      modal.classList.remove('is-fechando');
      document.body.classList.remove('sem-rolagem');
      if (gatilho) gatilho.focus();
    });

    modal.addEventListener('cancel', (evento) => {
      evento.preventDefault();
      fechar();
    });

    let cliqueComecouNoFundo = false;
    modal.addEventListener('pointerdown', (evento) => {
      cliqueComecouNoFundo = evento.target === modal;
    });
    modal.addEventListener('click', (evento) => {
      if (cliqueComecouNoFundo && evento.target === modal) fechar();
      cliqueComecouNoFundo = false;
    });

    modal.querySelector('[data-modal-fechar]').addEventListener('click', fechar);
    modal.querySelector('[data-modal-anterior]').addEventListener('click', () => preencher(atual - 1));
    modal.querySelector('[data-modal-proximo]').addEventListener('click', () => preencher(atual + 1));

    modal.addEventListener('keydown', (evento) => {
      if (evento.key === 'ArrowLeft') { evento.preventDefault(); preencher(atual - 1); }
      if (evento.key === 'ArrowRight') { evento.preventDefault(); preencher(atual + 1); }
    });

    let toqueInicial = null;
    modal.addEventListener('touchstart', (evento) => {
      toqueInicial = evento.changedTouches[0].clientX;
    }, { passive: true });
    modal.addEventListener('touchend', (evento) => {
      if (toqueInicial === null) return;
      const distancia = evento.changedTouches[0].clientX - toqueInicial;
      if (Math.abs(distancia) > 50) preencher(atual + (distancia < 0 ? 1 : -1));
      toqueInicial = null;
    }, { passive: true });

    itens.forEach((item, indice) => {
      const botao = item.querySelector('.produto__botao');
      botao.addEventListener('click', () => abrir(indice, botao));
      item.querySelector('.produto__midia').addEventListener('click', () => abrir(indice, botao));
    });

    const lista = document.querySelector('.produtos__lista');
    const pontos = document.querySelector('.produtos__pontos');
    if (!lista || !pontos) return;

    const botoesPontos = itens.map((item, indice) => {
      const ponto = document.createElement('button');
      ponto.type = 'button';
      ponto.className = 'produtos__ponto';
      ponto.setAttribute('aria-label', 'Mostrar item ' + (indice + 1) + ' de ' + itens.length);
      ponto.addEventListener('click', () => {
        const recuo = parseFloat(window.getComputedStyle(lista).paddingLeft) || 0;
        lista.scrollTo({ left: item.offsetLeft - recuo, behavior: comportamentoRolagem() });
      });
      pontos.append(ponto);
      return ponto;
    });

    let agendado = false;
    function atualizarPontos() {
      agendado = false;
      const centro = lista.scrollLeft + lista.clientWidth / 2;
      let ativo = 0;
      let menorDistancia = Infinity;
      itens.forEach((item, indice) => {
        const distancia = Math.abs(item.offsetLeft + item.offsetWidth / 2 - centro);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          ativo = indice;
        }
      });
      botoesPontos.forEach((ponto, indice) => {
        ponto.classList.toggle('is-ativo', indice === ativo);
        ponto.setAttribute('aria-current', indice === ativo ? 'true' : 'false');
      });
    }

    lista.addEventListener('scroll', () => {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(atualizarPontos);
    }, { passive: true });
    window.addEventListener('resize', atualizarPontos);
    atualizarPontos();
  }

  function atualizarAno() {
    const ano = String(new Date().getFullYear());
    document.querySelectorAll('[data-ano]').forEach((el) => { el.textContent = ano; });
  }

  iniciarRevelar();
  window.fiosDaGi = true;
  iniciarNavbar();
  iniciarMenu();
  iniciarContatos();
  iniciarProdutos();
  atualizarAno();
})();

"use strict";

function inicializarMenu() {
  const menu=document.querySelector(".menu-mobile");
  if(!menu)return;
  const botao=menu.querySelector("summary");
  menu.querySelectorAll("a").forEach(link=>link.addEventListener("click", ()=> {
    menu.removeAttribute("open");const destino=document.querySelector(link.getAttribute("href"));if(destino) {
      destino.setAttribute("tabindex", "-1");destino.focus( {
        preventScroll:true
      }
      );
    }
  }
  ));
  document.addEventListener("click", e=> {
    if(!menu.contains(e.target))menu.removeAttribute("open");
  }
  );
  document.addEventListener("keydown", e=> {
    if(e.key==="Escape"&&menu.open) {
      menu.removeAttribute("open");botao.focus();
    }
  }
  );
}

function inicializarNavegacao() {
  if(!("IntersectionObserver" in window))return;
  const links=[...document.querySelectorAll('.menu-desktop a[href^="#"],.menu-mobile a[href^="#"],.contato-topo[href^="#"]')];
  const secoes=[...new Set(links.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean))];
  const visiveis=new Set();
  const obs=new IntersectionObserver(entradas=> {
    entradas.forEach(e=>e.isIntersecting?visiveis.add(e.target.id):visiveis.delete(e.target.id));const atual=secoes.find(s=>visiveis.has(s.id));links.forEach(a=>a.getAttribute("href")==`#${atual?.id}`?a.setAttribute("aria-current", "location"):a.removeAttribute("aria-current"));
  }
  ,  {
    rootMargin:"-35% 0px -55%"
  }
  );
  secoes.forEach(s=>obs.observe(s));
}

function inicializarTopo() {
  const link=document.querySelector(".voltar-topo");
  const atualizar=()=>link?.classList.toggle("voltar-topo--visivel", scrollY>innerHeight/2);
  addEventListener("scroll", atualizar,  {
    passive:true
  }
  );
  addEventListener("resize", atualizar);
  atualizar();
}

function atualizarAno() {
  const alvo=document.querySelector("[data-ano]");
  if(alvo)alvo.textContent=new Date().getFullYear();
}

function inicializarFormulario() {
  const form=document.querySelector("#form-contato");
  if(!form)return;
  const campos=[...form.querySelectorAll("input,select,textarea")], feedback=document.querySelector("#feedback-formulario"), rascunho=document.querySelector("#abrir-rascunho"), botao=form.querySelector('[type="submit"]');
  form.noValidate=true;
  botao.disabled=false;
  function validar(c) {
    let erro="", v=c.value.trim();
    if(!v)erro=c.tagName==="SELECT"?"Selecione um assunto.":"Preencha este campo; somente espaços não são aceitos.";
    else if(c.type==="email"&&c.validity.typeMismatch)erro="Informe um e-mail válido.";
    else if(!c.validity.valid)erro="Confira o valor informado.";
    const msg=document.querySelector(`#erro-${c.id}`);
    msg.textContent=erro;
    msg.hidden=!erro;
    c.setAttribute("aria-invalid", String(!!erro));
    return !erro;
  }
  campos.forEach(c=> {
    c.addEventListener("blur", ()=>validar(c));c.addEventListener("input", ()=> {
      rascunho.hidden=true;rascunho.removeAttribute("href");feedback.hidden=true;if(c.getAttribute("aria-invalid")==="true")validar(c);
    }
    );c.addEventListener("change", ()=> {
      if(c.getAttribute("aria-invalid")==="true")validar(c);
    }
    );
  }
  );
  form.addEventListener("submit", e=> {
    e.preventDefault();rascunho.hidden=true;rascunho.removeAttribute("href");const invalidos=campos.filter(c=>!validar(c));feedback.hidden=false;if(invalidos.length) {
      feedback.dataset.tipo="erro";feedback.textContent="Revise os campos indicados. Nenhuma mensagem foi enviada.";invalidos[0].focus();return;
    }
    const d=new FormData(form), nome=d.get("nome").trim(), email=d.get("email").trim(), assunto=d.get("assunto").trim(), mensagem=d.get("mensagem").trim();const corpo=[`Nome: ${nome}`, `E-mail: ${email}`, "", mensagem].join("\n");rascunho.href=`${form.action}?subject=${encodeURIComponent(`Contato pelo portfólio — $ {
      assunto
    }
    `)}&body=${encodeURIComponent(corpo)}`;rascunho.hidden=false;feedback.dataset.tipo="orientacao";feedback.textContent="Rascunho preparado. Nada foi enviado; abra o link para concluir o envio no seu aplicativo de e-mail.";
  }
  );
}

function inicializarProgresso() {
  const barra=document.querySelector("#progresso-leitura");
  if(!barra)return;
  function atualizar() {
    const h=document.documentElement.scrollHeight-innerHeight, p=h>0?Math.min(1, Math.max(0, scrollY/h)):0;
    barra.style.transform=`scaleX(${p})`;
  }
  addEventListener("scroll", atualizar,  {
    passive:true
  }
  );
  addEventListener("resize", atualizar);
  addEventListener("load", atualizar);
  atualizar();
  if("ResizeObserver"in window)new ResizeObserver(atualizar).observe(document.body);
}

function inicializarBusca() {
  const busca=document.querySelector("#busca-curso"), resultado=document.querySelector("#resultado-busca");
  if(!busca||!resultado)return;
  const cursos=[...document.querySelectorAll("#lista-cursos>li")], norm=t=>t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), textos=cursos.map(c=>norm(c.textContent));
  function filtrar() {
    let n=0, termo=norm(busca.value);
    cursos.forEach((c, i)=> {
      c.hidden=!textos[i].includes(termo);if(!c.hidden)n++;
    }
    );
    resultado.textContent=n?`${n} de ${cursos.length} cursos encontrados.`:"Nenhum curso encontrado.";
  }
  busca.addEventListener("input", filtrar);
  filtrar();
}

function inicializarBuscaProjetos() {
  const campo = document.querySelector("#busca-projeto");
  const resultado = document.querySelector("#resultado-projetos");
  const projetos = [...document.querySelectorAll("#lista-projetos > li")];

  if (!campo || !resultado || projetos.length === 0) return;

  const normalizar = (texto) => texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const textos = projetos.map((projeto) => normalizar(projeto.textContent));

  function filtrarProjetos() {
    const termo = normalizar(campo.value);
    let quantidade = 0;

    projetos.forEach((projeto, indice) => {
      projeto.hidden = !textos[indice].includes(termo);
      if (!projeto.hidden) quantidade++;
    });

    resultado.textContent = quantidade
      ? `${quantidade} de ${projetos.length} projetos encontrados.`
      : "Nenhum projeto encontrado. Tente outro termo.";
  }

  campo.addEventListener("input", filtrarProjetos);
  filtrarProjetos();
}

function inicializarModal() {
  const modal=document.querySelector("#detalhes-curso");
  if(!modal||typeof modal.showModal!=="function")return;
  const titulo=document.querySelector("#titulo-modal"), texto=document.querySelector("#texto-modal");
  let origem;
  document.querySelectorAll("#lista-cursos article").forEach(card=> {
    const h=card.querySelector("h4"), p=card.querySelector("p"), b=document.createElement("button");b.type="button";b.className="botao secundario detalhes";b.textContent="Ver detalhes";b.setAttribute("aria-haspopup", "dialog");b.addEventListener("click", ()=> {
      origem=b;titulo.textContent=h.textContent;texto.textContent=p.textContent;modal.showModal();
    }
    );card.append(b);
  }
  );
  modal.addEventListener("close", ()=>origem?.focus());
}

function inicializarContador() {
  const campo=document.querySelector("#mensagem"), alvo=document.querySelector("#contador-mensagem");
  if(!campo||!alvo)return;
  const atualizar=()=>alvo.textContent=`${campo.value.length} / ${campo.maxLength} caracteres`;
  campo.addEventListener("input", atualizar);
  atualizar();
}

function inicializarCopiarEmail() {
  const botao=document.querySelector("#copiar-email"), link=document.querySelector('.canais address a[aria-label="Enviar e-mail pelo Gmail"]'), feedback=document.querySelector("#feedback-copia");
  if(!botao||!link||!feedback)return;
  botao.addEventListener("click", async()=> {
    const email=link.textContent.trim().replace(/^✉\s*/, "");try {
      await navigator.clipboard.writeText(email);feedback.textContent="E-mail copiado.";
    }
    catch {
      feedback.textContent=`A cópia automática não está disponível. Selecione e copie: ${email}`;
    }
  }
  );
}

document.documentElement.classList.add("js");
inicializarMenu();
inicializarNavegacao();
inicializarTopo();
atualizarAno();
inicializarFormulario();
inicializarProgresso();
inicializarBusca();
inicializarBuscaProjetos();
inicializarModal();
inicializarContador();
inicializarCopiarEmail();



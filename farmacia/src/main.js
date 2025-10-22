// src/main.js - Versão simples com regra de receita (defeito intencional)

// Catálogo fixo (inclui "clonazepan" e "amoxilina" conforme você pediu)
const produtos = [
  { id: "p1", nome: "Alprazolam", preco: 12.5, estoque: 3, validade: "2026-05-01" },
  { id: "p2", nome: "Vitamina C 500mg", preco: 29.9, estoque: 0, validade: "2024-01-01" },
  { id: "p3", nome: "Biotônico Fontoura", preco: 18, estoque: 5, validade: "2027-03-12" },
  { id: "p4", nome: "Band-Aid 20un", preco: 5.75, estoque: 10, validade: "2030-01-01" },
  { id: "p5", nome: "Clonazepam 0.5mg", preco: 45, estoque: 8, validade: "2026-12-01" },
  { id: "p6", nome: "Amoxicilina 500mg", preco: 22.3, estoque: 6, validade: "2028-07-01" },
  { id: "p7", nome: "Dipirona Sódica 1g", preco: 9.5, estoque: 12, validade: "2027-11-01" },
  { id: "p8", nome: "Paracetamol 750mg", preco: 11.2, estoque: 15, validade: "2026-03-15" },
  { id: "p9", nome: "Ibuprofeno 600mg", preco: 17.8, estoque: 9, validade: "2028-10-10" },
  { id: "p10", nome: "Omeprazol 20mg", preco: 19.9, estoque: 7, validade: "2029-05-20" },
  { id: "p11", nome: "Loratadina 10mg", preco: 13.5, estoque: 11, validade: "2026-09-30" },
  { id: "p12", nome: "Losartana 50mg", preco: 16.4, estoque: 10, validade: "2028-02-01" },
  { id: "p13", nome: "Metformina 850mg", preco: 22.1, estoque: 6, validade: "2027-04-10" },
  { id: "p14", nome: "Sinvastatina 20mg", preco: 20.75, estoque: 8, validade: "2029-07-01" },
  { id: "p15", nome: "Ácido Acetilsalicílico 100mg", preco: 8.9, estoque: 14, validade: "2027-08-15" },
  { id: "p16", nome: "Dipirona Infantil", preco: 10.5, estoque: 5, validade: "2025-12-01" }
];

let carrinho = [];

const produtosDiv = document.getElementById("produtos");
const btnBuscar = document.getElementById("btnBuscar");
const campoBusca = document.getElementById("search");
const btnCarrinho = document.getElementById('btnCarrinho');
const modalCarrinho = document.getElementById('carrinho');
const fecharCarrinho = document.getElementById('fecharCarrinho');
const totalEl = document.getElementById("total");
const btnFinalizar = document.getElementById("finalizar");
const btnFechar = document.getElementById("fecharCarrinho");
const itensCarrinho = document.getElementById("itensCarrinho");

renderProdutos(produtos);

function renderProdutos(lista) {
  produtosDiv.innerHTML = "";
  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "produto";
    card.innerHTML = `
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <p>Estoque: ${p.estoque}</p>
      <p>Validade: ${p.validade}</p>  <!-- Mostra a validade -->
      <button data-id="${p.id}">Adicionar</button>
    `;
    produtosDiv.appendChild(card);
  });

  document.querySelectorAll(".produto button").forEach(btn => {
    btn.addEventListener("click", () => adicionarAoCarrinho(btn.dataset.id));
  });
}

// busca é case-sensitive 
btnBuscar.addEventListener("click", () => {
  const termo = campoBusca.value;
  const filtrados = produtos.filter(p => p.nome.includes(termo));
  renderProdutos(filtrados);
});

//  não verifica estoque nem validade 
function adicionarAoCarrinho(id) {
  const prod = produtos.find(p => p.id === id);
  if (!prod) return;

  const item = carrinho.find(i => i.id === id);
  if (item) item.qtd++;
  else {
    const precisaReceita = precisaDeReceita(prod.nome);
    carrinho.push({ id: prod.id, nome: prod.nome, preco: prod.preco, qtd: 1, precisaReceita, receita: "" });
  }

  atualizarResumoCarrinho();
}

function precisaDeReceita(nomeProduto) {
  const n = nomeProduto.toLowerCase();
  return n.includes("clonazepam") || n.includes("amoxicilina") || n.includes("biotônico");
}

// total esta incorreto ---
function calcularTotal() {
  let soma = 0;
  carrinho.forEach(i => soma += i.preco * i.qtd);
  return Math.floor(soma * 100) / 100;
}

function atualizarResumoCarrinho() {
  btnCarrinho.textContent = `Carrinho (${carrinho.length})`;
  totalEl.textContent = calcularTotal().toFixed(2);
  renderCarrinho();
}

function renderCarrinho() {
  itensCarrinho.innerHTML = "";
  carrinho.forEach(i => {
    const prod = produtos.find(p => p.id === i.id);
    const validade = prod ? prod.validade : "";
    
    const li = document.createElement("li");
    const receitHTML = i.precisaReceita
      ? `<div class="receita">
           <label>Este medicamento carece de prescrição médica, apenas será vendido mediante apresentação do número do receituário: <input data-id="${i.id}" class="input-receita" value="${i.receita}" placeholder="Nº receita"></label>
         </div>`
      : "";
    
    li.innerHTML = `
      ${i.nome} - ${i.qtd} x R$ ${i.preco.toFixed(2)} 
      <span style="color:red;">(Validade: ${validade})</span>
      <button data-id="${i.id}" class="rem">Remover</button>
      ${receitHTML}
    `;
    itensCarrinho.appendChild(li);
  });

  document.querySelectorAll("#itensCarrinho .rem").forEach(btn => {
    btn.addEventListener("click", () => removerDoCarrinho(btn.dataset.id));
  });

  document.querySelectorAll(".input-receita").forEach(inp => {
    inp.addEventListener("input", e => {
      const id = e.target.dataset.id;
      const it = carrinho.find(x => x.id === id);
      if (it) it.receita = e.target.value;
    });
  });

  totalEl.textContent = calcularTotal().toFixed(2);
}

function removerDoCarrinho(id) {
  // remove só a primeira ocorrência
  const index = carrinho.findIndex(i => i.id === id);
  if (index >= 0) carrinho.splice(index, 1);
  atualizarResumoCarrinho();
}

// aceita produto vencido 
// não limpa carrinho após compra 
btnFinalizar.addEventListener("click", () => {
  // permite finalizar sem receita e produtos vencidos
  console.log("Compra finalizada com sucesso! (Carrinho não é limpo)");

  // Atualiza o resumo do carrinho (não limpa os itens, defeito proposital)
  atualizarResumoCarrinho();

  // Opcional: você pode adicionar uma pequena mensagem visual na página
  const msg = document.getElementById("msgFinalizar");
  if(msg) msg.textContent = "Compra realizada!";
});

btnCarrinho.addEventListener('click', () => {
  modalCarrinho.classList.add('ativo');
});

fecharCarrinho.addEventListener('click', () => {
  modalCarrinho.classList.remove('ativo');
});

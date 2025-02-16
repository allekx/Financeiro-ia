// Selecionando elementos do DOM
const form = document.getElementById("finance-form");
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const tipoInput = document.getElementById("tipo");
const listaTransacoes = document.getElementById("lista-transacoes");
const saldoElemento = document.getElementById("saldo");

// Array para armazenar as transações
let transacoes = [];

// Função para adicionar uma transação
function adicionarTransacao(event) {
    event.preventDefault();

    const descricao = descricaoInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const tipo = tipoInput.value;

    if (descricao === "" || isNaN(valor) || valor <= 0) {
        alert("Por favor, preencha os campos corretamente.");
        return;
    }

    const transacao = { descricao, valor, tipo };
    transacoes.push(transacao);

    atualizarLista();
    atualizarSaldo();
    salvarNoLocalStorage();

    form.reset();
}

// Função para atualizar a lista de transações na tela
function atualizarLista() {
    listaTransacoes.innerHTML = "";
    transacoes.forEach((transacao, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${transacao.descricao}</td>
            <td>R$ ${transacao.valor.toFixed(2)}</td>
            <td class="${transacao.tipo}">${transacao.tipo === "entrada" ? "Entrada" : "Saída"}</td>
            <td><button onclick="removerTransacao(${index})">X</button></td>
        `;

        listaTransacoes.appendChild(linha);
    });
}

// Função para atualizar o saldo
function atualizarSaldo() {
    const total = transacoes.reduce((acc, transacao) => {
        return transacao.tipo === "entrada" ? acc + transacao.valor : acc - transacao.valor;
    }, 0);

    saldoElemento.textContent = total.toFixed(2);
}

// Função para remover uma transação
function removerTransacao(index) {
    transacoes.splice(index, 1);
    atualizarLista();
    atualizarSaldo();
    salvarNoLocalStorage();
}

// Função para salvar no LocalStorage
function salvarNoLocalStorage() {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Função para carregar do LocalStorage ao iniciar
function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem("transacoes");
    if (dadosSalvos) {
        transacoes = JSON.parse(dadosSalvos);
        atualizarLista();
        atualizarSaldo();
    }
}

// Evento de submit do formulário
form.addEventListener("submit", adicionarTransacao);

// Carregar transações salvas ao iniciar a página
carregarDoLocalStorage();


// Seleciona o elemento do gráfico
const ctx = document.getElementById("grafico-financeiro").getContext("2d");

// Cria o gráfico
let graficoFinanceiro = new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: ["Entradas", "Saídas"],
        datasets: [{
            data: [0, 0], // Valores iniciais
            backgroundColor: ["#4CAF50", "#FF5733"]
        }]
    },
    options: {
        responsive: true
    }
});

// Função para atualizar o gráfico
function atualizarGrafico() {
    let totalEntradas = transacoes
        .filter(t => t.tipo === "entrada")
        .reduce((acc, t) => acc + t.valor, 0);

    let totalSaidas = transacoes
        .filter(t => t.tipo === "saida")
        .reduce((acc, t) => acc + t.valor, 0);

    graficoFinanceiro.data.datasets[0].data = [totalEntradas, totalSaidas];
    graficoFinanceiro.update();
}

// Modificar as funções para chamar o gráfico sempre que os dados forem alterados
function adicionarTransacao(event) {
    event.preventDefault();

    const descricao = descricaoInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const tipo = tipoInput.value;

    if (descricao === "" || isNaN(valor) || valor <= 0) {
        alert("Por favor, preencha os campos corretamente.");
        return;
    }

    const transacao = { descricao, valor, tipo };
    transacoes.push(transacao);

    atualizarLista();
    atualizarSaldo();
    atualizarGrafico(); // Atualiza o gráfico
    salvarNoLocalStorage();

    form.reset();
}

function removerTransacao(index) {
    transacoes.splice(index, 1);
    atualizarLista();
    atualizarSaldo();
    atualizarGrafico(); // Atualiza o gráfico
    salvarNoLocalStorage();
}

// Atualiza o gráfico ao carregar as transações salvas
carregarDoLocalStorage();
atualizarGrafico();

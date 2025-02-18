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
    const categoria = document.getElementById("categoria").value;

    if (descricao === "" || isNaN(valor) || valor <= 0) {
        alert("Por favor, preencha os campos corretamente.");
        return;
    }

    const transacao = { descricao, valor, tipo, categoria };
    transacoes.push(transacao);

    atualizarLista();
    atualizarSaldo();
    atualizarMeta();
    atualizarGrafico();
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
            <td>${transacao.categoria}</td>
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




// Selecionando os elementos dos filtros
const filtroTipo = document.getElementById("filtro-tipo");
const filtroDataInicial = document.getElementById("filtro-data-inicial");
const filtroDataFinal = document.getElementById("filtro-data-final");
const btnFiltrar = document.getElementById("btn-filtrar");

// Função para atualizar a lista de transações com filtros
function atualizarListaFiltrada() {
    let transacoesFiltradas = transacoes;

    // Filtro por tipo (entrada/saída)
    if (filtroTipo.value !== "todos") {
        transacoesFiltradas = transacoesFiltradas.filter(t => t.tipo === filtroTipo.value);
    }

    // Filtro por data
    const dataInicial = filtroDataInicial.value ? new Date(filtroDataInicial.value) : null;
    const dataFinal = filtroDataFinal.value ? new Date(filtroDataFinal.value) : null;

    transacoesFiltradas = transacoesFiltradas.filter(t => {
        const dataTransacao = new Date(t.data || "2024-01-01"); // Se não tiver data, usa uma padrão
        return (!dataInicial || dataTransacao >= dataInicial) && (!dataFinal || dataTransacao <= dataFinal);
    });

    // Atualiza a exibição das transações filtradas
    listaTransacoes.innerHTML = "";
    transacoesFiltradas.forEach((transacao, index) => {
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




// Evento de clique para aplicar o filtro
btnFiltrar.addEventListener("click", atualizarListaFiltrada);





// Selecionando os elementos da meta
const inputMeta = document.getElementById("valor-meta");
const btnDefinirMeta = document.getElementById("btn-definir-meta");
const progressoMeta = document.getElementById("progresso-meta");
const metaTotal = document.getElementById("meta-total");
const barraProgresso = document.getElementById("barra-progresso");

// Carregar meta salva no LocalStorage
let metaEconomia = localStorage.getItem("metaEconomia") ? parseFloat(localStorage.getItem("metaEconomia")) : 0;
metaTotal.textContent = metaEconomia.toFixed(2);

// Função para atualizar o progresso da meta
function atualizarMeta() {
    let totalEntradas = transacoes
        .filter(t => t.tipo === "entrada")
        .reduce((acc, t) => acc + t.valor, 0);

    progressoMeta.textContent = totalEntradas.toFixed(2);

    let progresso = metaEconomia > 0 ? (totalEntradas / metaEconomia) * 100 : 0;
    progresso = progresso > 100 ? 100 : progresso; // Limita o progresso a 100%
    
    barraProgresso.style.width = `${progresso}%`;
}

// Função para definir uma nova meta
btnDefinirMeta.addEventListener("click", () => {
    const novaMeta = parseFloat(inputMeta.value);
    if (isNaN(novaMeta) || novaMeta <= 0) {
        alert("Por favor, insira um valor válido para a meta.");
        return;
    }

    metaEconomia = novaMeta;
    localStorage.setItem("metaEconomia", metaEconomia);
    metaTotal.textContent = metaEconomia.toFixed(2);
    atualizarMeta();
});

// Atualizar a meta sempre que os dados mudam
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
    atualizarMeta(); // Atualiza o progresso da meta
    atualizarGrafico();
    salvarNoLocalStorage();

    form.reset();
}

function removerTransacao(index) {
    transacoes.splice(index, 1);
    atualizarLista();
    atualizarSaldo();
    atualizarMeta(); // Atualiza o progresso da meta
    atualizarGrafico();
    salvarNoLocalStorage();
}

// Atualizar a meta ao carregar os dados salvos
carregarDoLocalStorage();
atualizarMeta();

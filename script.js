// Espera o documento HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', function() {

    // 1. Seleciona os elementos do formulário que vamos manipular
    const form = document.getElementById('address-form');
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const numeroInput = document.getElementById('numero');
    const complementoInput = document.getElementById('complemento');
    const ufInput = document.getElementById('uf');

    // --- FUNÇÕES DE MÁSCARA E FORMATAÇÃO ---

    cepInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }
        e.target.value = value;
    });

    ufInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.toUpperCase();
    });

    // --- NOVA FUNCIONALIDADE: BUSCA DE ENDEREÇO PELA API ---

    // Função assíncrona que busca o endereço na API ViaCEP
    const buscaEndereco = async () => {
        // Limpa os campos antes de uma nova busca para não deixar dados antigos
        logradouroInput.value = "";
        complementoInput.value = "";
        ufInput.value = "";

        // Pega o valor do CEP e remove o hífen para enviar à API
        const cep = cepInput.value.replace('-', '');

        // Validação: Se o CEP não tiver 8 dígitos, a função para aqui.
        if (cep.length !== 8) {
            return;
        }

        // Monta a URL da API para a requisição
        const url = `https://viacep.com.br/ws/${cep}/json/`;

        try {
            // 'fetch' faz a chamada para a URL. 'await' pausa a função até a resposta chegar.
            const response = await fetch(url);
            // 'await' pausa de novo para converter a resposta para o formato JSON.
            const data = await response.json();

            // Verifica se a API retornou um erro (acontece para CEPs que não existem)
            if (data.erro) {
                alert("CEP não encontrado. Por favor, verifique o número digitado.");
                return;
            }

            // Preenche os campos do formulário com os dados da API
            logradouroInput.value = data.logradouro;
            complementoInput.value = data.complemento;
            ufInput.value = data.uf;

            // Move o cursor (foco) do usuário para o campo "Número", que é o próximo passo lógico.
            numeroInput.focus();

        } catch (error) {
            // Se houver qualquer erro de rede (ex: sem internet), ele será capturado aqui.
            alert("Não foi possível buscar o CEP. Verifique sua conexão com a internet.");
            console.error("Erro ao buscar CEP:", error);
        }
    };

    // Adiciona o "ouvinte" ao campo CEP. A função buscaEndereco será chamada quando o usuário sair do campo ('blur').
    cepInput.addEventListener('blur', buscaEndereco);


    // --- VALIDAÇÃO DO FORMULÁRIO NO ENVIO (código da primeira parte) ---

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const cepPattern = /^\d{5}-\d{3}$/;
        if (!cepPattern.test(cepInput.value)) {
            alert("Erro: CEP inválido! O formato deve ser 00000-000.");
            return;
        }

        if (logradouroInput.value.trim().length < 5) {
            alert("Erro: O Logradouro deve ter no mínimo 5 caracteres.");
            return;
        }

        const numeroPattern = /^\d+$/;
        if (!numeroPattern.test(numeroInput.value)) {
            alert("Erro: O campo Número deve conter apenas dígitos.");
            return;
        }

        const ufPattern = /^[A-Z]{2}$/;
        if (!ufPattern.test(ufInput.value)) {
            alert("Erro: O campo UF deve conter exatamente 2 letras maiúsculas (ex: SP).");
            return;
        }

        alert("Endereço cadastrado com sucesso");
    });
});
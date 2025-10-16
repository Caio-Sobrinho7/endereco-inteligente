// Espera o documento HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', function() {

    // 1. Seleciona os elementos do formulário que vamos manipular
    const form = document.getElementById('address-form');
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const numeroInput = document.getElementById('numero');
    const ufInput = document.getElementById('uf');

    // 2. Adiciona um "ouvinte" para o evento de digitação no campo CEP para criar a máscara
    cepInput.addEventListener('input', function (e) {
        // Remove qualquer caractere que não seja número
        let value = e.target.value.replace(/\D/g, '');
        // Aplica a máscara 00000-000
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }
        e.target.value = value;
    });

    // 3. Adiciona um "ouvinte" para o evento de digitação no campo UF para converter para maiúsculo
    ufInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.toUpperCase();
    });

    // 4. Adiciona um "ouvinte" para o evento de SUBMIT do formulário
    form.addEventListener('submit', function(e) {
        // Impede o comportamento padrão do formulário, que é recarregar a página
        e.preventDefault();

        // --- VALIDAÇÕES ---

        // Validação do CEP usando Regex
        // ^\d{5}  -> Inicia com 5 dígitos
        // -\d{3}$ -> Termina com um hífen e 3 dígitos
        const cepPattern = /^\d{5}-\d{3}$/;
        if (!cepPattern.test(cepInput.value)) {
            alert("Erro: CEP inválido! O formato deve ser 00000-000.");
            return; // Para a execução se o campo for inválido
        }
        
        // Validação do Logradouro
        // .trim() remove espaços em branco do início e do fim
        if (logradouroInput.value.trim().length < 5) {
            alert("Erro: O Logradouro deve ter no mínimo 5 caracteres.");
            return;
        }

        // Validação do Número
        // ^\d+$ -> Deve conter apenas um ou mais dígitos numéricos do início ao fim
        const numeroPattern = /^\d+$/;
        if (!numeroPattern.test(numeroInput.value)) {
            alert("Erro: O campo Número deve conter apenas dígitos.");
            return;
        }

        // Validação da UF
        // ^[A-Z]{2}$ -> Deve conter exatamente 2 letras maiúsculas
        const ufPattern = /^[A-Z]{2}$/;
        if (!ufPattern.test(ufInput.value)) {
            alert("Erro: O campo UF deve conter exatamente 2 letras maiúsculas (ex: SP).");
            return;
        }

        // Se todas as validações passaram, exibe a mensagem de sucesso
        alert("Endereço cadastrado com sucesso");
    });
});
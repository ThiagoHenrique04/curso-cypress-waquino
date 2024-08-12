const locators = {
    LOGIN:{
        USER: '[data-test="email"]',
        PASSWORD: '[data-test="passwd"]',
        BTN: '.btn'
    },

    MENU:{
        SETTINGS: '[data-test="menu-settings"]',
        HOME: '[data-test="menu-home"] > .fas',
        CONTAS: '[href="/contas"]',
        RESET: '[href="/reset"]',
        MOVIMENTACAO: '[data-test="menu-movimentacao"]',
        LOGOUT: '[href="/logout"]',
        EXTRATO: '[data-test="menu-extrato"]',
    },

    CONTAS:{
        NOME: '[data-test="nome"]',
        BTN_SALVAR: '.btn',
        FN_XP_BTN_ALTERAR: nome => `//table//td[contains(., '${nome}')]/..//i[@class='far fa-edit']`,
    },

    MOVIMENTACAO: {
        DESCRICAO: '[data-test="descricao"]',
        VALOR: '[data-test="valor"]',
        CONTA: '[data-test="conta"]',
        INTERESSADO: '[data-test="envolvido"]',
        BTN_SALVAR: '.btn-primary',
        STATUS: '[data-test="status"]',
        DESPESA: '[data-test="tipo-despesa"]',
    },

    EXTRATO: {
        FN_XP_LINHA: desc => `//span[contains(., '${desc}')]/../../../..`,
        LINHAS:'.list-group > li',
        FN_XP_BUSCA:(desc,value) => `//span[contains(., '${desc}')]/following-sibling::small[contains(., '${value}')]`,
        TABELA: '.list-group > li',    
        FN_REMOVER_EXTRATO: conta => `//span[contains(., '${conta}')]/../../..//i[@class='far fa-trash-alt']`,
        FN_ALTERAR_EXTRATO: conta => `//span[contains(., '${conta}')]/../../..//i[@class='fas fa-edit']`,
    },
    SALDO: {
        FN_XP_SALDO_CONTA: nome => `//td[contains(., '${nome}')]/../td[2]`,
    },
    MESSAGE: '.toast-message',
}

export default locators;
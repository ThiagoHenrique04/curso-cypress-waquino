/// <reference types="cypress" />

import loc from '../../support/locators'
import "../../support/commandsContas"
import "../../support/commandsMovimentacao"


describe('Should test at a functional level', () => {

    before('resetar site antes de executar os cenarios', () => {
        cy.login('thiago.gomes@teste.com', 'thiago123'); 
        }); 

    beforeEach('Executar a cada cenario', () => {
        cy.get(loc.MENU.HOME).click()
        cy.resetApp();
    })    
    after('Executar logout após executar os cenarios', () => {
        cy.logout();
    })

        it('should create an account', () => {       
            cy.acessarMenuConta()
            cy.inserirConta('Conta de teste')
            cy.get(loc.MESSAGE).should('contain', 'inserida com sucesso')
        })

        it('Should update an account', () => {
            cy.acessarMenuConta()
            cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Conta para alterar')).click()
            cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta Alterada')
            cy.get(loc.CONTAS.BTN_SALVAR).click()
            cy.get(loc.MESSAGE).should('contain', 'atualizada com sucesso')
        })
    
        it('Should not create an account with same name', () => {
            cy.acessarMenuConta()
            cy.get(loc.CONTAS.NOME).type('Conta mesmo nome')
            cy.get(loc.CONTAS.BTN_SALVAR).click()
            cy.get(loc.MESSAGE).should('contain', 'code 400')
        })
    
        it('Should create a transaction', () => {
            cy.addMovimentacao('Teste Add Movimentação', '200', 'Teste', 'Conta para movimentacoes')
            cy.get(loc.MESSAGE).should('contain', 'sucesso')
            cy.get(loc.EXTRATO.TABELA).should('have.length', 7)
    })

        it('Should get balance', () => {
            cy.get(loc.MENU.HOME).click()
            cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00')

            cy.get(loc.MENU.EXTRATO).click()
            cy.xpath(loc.EXTRATO.FN_ALTERAR_EXTRATO('Movimentacao 1, calculo saldo')).click()
            cy.wait(2000)
            cy.get(loc.MOVIMENTACAO.STATUS).click()
            cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
            
            cy.get(loc.MENU.EXTRATO).click() //Foi necessario voltar para page de extrato para atualizar os dados da home
            cy.get(loc.MENU.HOME).click() 
            cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')

        })

        it('Should remove a trasaction', () => {
            cy.get(loc.MENU.EXTRATO).click()
            cy.xpath(loc.EXTRATO.FN_REMOVER_EXTRATO('Movimentacao para exclusao')).click()
            cy.get(loc.MESSAGE).should('contain', 'sucesso')

        })
})


/// <reference types="cypress" />

import loc from './locators'

Cypress.Commands.add('acessarMenuConta', () => {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.CONTAS).click()
})

Cypress.Commands.add('inserirConta', conta => {
    cy.get(loc.CONTAS.NOME).type(conta)
    cy.wait(3000) //Wait adicionado para que as toats messages saiam da tela
    cy.get(loc.CONTAS.BTN_SALVAR).click()
})
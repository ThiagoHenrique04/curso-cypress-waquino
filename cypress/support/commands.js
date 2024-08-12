require('cypress-xpath')

import loc from './locators'

/// comandos testes de WEB

Cypress.Commands.add('login', (user, password) => {
    cy.visit('https://barrigareact.wcaquino.me/')
    cy.get(loc.LOGIN.USER).type(user)
    cy.get(loc.LOGIN.PASSWORD).type(password)
    cy.get(loc.LOGIN.BTN).click()
    cy.get(loc.MESSAGE).should('contain', 'Bem vindo')
})

Cypress.Commands.add('resetApp', () => {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.RESET).click()

})

Cypress.Commands.add('logout', () => {
    
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.LOGOUT).click()

})

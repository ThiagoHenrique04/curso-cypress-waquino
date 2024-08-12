/// <reference types="cypress" />
const dayjs = require('dayjs')

import "../../support/commandsApi"

describe('Should test at a API level', () => {

    before('resetar site antes de executar os cenarios', () => {
        cy.getToken('thiago.gomes@teste.com', 'thiago123') }); 

    beforeEach('Executar a cada cenario', () => {
        cy.resetRest()
    })    
    
    
    it('should create an account', () => {       
        cy.request({
                url: '/contas',
                method: 'POST',
                //headers: { Authorization: `JWT ${token}`},
                body: {
                    nome: 'conta teste API'
                }
            }).as('response')
       
       cy.get('@response').then(res => {
        expect(res.status).to.be.equal(201)
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('nome', 'conta teste API')
       })
    })
    

    it('Should update an account', () => {
        cy.request({
            method: 'GET',
            url: '/contas',
            //headers: { Authorization: `JWT ${token}` },
            qs: {
                nome: 'Conta para alterar'
            }
        }).then(res => {
            cy.request({
            url: `/contas/${res.body[0].id}`,
            method: 'PUT',
            //headers: { Authorization: `JWT ${token}` },   
            body: {
                nome: 'Conta alterada via REST'
            }
            }).as('response')
         })
            cy.get('@response').its('status').should('be.equal', 200)
 })
    
    it('Should not create an account with same name', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
            //headers: { Authorization: `JWT ${token}`},
            body: {
            nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
            }).as('response')
    
        cy.get('@response').then(res => {
            console.log(res);
            expect(res.status).to.be.equal(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
            })
})
    it('Should create a transaction', () => {
        cy.getContaPorNome('Conta para movimentacoes')
        .then(contaId => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                //headers: { Authorization: `JWT ${token}`},
                body: {
                    conta_id: contaId,
                    data_pagamento: dayjs().add(1, "day").format('DD/MM/YYYY'), 
                    data_transacao: dayjs().format('DD/MM/YYYY'),
                    descricao: "desc",
                    envolvido: "interessado",
                    status: true,
                    tipo: "REC",
                    valor: "123",
                }
    
               }).as('response')
        })
        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    })

    it('Should get balance', () => {
          cy.getSaldo('534.00')
          cy.getMovimentacao('Movimentacao 1, calculo saldo')
          .then(res => {
            cy.request({
            url: `/transacoes/${res.body[0].id}`,
            method: 'PUT',
            //headers: { Authorization: `JWT ${token}` },
            body: {
                    data_pagamento: dayjs(res.body[0].data_pagamento).format('DD/MM/YYYY'), 
                    data_transacao: dayjs(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    descricao: res.body[0].descricao,
                    envolvido: res.body[0].envolvido,
                    status: true,
                    valor: res.body[0].valor,
                    conta_id: res.body[0].conta_id,
            }
            }).its('status').should('be.equal', 200)
          })
          cy.getSaldo('4034.00')
    })

    it('Should remove a trasaction', () => {
        cy.getMovimentacao('Movimentacao para exclusao')
        .then(res => {
            cy.request({
                url: `/transacoes/${res.body[0].id}`,
                method: 'DELETE',
                //headers: { Authorization: `JWT ${token}`},
            }).its('status').should('be.equal', 204)
        })       
    })
})


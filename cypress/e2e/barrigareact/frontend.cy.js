/// <reference types="cypress"/>

import loc from '../../support/locators'
import '../../support/commandsContas'
import buildEnv from '../../support/buildEnv.js'

describe('Should test at a interface level', () => {
    after(() => {
        cy.clearLocalStorage()
    })
    beforeEach(() => {
        cy.clearLocalStorage()
        buildEnv()
        cy.login('thiago.gomes@teste.com', 'senhaerrada'); 
        cy.get(loc.MENU.HOME).click()
        //cy.resetApp()

    })

    it('should create an account', () => {
        cy.intercept('POST', 
            '/contas', 
        {body: { id: 3, nome: "Conta de teste", visivel: true, usuario_id: 1 }
        }).as('saveConta')
        cy.acessarMenuConta()
        cy.intercept(
            'GET', 
            '/contas', 
            {body: 
            [
                { id: 1, nome: "Carteira", visivel: true, usuario_id: 1 },
                { id: 2, nome: "Banco", visivel: true, usuario_id: 1 },
                { id: 3, nome: "Conta de Teste", visivel: true, usuario_id: 1 },
            ]
        }).as('contasSave')  
        cy.inserirConta("Conta de teste")
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })
    

    it('should update an account', () => {
        cy.intercept(
            'GET', 
            '/contas', 
            {body: 
            [
                { id: 1, nome: "Carteira", visivel: true, usuario_id: 1 },
                { id: 2, nome: "Banco", visivel: true, usuario_id: 1 },
                { id: 3, nome: "Conta de Teste", visivel: true, usuario_id: 1 },
            ]
        }).as('Contas')
        cy.intercept(
            'PUT', 
            '/contas/**', 
            {body: 
            [
                { id: 1, nome: "Conta alterada", visivel: true, usuario_id: 1 },
            ]
        })
        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Banco')).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')

    })

    it('should not create an account with same name', () => {
        cy.intercept(
            'POST',
            '/contas',
        {
            statusCode: 400,
            body: { "error": "Já existe uma conta com esse nome!" },
        }).as('saveContaMesmoNome')

        cy.acessarMenuConta()
        cy.inserirConta('Conta mesmo nome')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', '400')
    })


    it('Should create a transaction', () => {
        cy.intercept(
            'POST',
            '/transacoes',
            {
            body: { id: 436482, descricao: "desc", envolvido: "desc", observacao: null, tipo: "REC", data_transacao: "2024-09-15T03:00:00.000Z", data_pagamento: "2024-09-15T03:00:00.000Z", valor: "150.00", status: false, conta_id: 472535, usuario_id: 13508, transferencia_id: null, parcelamento_id: null }
    })
        cy.intercept(
            'GET',
            '/extrato/**',
            {
            fixture: 'movementAccount'
    })
        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Description')
        cy.get(loc.MOVIMENTACAO.VALOR).type('20')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('desc')
        cy.get(loc.MOVIMENTACAO.CONTA).select('carteira')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()

        cy.get(loc.MESSAGE).should('contain', 'sucesso')
        cy.get(loc.EXTRATO.LINHAS).should('have.length', 6)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA('Description', '20')).should('exist')
    })

    it('should get balance', () => {
        cy.intercept(
         'GET',
         '/transacoes/**',
        {body: {
             "conta": "Conta para saldo",
             "id": 435281,
              "descricao": "Movimentacao 1, calculo saldo",
             "envolvido": "CCC", 
             "observacao": null,
             "tipo": "REC", 
             "data_transacao": "2024-08-14T03:00:00.000Z",
             "data_pagamento": "2024-08-15T03:00:00.000Z",
             "valor": "3500.00", 
             "status": true,
             "conta_id": 472524, 
             "usuario_id": 13508,
             "transferencia_id": null,
              "parcelamento_id": null
         }
      })
      cy.intercept(
         'PUT',
         '/transacoes/**',
        {response: {
             "conta": "Conta para saldo",
             "id": 435281,
              "descricao": "Movimentacao 1, calculo saldo",
             "envolvido": "CCC", 
             "observacao": null,
             "tipo": "REC", 
             "data_transacao": "2024-08-14T03:00:00.000Z",
             "data_pagamento": "2024-08-15T03:00:00.000Z",
             "valor": "3500.00", 
             "status": true,
             "conta_id": 472524, 
             "usuario_id": 13508,
             "transferencia_id": null,
              "parcelamento_id": null
         }
      })
         cy.get(loc.MENU.HOME).click()
         cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034')
         cy.get(loc.MENU.EXTRATO).click()
         
         cy.xpath(loc.EXTRATO.FN_ALTERAR_EXTRATO('Movimentacao 1, calculo saldo')).click()
         cy.wait(3000)
         cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value','Movimentacao 1, calculo saldo')
         cy.get(loc.MOVIMENTACAO.STATUS).click()
         cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
         cy.get(loc.MESSAGE).should('contain', 'sucesso')
 
         cy.get(loc.MENU.HOME).click()
         cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')
     })
 
    it('should remove a transaction', () => {
        cy.intercept(
            'DELETE',
            '/transacoes/**',{
            body:{},
            status:204}
        ).as('del')
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_REMOVER_EXTRATO('Description')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
    })

    it('Should validate data send to create an account', () => {
        cy.intercept('POST', '/contas', (req) => {
            console.log('Request:', req);
            expect(req.body.nome).to.be.empty;
            expect(req.headers).to.have.property('authorization');
            req.reply({ 
                statusCode: 200, 
                body: { id: 3, nome: 'Conta de Teste Wagner', visivel: true, usuario_id: 1}
            });
        }).as('saveConta');
    
        cy.intercept('GET', '/contas', {
            body: [
                { "id": 1, "nome": "carteira", "visivel": true, "usuario_id": 1 },
                { "id": 2, "nome": "Conta para alterar", "visivel": true, "usuario_id": 1 },
                { "id": 3, "nome": "Conta mesmo nome", "visivel": true, "usuario_id": 1 },
                { "id": 3, "nome": "Conta de Teste", "visivel": true, "usuario_id": 1 }
            ]
        }).as('contasSave');
    
        cy.acessarMenuConta();
        cy.inserirConta('{CONTROL}');
    
        cy.wait('@saveConta').then((interception) => {
            expect(interception.request.body.nome).to.be.empty;
            expect(interception.request.headers).to.have.property('authorization');
        });
    
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
    });
    
    it('Should verify colors', () => {
        cy.intercept(
            'get',
            '/extrato/**',{
            body: [
    {"conta":"carteira","id":436482,"descricao":"Description","envolvido":"desc","observacao":null,"tipo":"REC","data_transacao":"2021-03-15T03:00:00.000Z","data_pagamento":"2021-03-15T03:00:00.000Z","valor":"20.00","status":false,"conta_id":472535,"usuario_id":13508,"transferencia_id":null,"parcelamento_id":null},
    {"conta":"Conta com movimentacao","id":435280,"descricao":"Movimentacao de conta","envolvido":"BBB","observacao":null,"tipo":"REC","data_transacao":"2021-03-14T03:00:00.000Z","data_pagamento":"2021-03-14T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":472523,"usuario_id":13508,"transferencia_id":null,"parcelamento_id":null},
    {"conta":"Conta para saldo","id":435281,"descricao":"Movimentacao 1, calculo saldo","envolvido":"CCC","observacao":null,"tipo":"DESP","data_transacao":"2021-03-14T03:00:00.000Z","data_pagamento":"2021-03-14T03:00:00.000Z","valor":"3500.00","status":false,"conta_id":472524,"usuario_id":13508,"transferencia_id":null,"parcelamento_id":null},
    {"conta":"Conta para saldo","id":435282,"descricao":"Movimentacao 2, calculo saldo","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2021-03-14T03:00:00.000Z","data_pagamento":"2021-03-14T03:00:00.000Z","valor":"-1000.00","status":true,"conta_id":472524,"usuario_id":13508,"transferencia_id":null,"parcelamento_id":null},
    ]

        })    
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Description')).should('have.class','receitaPendente')
        //verificação de classe, de acordo com a classe a cor é alterada
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Movimentacao de conta')).should('have.class','receitaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Movimentacao 1, calculo saldo')).should('have.class','despesaPendente')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Movimentacao 2, calculo saldo')).should('have.class','despesaPaga')
    });

    it('should be responsive', () => {
        cy.get('[data-test=menu-home]').should('exist').and('be.visible')
        cy.viewport(500,700)
        cy.get('[data-test=menu-home]').should('exist').and('not.be.visible')
        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]').should('exist').and('not.be.visible')
        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist').and('be.visible')
    });
})


Cypress.Commands.add('getToken', (user, passwd) => {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user,
            redirecionar: false,
            senha: passwd
        }
    }).its('body.token').should('not.be.empty')
    .then(token => {
        Cypress.env('token', token)
        return token
    })
})

Cypress.Commands.add('resetRest', () => {
    cy.getToken('thiago.gomes@teste.com', 'thiago123').then(token => {
    cy.request({
        method: 'GET',
        url: '/reset',
        //headers: { Authorization: `JWT ${token}`}
    }).its('status').should('be.equal', 200)
  })
})

Cypress.Commands.add('getContaPorNome', nome =>{
    cy.getToken('thiago.gomes@teste.com', 'thiago123').then(token => {
    cy.request({
        method: 'GET',
        url: '/contas',
        //headers: { Authorization: `JWT ${token}` },
        qs: {
            nome: nome
        }
    }).then(res => {
        return res.body[0].id
    })
    })
})

Cypress.Commands.add('getSaldo', (saldo) => {
    cy.getToken('thiago.gomes@teste.com', 'thiago123').then(token => {
    cy.request({
        url: '/saldo',
        method: 'GET',
        //headers: { Authorization: `JWT ${token}` },
      }).then(res => {
        let saldoConta = null
        res.body.forEach(c => {
            if(c.conta === 'Conta para saldo') saldoConta = c.saldo
        })
        expect(saldoConta).to.be.equal(saldo)
      })
    })
})

Cypress.Commands.add('getMovimentacao', (nome) => {
    cy.getToken('thiago.gomes@teste.com', 'thiago123').then(token => {
        cy.request({
            method: 'GET',
            url: '/transacoes',
            //headers: { Authorization: `JWT ${token}` },
            qs: { descricao: nome}
          })
    })
})

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
  if(options.length === 1){
    if (Cypress.env('token')) {
        options[0].headers = {
            Authorization: `JWT ${Cypress.env('token')}`
        }
    }
  }
  return originalFn(...options)
})
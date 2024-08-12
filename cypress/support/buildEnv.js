const buildEnv = () => {

    // Intercepting the POST request to /signin
    cy.intercept('POST', '/signin', {
        statusCode: 200,
        body: {
            id: 22222,
            nome: "usuario mock",
            token: "um token qualquer"
        }
    }).as('signin');

    // Intercepting the GET request to /saldo
    cy.intercept('GET', '/saldo', {
        statusCode: 200,
        body: [
            { conta_id: 472523, conta: "Conta com movimentacao", saldo: "-1500.00" },
            { conta_id: 472524, conta: "Conta para saldo", saldo: "4034.00" },
            { conta_id: 472525, conta: "Conta para extrato", saldo: "-120.00" }
        ]
    }).as('saldo');

    // Intercepting the GET request to /contas
    cy.intercept('GET', '/contas', {
        statusCode: 200,
        body: [
            { id: 1, nome: "carteira", visivel: true, usuario_id: 1 },
            { id: 2, nome: "Conta para alterar", visivel: true, usuario_id: 1 },
            { id: 3, nome: "Conta mesmo nome", visivel: true, usuario_id: 1 }
        ]
    }).as('contas');

    // Intercepting the GET request to /extrato/**
    cy.intercept('GET', '/extrato/**', { 
        fixture: 'movementAccount' 
    }).as('extrato');
}

export default buildEnv;


//Overriding responses will be added in a future release
        // cy.intercept( 'POST','/signin',(req) => {
        //     const { body } = responses.shift()
        //     req.reply(
        //     body ={
        //         id:22222,
        //         nome:"usuario mock",
        //         token:"um token qualquer"
        //     }
        // )}).as('signin')
        //cy.wait('@signin').its('response.statusCode').should('eq', 200);
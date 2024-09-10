describe('Authentication', () => {

    const filePath = 'cypress/fixtures/response/AuthResponse.json';

    it('Basic Authentication', () => {
        cy.request({
            method: 'GET',
            url: 'https://postman-echo.com/basic-auth',
            auth:{
                user: 'postman',
                pass: 'password'
            }
        }).then((response) => {
            // Use cy.wrap() to wrap response and assert its properties
            cy.wrap(response).its('status').should('eq', 200);
            cy.wrap(response.body).its('authenticated').should('eq', true);
        });
    });

    it('Digest Authentication', () => {
        cy.request({
            method: 'GET',
            url: 'https://postman-echo.com/basic-auth',
            auth:{
                username: 'postman',
                password: 'password',
                method: 'degest'
            }
        }).then((response) => {
            // Use cy.wrap() to wrap response and assert its properties
            cy.wrap(response).its('status').should('eq', 200);
            cy.wrap(response.body).its('authenticated').should('eq', true);

            const content = JSON.stringify (response.body, null, 2);
            // Wrap the file writing process
            cy.task('writeToFile', {filePath, content}).then(()=>{
                cy.log(`response save to ${filePath}`);
            });
        });
    });

    const token = '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'
    it('Bearer Token',() => {
        cy.request({
            method: 'GET',
            url: 'https://api.github.com/user/repos',
            headers: {
                Authorization:'Bearer '+token
            }
        })
        .then((response) => {
            // Use cy.wrap() to wrap response and assert its properties
            cy.wrap(response).its('status').should('eq', 200);
        });
    });
});
/// <reference types="cypress" />

describe("Parsing JSON Response",() => {

    const filePath = 'cypress/fixtures/response/parsingJSONResponse.json';

    it('Parsing simple JSON response',() => {
        cy.request({
            methode: 'GET',
            url: "https://fakestoreapi.com/products",
        }).then((response)=>{
            expect(response.status).to.equal(200);

            // Wrap response to ensure Cypress waits for assertions
            cy.wrap(response.body[0]).should((product) => {
                expect(product.id).to.equal(1);
                expect(product.title).to.equal('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');
                expect(product.price).to.equal(109.95);
                expect(product.rating.rate).to.equal(3.9);
            });

            cy.wrap(response.body[19]).should((product) => {
                expect(product.id).to.equal(20);
                expect(product.title).to.equal('DANVOUY Womens T Shirt Casual Cotton Short');
                expect(product.price).to.equal(12.99);
                expect(product.rating.rate).to.equal(3.6);
            });
        });
    });


    it('Parsing complex JSON response',() => {
        let totalprice=0;

        cy.request({
            method: 'GET',
            url: "https://fakestoreapi.com/products",
            qs:{limit:5}
        }).then((response) => {
            expect(response.status).to.equal(200);

            // Calculate total price using wrap
            cy.wrap(response.body).each((product) => {
                totalprice += product.price;
            }).then(() => {
                // Ensure that total price is asserted after calculation is complete
                cy.wrap(totalprice).should('equal', 899.23);
            });
            
            const content = JSON.stringify (response.body, null, 2);
            // Wrap the file writing process
            cy.task('writeToFile', {filePath, content}).then(()=>{
                cy.log(`response save to ${filePath}`);
            });
        });
    });
});
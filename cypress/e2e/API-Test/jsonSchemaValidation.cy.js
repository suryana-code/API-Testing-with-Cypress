//JSON Schema Validation
//***before use, u need to install ajv library


/// <reference types="cypress" />

const Ajv=require('ajv')
const ajv=new Ajv()


describe('Schema Validastion',() => {

    const filePath = 'cypress/fixtures/response/jsonSchemaValidationResponse.json';
    
    it('Schema validation agaist response',() => {
         cy.request({
              method: 'GET',
              url: 'https://fakestoreapi.com/products'
          }).then((response)=>{
            const schema = {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "title": "Generated schema for Root",
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": { "type": "number" },
                        "title": { "type": "string" },
                        "price": { "type": "number" },
                        "description": { "type": "string" },
                        "category": { "type": "string" },
                        "image": { "type": "string" },
                        "rating": {
                            "type": "object",
                            "properties": {
                                "rate": { "type": "number" },
                                "count": { "type": "number" }
                            },
                            "required": ["rate", "count"]
                        }
                    },
                    "required": ["id", "title", "price", "description", "category", "image", "rating"]
                }
            };

            // Validate the response body against the schema
            const validate= ajv.compile(schema);

            // Wrap the response body to ensure Cypress waits for the validation process
            cy.wrap(response.body).should((responseBody) => {
            const isValid = validate(responseBody);
            expect(isValid, `Schema validation errors: ${JSON.stringify(validate.errors, null, 2)}`).to.be.true;
            });
            
            const content = JSON.stringify (response.body, null, 2);
            // Wrap the file writing process
            cy.task('writeToFile', {filePath, content}).then(()=>{
                cy.log(`response save to ${filePath}`);
            });
        });
    });
});
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });

describe('XML Parsing', () => {

    const filePath = 'cypress/fixtures/response/AuthResponse.json';

    const xmlPayload = `
    <Pet>
        <id>0</id>
        <Category>
            <id>0</id>
            <name>Dog</name>
        </Category>
        <name>Jimmy</name>
        <photoUrls>
            <photoUrl>string</photoUrl>
        </photoUrls>
        <tags>
            <Tag>
                <id>0</id>
                <name>string</name>
            </Tag>
        </tags>
        <status>available</status>
    </Pet>`;

    let petid = null;
    let nameis = null;

    it('Create New PET', () => {
        cy.request({
            method: 'POST',
            url: 'https://petstore.swagger.io/v2/pet',
            body: xmlPayload,
            headers: { 'Content-Type': 'application/xml', 'accept': 'application/xml' },
            timeout: 60000
        }).then((response) => {
            expect(response.status).to.eq(200);
            return cy.wrap(response.body);
        }).then((responseBody) => {
            return new Promise((resolve, reject) => {
                parser.parseString(responseBody, (err, result) => {
                    if (err) {
                        reject(`Failed to parse XML: ${err}`);
                    } else {
                        petid = result.Pet.id;
                        cy.task('logToTerminal', `Pet ID: ${petid}`);
                        resolve();
                    }
                });
            });
        });
    });

    it('Fetching Pet data-parsing xml response', () => {
        cy.wrap(petid).should('not.be.null').then(() => {
            cy.request({
                method: 'GET',
                url: 'https://petstore.swagger.io/v2/pet/' + petid,
                headers: { 'accept': 'application/xml' }
            }).then((response) => {
                expect(response.status).to.eq(200);
                return cy.wrap(response.body);
            }).then((responseBody) => {
                return new Promise((resolve, reject) => {
                    parser.parseString(responseBody, (err, result) => {
                        if (err) {
                            reject(`Failed to parse XML: ${err}`);
                        } else {
                            expect(result.Pet.id).to.equal(petid);
                            expect(result.Pet.name).to.equal('Jimmy');
                            nameis = result.Pet.name;
                            cy.task('logToTerminal', `Name: ${nameis}`);
                            resolve(result);
                        }
                    });
                });
            }).then((result) => {
                const content = JSON.stringify(result, null, 2);
                // Wrap the file writing process
                cy.task('writeToFile', { filePath, content }).then(() => {
                    cy.log(`Response saved to ${filePath}`);
                });
            });
        });
    });
});

/// <reference types="Cypress" />

describe('Testing "Our models" - A-class hatchback', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.viewport('macbook-13')
    })

    it('Find the most expensive and inexpensive A-class hatchback models', () => {

        cy.log('STARTING TEST')

        cy.wait(2000)

        // Dismissing the cookies banner
        cy.get('cmm-cookie-banner').shadow().find('[data-test="handle-accept-all-button"]').first().click()
        cy.url().should('include', '/passengercars')

        // Clicking the Hatchback option
        cy.get('dh-io-vmos').find('div').shadow().find('button').first().click()

        // Hovering over the A-Class hatchback
        cy.get('dh-io-vmos').find('div').shadow().find('a').first().trigger('mouseover')

        // Clicking "Build your car" and doing a work around with the "target" attribute in order to prevent a known issue with the Cypress framework
        cy.get('dh-io-vmos').find('div').shadow().find('wb-popover').find('li').find('a').invoke('attr', 'target', '_self').eq(1).trigger('mouseover').click()
        cy.url().should('include', '/car-configurator')

        // Scrolling down 800px, clicking the "Fuel Type" filter and selecting the "Diesel" option
        cy.scrollTo(0, 800)
        cy.get('owcc-car-configurator').shadow().find('form').find('wb-multi-select-control').find('button').first().click({ force: true })
        cy.get('owcc-car-configurator').shadow().find('form').find('wb-multi-select-control').find('wb-checkbox-control').eq(1).find('wb-icon').click({ force: true })

        // Taking a screenshot and saving under /screenshots/vehiclePrice.js folder
        cy.screenshot('diesel-A-class-models-screenshot')

        // Creating an array in order to fetch and store the vechile's prices
        let priceArray = []
        let priceArraySorted = []

        cy.get('owcc-car-configurator').shadow().find('cc-motorization-comparison').find('div').find('[class="cc-motorization-header__info-box"]').find('span').each(($el) => {
            priceArray.push($el.text())
        }).then(() => {

            priceArraySorted = priceArray.sort()

            // Writing the vehicle's prices to a text file named "highest_lowest_price.json"
            cy.writeFile('highest_lowest_price.json', [priceArraySorted[0], priceArraySorted[priceArraySorted.length - 1]])
        })

        // Asserting on the prices written on file and verifying that they are within the range of £15,000 and £60,000
        cy.readFile('highest_lowest_price.json').then(obj => {
        expect(Number(obj[0].replace(/[^\d.]/g, ''))).to.be.greaterThan(15000);
        expect(Number(obj[1].replace(/[^\d.]/g, ''))).to.be.lessThan(60000);
        })

        cy.log('FINISHED TEST')
    })
})
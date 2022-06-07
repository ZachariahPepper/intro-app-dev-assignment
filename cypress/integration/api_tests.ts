describe('API Tests', function() {
    it('Should navigate to login page and fill in fields', function() {
        // first visit the site
        cy.visit('http://localhost:3000');
        // get elements we will be
        // interacting with and alias them
        cy.get('input[name="email"]').as('emailText');
        cy.get('input[name="password"]').as('passwordText');
        cy.get('button.btn').as('submitButton');
        // interact with the elements
        cy.get('@emailText').type('admin@library.api');
        cy.get('@passwordText').type('P@ssw0rd');
        cy.get('@submitButton').click();
        // Assert that we are in the next page
        // Then click on the add button and create a book
        cy.get('button.addButton').as('addButton');
        cy.get('@addButton').click();
        cy.get('input[name="title"]').as('titleText');
        cy.get('input[name="release_date"]').as('release_dateText');
        cy.get('input[name="pages"]').as('pagesText');
        cy.get('select[name="author_id"]').as('authorSelect');
        cy.get('select[name="publisher_id"]').as('publisherSelect');
        cy.get('button.SaveBook').as('saveBook');
        cy.get('@titleText').type('Test Book 1');
        cy.get('@release_dateText').type('11/11/1970');
        cy.get('@pagesText').type('576');
        cy.get('@authorSelect').select('Linette Janzen');
        cy.get('@publisherSelect').select('Schiller Group');
        cy.get('@saveBook').click();
        // Navigate to the page where the book was added
        cy.get('nav');
        cy.get('ul.pagination');
        cy.get('li.page-item');
        cy.get('a.page-link');
        cy.get('a.page-link').eq(21).as('page11');
        cy.get('@page11').click();
        //Create another book on that page
        cy.get('button.addButton').as('addButton');
        cy.get('@addButton').click();
        cy.get('input[name="title"]').as('titleText');
        cy.get('input[name="release_date"]').as('release_dateText');
        cy.get('input[name="pages"]').as('pagesText');
        cy.get('select[name="author_id"]').as('authorSelect');
        cy.get('select[name="publisher_id"]').as('publisherSelect');
        cy.get('button.SaveBook').as('saveBook');
        cy.get('@titleText').type('Test Book 2');
        cy.get('@release_dateText').type('04/05/1998');
        cy.get('@pagesText').type('345');
        cy.get('@authorSelect').select('Davida Folk');
        cy.get('@publisherSelect').select('Crona-Mraz');
        cy.get('@saveBook').click();
        //Delete the book just created
        cy.get('button.deleteButton').as('deleteButton');
        cy.get('@deleteButton').click();
    });
});
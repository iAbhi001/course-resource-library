describe('Landing Page', () => {
    it('should display heading and buttons, and navigate correctly', () => {
      cy.visit('http://localhost:3000/');
  
      // Check the heading
      cy.contains('LMS Portal').should('be.visible');
  
      // Check the description text
      cy.contains('All your courses, assignments, and submissions in one place.').should('be.visible');
  
      // Check buttons
      cy.contains('Log In').should('be.visible');
      cy.contains('Create New Account').should('be.visible');
  
      // Click Log In and check URL
      cy.contains('Log In').click();
      cy.url().should('include', '/login');
  
      // Go back and test Create Account
      cy.go('back');
      cy.contains('Create New Account').click();
      cy.url().should('include', '/register');
    });
  });
  
describe('Login Page', () => {
    it('should allow user to log in and redirect based on role', () => {
      // Intercept the API call and simulate a successful login
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'mock-token-123',
          role: 'student' // or 'teacher' to test teacher flow
        },
      }).as('loginRequest');
  
      // Visit the login page
      cy.visit('http://localhost:3000/login');
  
      // Fill in the form
      cy.get('input[placeholder="name@example.com"]').type('student@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
  
      // Submit the form
      cy.get('button').contains('Log In').click();
  
      // Wait for the API call and check it was made
      cy.wait('@loginRequest').its('request.body').should('deep.equal', {
        email: 'student@example.com',
        password: 'password123',
      });
  
      // Verify the redirection to student dashboard
      cy.url().should('include', '/dashboard/student');
    });
  });
  
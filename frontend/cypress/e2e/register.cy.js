describe('Register Page', () => {
    it('should register a new student user successfully', () => {
      // Intercept the POST request to mock the API
      cy.intercept('POST', '/api/users/register', {
        statusCode: 200,
        body: {},
      }).as('registerRequest');
  
      cy.visit('http://localhost:3000/register');
  
      // Fill in form fields
      cy.get('input[placeholder="Name"]').type('Test User');
      cy.get('input[placeholder="name@example.com"]').type('student@example.com');
      cy.get('input[placeholder="Password"]').type('securepassword');
  
      // Select role
      cy.get('select').select('student');
  
      // Submit the form
      cy.contains('Create Account').click();
  
      // Wait for API call and verify redirect
      cy.wait('@registerRequest');
      cy.url().should('include', '/login');
    });
  
    it('should show Admin Key input when role is teacher', () => {
      cy.visit('http://localhost:3000/register');
  
      cy.get('select').select('teacher');
  
      cy.get('input[placeholder="Admin Key"]').should('be.visible');
    });
  
    it('should display an error message if registration fails', () => {
      cy.intercept('POST', '/api/users/register', {
        statusCode: 400,
        body: { msg: 'Email already exists' },
      }).as('registerFail');
  
      cy.visit('http://localhost:3000/register');
  
      cy.get('input[placeholder="Name"]').type('Test User');
      cy.get('input[placeholder="name@example.com"]').type('student@example.com');
      cy.get('input[placeholder="Password"]').type('securepassword');
      cy.get('select').select('student');
  
      cy.contains('Create Account').click();
  
      cy.wait('@registerFail');
      cy.get('.alert-danger').should('contain.text', 'Email already exists');
    });
  });
  
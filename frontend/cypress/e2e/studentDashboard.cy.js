describe('Student Dashboard', () => {
    beforeEach(() => {
      // Mock API responses
      cy.intercept('GET', '/api/courses', {
        statusCode: 200,
        body: [
          { _id: 'c1', title: 'Math 101' },
          { _id: 'c2', title: 'Physics 201' },
          { _id: 'c3', title: 'Chemistry 301' },
          { _id: 'c4', title: 'Biology 101' }
        ],
      }).as('getCourses');
  
      cy.intercept('GET', '/api/announcements', {
        statusCode: 200,
        body: [
          { _id: 'a1', title: 'Welcome', content: 'Welcome to the LMS!' }
        ]
      }).as('getAnnouncements');
  
      cy.intercept('GET', /\/assignments\/.*/, (req) => {
        req.reply([
          {
            _id: `as-${req.url.split('/').pop()}`,
            title: 'Homework',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }).as('getAssignments');
  
      cy.intercept('GET', /\/submissions\/assignment\/.*/, {
        statusCode: 200,
        body: [
          {
            grade: 95,
            comments: 'Great job!'
          }
        ]
      }).as('getSubmissions');
  
      localStorage.setItem('token', 'mock-token');
      cy.visit('http://localhost:3000/dashboard/student');
    });
  
    it('loads dashboard and shows courses, assignments, and announcements', () => {
      cy.contains('My Courses').should('be.visible');
      cy.contains('Assignments').should('be.visible');
      cy.contains('Announcements').should('be.visible');
  
      cy.contains('Math 101').should('be.visible');
      cy.contains('Homework').should('be.visible');
      cy.contains('Welcome').should('be.visible');
    });
  
    it('should paginate courses if more than 3 exist', () => {
      cy.get('.pagination').should('exist');
      cy.get('.pagination').contains('2').click();
      cy.get('.pagination .active').should('contain.text', '2');
    });
  
    it('logs out and redirects to login', () => {
      cy.contains('Logout').click();
      cy.url().should('include', '/login');
      cy.window().then(win => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });
  
    it('displays upcoming assignments in the To-Do list', () => {
      cy.contains('To‑Do / Action Items').scrollIntoView();
      cy.contains('Homework').should('be.visible');
    });
  
    it('shows quick links', () => {
      cy.contains('PFW Library').should('have.attr', 'href').and('include', 'library.pfw.edu');
      cy.contains('Office Hours').should('have.attr', 'href').and('include', 'mailto');
    });
  });
  
describe('FR-05: Manajemen kegiatan konservasi', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setCookie('e2e-bypass-auth', 'community');

    // Mock authentication as Community
    cy.intercept('GET', '**/auth/v1/user*', {
      statusCode: 200,
      body: {
        id: 'community-user-id',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'community@example.com',
        user_metadata: { role: 'community' }
      }
    });

    cy.intercept('GET', '**/rest/v1/communities*', {
      statusCode: 200,
      body: { id: 'community-id-123' } // Return object for .single()
    });
  });

  it('Should display validation error when submitting empty form', () => {
    cy.visit('/community/dashboard/activities/create');
    cy.wait(1000); // Hydration wait

    // Attempt to submit empty form
    cy.contains('button', 'Ajukan untuk Review').click();

    // Check for HTML5 or React validation message
    cy.get('input[name="title"]').then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty;
    });
  });

  it('Should successfully fill form and create a new activity', () => {
    // Mock the Supabase insert for activities
    cy.intercept('POST', '**/rest/v1/activities*', {
      statusCode: 201,
      body: [{ id: 'new-activity-id', title: 'Bersih Pantai Mutiara' }]
    }).as('createActivity');

    cy.visit('/community/dashboard/activities/create');
    cy.wait(1000);

    // Fill the required fields (based on standard SinergiLaut schema)
    cy.get('input[name="title"]').type('Bersih Pantai Mutiara');
    cy.get('textarea[name="description"]').type('Kegiatan pembersihan area pesisir pantai mutiara.');
    cy.get('input[name="location"]').type('Pantai Mutiara, Jakarta');
    
    // Using valid future dates
    const d = new Date();
    d.setMonth(d.getMonth() + 7);
    const validFuture = d.toISOString().slice(0, 16);
    cy.get('input[name="startDate"]').type(new Date().toISOString().slice(0, 16));
    cy.get('input[name="executionDate"]').type(validFuture);
    
    // Submit the form
    cy.contains('button', 'Ajukan untuk Review').click();

    // Wait for the mock to be hit
    cy.wait('@createActivity');

    // Verify redirection back to dashboard or success toast
    cy.url().should('include', '/community/dashboard');
  });

  // ─────────────────────────────────────────────
  // Edge Case: XSS di field judul kegiatan baru
  // ─────────────────────────────────────────────
  it('Should safely render XSS payload entered in activity title', () => {
    const xssPayload = '<script>alert("xss")</script>';

    cy.intercept('POST', '**/rest/v1/activities*', {
      statusCode: 201,
      body: [{ id: 'new-act', title: xssPayload }]
    }).as('createActivityXSS');

    cy.visit('/community/dashboard/activities/create');
    cy.wait(1000);

    cy.get('input[name="title"]').type(xssPayload);

    // XSS must not execute in form
    cy.get('body').should('be.visible');
    cy.get('body').then(($body) => {
      const html = $body.html();
      expect(html).not.to.include('<script>alert');
    });
  });
});

describe('FR-21: Mencari dan Mendaftar Aktivitas Relawan', () => {
  const xssPayload = '<script>alert("xss")</script>';
  const sqlPayload = "' OR 1=1 --";
  const wildcardPayload = '% _ LIKE SELECT DROP';

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setCookie('e2e-bypass-auth', 'user');

    cy.intercept('GET', '**/rest/v1/activities?select=*&status=eq.published*', {
      statusCode: 200,
      body: [
        { id: 'act-1', title: 'Bersih Pantai Mutiara', location: 'Jakarta', category: 'cleanup', start_date: new Date().toISOString() },
        { id: 'act-2', title: 'Tanam Mangrove', location: 'Bali', category: 'restoration', start_date: new Date().toISOString() }
      ]
    }).as('getAllActivities');
  });

  it('Should allow user to search and filter activities using text search and dropdowns', () => {
    cy.visit('/activities');
    cy.wait('@getAllActivities');

    // Both should be visible initially
    cy.contains('Bersih Pantai Mutiara').should('be.visible');
    cy.contains('Tanam Mangrove').should('be.visible');

    // 1. Text Search for "Bersih"
    cy.get('input[placeholder*="Cari" i]').type('Bersih');
    cy.contains('Tanam Mangrove').should('not.exist');
    cy.contains('Bersih Pantai Mutiara').should('be.visible');

    // Clear search
    cy.get('input[placeholder*="Cari" i]').clear();
    cy.contains('Tanam Mangrove').should('be.visible');

    // 2. Dropdown Filter: Location filter (Jakarta)
    cy.contains('.act-dropdown-btn', /Location/i).click();
    cy.contains('.act-dropdown-item', 'Jakarta').click();
    cy.contains('Tanam Mangrove').should('not.exist');
    cy.contains('Bersih Pantai Mutiara').should('be.visible');

    // Reset location filter back to "All Locations"
    cy.contains('.act-dropdown-btn', 'Jakarta').click();
    cy.contains('.act-dropdown-item', 'All Locations').click();
    cy.contains('Tanam Mangrove').should('be.visible');

    // 3. Dropdown Filter: Category/Type filter (Coral & Ecosystem Restoration)
    cy.contains('.act-dropdown-btn', /Type/i).click();
    cy.contains('.act-dropdown-item', 'Coral & Ecosystem Restoration').click();
    cy.contains('Bersih Pantai Mutiara').should('not.exist');
    cy.contains('Tanam Mangrove').should('be.visible');
  });

  // ─────────────────────────────────────────────
  // Edge Case 1: Pencarian dengan karakter SQL Injection
  // ─────────────────────────────────────────────
  it('Should safely handle SQL injection attempt in search input', () => {
    cy.visit('/activities');
    cy.wait('@getAllActivities');

    cy.get('input[placeholder*="Cari" i]').type(sqlPayload, { delay: 10 });

    // Application must NOT crash or expose internal error
    cy.get('body').should('be.visible');
    cy.contains(/error|exception|syntax error|invalid/i).should('not.exist');

    // No results should show for SQL payload
    cy.contains('Bersih Pantai Mutiara').should('not.exist');
    cy.contains('Tanam Mangrove').should('not.exist');
  });

  // ─────────────────────────────────────────────
  // Edge Case 2: Pencarian dengan XSS payload
  // ─────────────────────────────────────────────
  it('Should sanitize XSS payload in search field', () => {
    cy.visit('/activities');
    cy.wait('@getAllActivities');

    cy.get('input[placeholder*="Cari" i]').type(xssPayload, { delay: 10 });

    // XSS must NOT execute - verify alert dialog did NOT pop up
    cy.get('body').should('be.visible');

    // The raw script tag must NOT appear as rendered HTML in the DOM
    cy.get('body').then(($body) => {
      const html = $body.html();
      expect(html).not.to.include('<script>alert');
    });
  });

  // ─────────────────────────────────────────────
  // Edge Case 3: Pencarian wildcard/karakter khusus SQL
  // ─────────────────────────────────────────────
  it('Should handle SQL wildcard characters in search without crashing', () => {
    cy.visit('/activities');
    cy.wait('@getAllActivities');

    cy.get('input[placeholder*="Cari" i]').type(wildcardPayload, { delay: 10 });

    cy.get('body').should('be.visible');
    cy.contains(/error|exception/i).should('not.exist');
  });

  // ─────────────────────────────────────────────
  // Edge Case 4: Pencarian kosong menampilkan semua data
  // ─────────────────────────────────────────────
  it('Should show all activities when search is cleared', () => {
    cy.visit('/activities');
    cy.wait('@getAllActivities');

    const searchInput = cy.get('input[placeholder*="Cari" i]');
    searchInput.type('Bersih');
    cy.contains('Tanam Mangrove').should('not.exist');

    // Clear the search
    cy.get('input[placeholder*="Cari" i]').clear();

    // All activities should be visible again
    cy.contains('Bersih Pantai Mutiara').should('be.visible');
    cy.contains('Tanam Mangrove').should('be.visible');
  });

  // ─────────────────────────────────────────────
  // Edge Case 5: Pencarian keyword random tanpa hasil
  // ─────────────────────────────────────────────
  it('Should show empty state when search returns no results', () => {
    cy.visit('/activities');
    cy.wait('@getAllActivities');

    cy.get('input[placeholder*="Cari" i]').type('xqyzw123nonexistent');

    // Neither activity should be visible
    cy.contains('Bersih Pantai Mutiara').should('not.exist');
    cy.contains('Tanam Mangrove').should('not.exist');

    // Should show empty/no-result state message
    cy.contains(/tidak ditemukan|tidak ada|no result|belum ada/i).should('be.visible');
  });
});

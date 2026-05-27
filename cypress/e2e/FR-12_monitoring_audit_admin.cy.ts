describe('FR-12: Monitoring & audit oleh admin', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setCookie('e2e-bypass-auth', 'admin');

    cy.intercept('GET', '**/auth/v1/user*', {
      statusCode: 200,
      body: {
        id: 'admin-user-id',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'admin@example.com',
        user_metadata: { role: 'admin' }
      }
    });

    cy.intercept('GET', '**/rest/v1/audit_logs*', {
      statusCode: 200,
      body: [
        { id: 'log-1', action: 'user_register', user_id: 'user-1', ip_address: '192.168.1.1', created_at: '2026-05-20T10:00:00Z' },
        { id: 'log-2', action: 'community_verified', user_id: 'admin-1', ip_address: '192.168.1.2', created_at: '2026-05-20T11:00:00Z' }
      ]
    }).as('getAuditLogs');
  });

  it('Should display audit logs and allow filtering', () => {
    // Navigasi ke halaman Audit
    // Bisa jadi di /admin/users atau /admin/dashboard
    cy.visit('/admin/users'); // Asumsi ada tab audit di sini
    
    // Anggap ada tombol atau link untuk pindah ke log aktivitas (bisa jadi menyatu di page)
    cy.wait('@getAuditLogs');

    cy.contains('user_register').should('be.visible');
    cy.contains('192.168.1.1').should('be.visible');
    
    cy.contains('community_verified').should('be.visible');
    cy.contains('192.168.1.2').should('be.visible');

    // Test search filter input
    cy.get('input[placeholder*="Cari" i], input[type="search"]').first().type('community_verified');
    cy.contains('user_register').should('not.exist');
    cy.contains('community_verified').should('be.visible');
  });
});

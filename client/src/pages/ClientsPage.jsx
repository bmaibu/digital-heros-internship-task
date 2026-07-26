import { Briefcase, Building2, CheckCircle2, Copy, Download, Mail, Search, UserCheck, Users, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../components/Spinner.jsx';
import api, { getError } from '../services/api.js';

export function ClientsPage() {
  const [result, setResult] = useState();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadClients = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      // Fetch leads from backend
      const { data } = await api.get('/leads', { params: { limit: 100 } });
      const closedLeads = data.leads.filter((l) => l.status === 'Closed');

      // Default sample client accounts merged with closed leads
      const sampleClients = [
        {
          _id: 'c1',
          name: 'Sarah Jenkins',
          email: 'sarah@northstardesign.com',
          company: 'Northstar Studio',
          service: 'Web Development & Branding',
          budget: '$5,000 - $10,000',
          status: 'Active',
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          notes: 'Retainer client. Quarterly UX review scheduled.',
        },
        {
          _id: 'c2',
          name: 'Marcus Vance',
          email: 'marcus@orbitlabs.io',
          company: 'Orbit Labs',
          service: 'Full-Stack Application',
          budget: '>$5,000',
          status: 'Active',
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
          notes: 'Phase 1 MVP launched. Phase 2 contract under review.',
        },
        {
          _id: 'c3',
          name: 'Elena Rostova',
          email: 'elena@aperturemedia.co',
          company: 'Aperture Media',
          service: 'Custom CRM Integration',
          budget: '$1,000 - $5,000',
          status: 'Onboarding',
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          notes: 'Kickoff meeting completed. System credentials exchanged.',
        },
      ];

      // Map converted closed leads into client records
      const convertedClients = closedLeads.map((lead) => ({
        _id: lead._id,
        name: lead.name,
        email: lead.email,
        company: lead.company || 'Direct Client',
        service: lead.service || 'Custom Service Package',
        budget: lead.budget || '$1,000 - $5,000',
        status: 'Active',
        createdAt: lead.createdAt,
        notes: lead.message || 'Converted from Lead Pipeline.',
      }));

      const allClients = [...convertedClients, ...sampleClients];
      setResult(allClients);
    } catch (e) {
      setError(getError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  function copyEmail(email) {
    navigator.clipboard
      .writeText(email)
      .then(() => toast.success('Client email copied to clipboard.'))
      .catch(() => toast.error('Could not copy email.'));
  }

  function exportCsv() {
    if (!filteredClients.length) return;
    const content = [
      ['Name', 'Email', 'Company', 'Service', 'Budget', 'Account Status', 'Joined Date'],
      ...filteredClients.map((client) => [
        client.name,
        client.email,
        client.company,
        client.service,
        client.budget,
        client.status,
        new Date(client.createdAt).toISOString(),
      ]),
    ]
      .map((row) => row.map((val) => `"${String(val).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leaddesk-clients.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Clients roster CSV downloaded.');
  }

  const filteredClients = (result || []).filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = (result || []).filter((c) => c.status === 'Active').length;
  const onboardingCount = (result || []).filter((c) => c.status === 'Onboarding').length;

  return (
    <main className="dashboard-page clients-page">
      <section className="page-title">
        <div>
          <h2>Clients</h2>
          <p>Manage active client accounts, contracts, and relationship history.</p>
        </div>
        <button className="button secondary" onClick={exportCsv}>
          <Download size={17} /> Export Clients CSV
        </button>
      </section>

      {/* Metrics Summary Row */}
      <section className="stat-grid" style={{ marginBottom: '22px' }}>
        <article className="metric-card">
          <div className="metric-icon navy">
            <UserCheck size={18} />
          </div>
          <span>TOTAL CLIENTS</span>
          <strong>{result?.length || 0}</strong>
        </article>
        <article className="metric-card">
          <div className="metric-icon green">
            <CheckCircle2 size={18} />
          </div>
          <span>ACTIVE ACCOUNTS</span>
          <strong>{activeCount}</strong>
        </article>
        <article className="metric-card">
          <div className="metric-icon amber">
            <Briefcase size={18} />
          </div>
          <span>IN ONBOARDING</span>
          <strong>{onboardingCount}</strong>
        </article>
        <article className="metric-card">
          <div className="metric-icon blue">
            <Building2 size={18} />
          </div>
          <span>RETENTION RATE</span>
          <strong>98%</strong>
        </article>
      </section>

      {/* Main Table Panel */}
      <section className="panel lead-table-panel">
        <div className="lead-toolbar">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search">
              <Search size={18} />
              <input
                placeholder="Search client, company or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="status-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ height: '36px', padding: '0 12px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <span>{filteredClients.length} clients displayed</span>
        </div>

        {error ? (
          <div className="page-message">{error}</div>
        ) : loading ? (
          <Spinner label="Loading clients roster" />
        ) : filteredClients.length === 0 ? (
          <div className="empty">
            <Users size={32} className="empty-icon" />
            <h3>No clients found</h3>
            <p>{search ? 'Try adjusting your search criteria.' : 'Converted leads will appear here as active clients.'}</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Service Package</th>
                  <th>Contract Value</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client._id}>
                    <td>
                      <div className="lead-person">
                        <div className="initial">
                          {client.name
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <span>
                          <strong>{client.name}</strong>
                          <button onClick={() => copyEmail(client.email)} title="Copy email">
                            {client.email} <Copy size={12} />
                          </button>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Building2 size={14} style={{ color: '#858da0' }} />
                        {client.company}
                      </div>
                    </td>
                    <td>{client.service}</td>
                    <td>
                      <strong style={{ color: '#273148' }}>{client.budget}</strong>
                    </td>
                    <td>
                      <span
                        className={`status ${
                          client.status === 'Active'
                            ? 'status-closed'
                            : client.status === 'Onboarding'
                            ? 'status-contacted'
                            : 'status-new'
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td>
                      {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                        new Date(client.createdAt)
                      )}
                    </td>
                    <td>
                      <button className="button secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setSelectedClient(client)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="modal-backdrop" onClick={() => setSelectedClient(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Client Account Profile</h3>
              <button className="icon-button" onClick={() => setSelectedClient(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="lead-person" style={{ marginBottom: '18px' }}>
                <div className="initial" style={{ width: '44px', height: '44px', fontSize: '14px' }}>
                  {selectedClient.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{selectedClient.name}</h4>
                  <p style={{ margin: '2px 0 0', color: '#6e788e', fontSize: '12px' }}>{selectedClient.company}</p>
                </div>
              </div>
              <div className="modal-info-grid">
                <div>
                  <label>Email Address</label>
                  <p>{selectedClient.email}</p>
                </div>
                <div>
                  <label>Account Status</label>
                  <span
                    className={`status ${
                      selectedClient.status === 'Active'
                        ? 'status-closed'
                        : selectedClient.status === 'Onboarding'
                        ? 'status-contacted'
                        : 'status-new'
                    }`}
                  >
                    {selectedClient.status}
                  </span>
                </div>
                <div>
                  <label>Service Package</label>
                  <p>{selectedClient.service}</p>
                </div>
                <div>
                  <label>Contract Tier</label>
                  <p>{selectedClient.budget}</p>
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#858da0', marginBottom: '6px' }}>ACCOUNT NOTES</label>
                <div style={{ background: '#f8f8fb', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#4a5468', border: '1px solid #eaeaf0' }}>
                  {selectedClient.notes}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button secondary" onClick={() => copyEmail(selectedClient.email)}>
                <Mail size={15} /> Send Email
              </button>
              <button className="button primary" onClick={() => setSelectedClient(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

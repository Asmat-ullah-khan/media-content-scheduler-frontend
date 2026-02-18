import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  ListGroup,
  Table,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0e0e0e;
    --paper: #f5f2eb;
    --cream: #ede9df;
    --gold: #c9a84c;
    --gold-light: #e8d5a3;
    --rust: #c0513a;
    --sage: #4a6741;
    --slate: #3d4f5c;
    --muted: #8a8177;
    --border: #d5cfc4;
    --shadow: 0 2px 20px rgba(14,14,14,0.08);
    --shadow-lg: 0 8px 40px rgba(14,14,14,0.12);
  }

  body, #root {
    background-color: var(--paper);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    min-height: 100vh;
  }

  /* Background texture */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(201,168,76,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(77,90,80,0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .dashboard-container {
    position: relative;
    z-index: 1;
    padding-top: 3rem;
    padding-bottom: 4rem;
  }

  /* Dashboard Header */
  .dashboard-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .dashboard-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.4rem;
  }

  .dashboard-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.6rem;
    font-weight: 400;
    line-height: 1.1;
    color: var(--ink);
    margin: 0;
  }

  .dashboard-subtitle {
    font-size: 0.85rem;
    color: var(--muted);
    margin-top: 0.4rem;
    font-weight: 300;
  }

  /* Stat Cards */
  .stat-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 2px;
    box-shadow: var(--shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    overflow: hidden;
    position: relative;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .stat-card.total::before { background: var(--slate); }
  .stat-card.scheduled::before { background: var(--gold); }
  .stat-card.published::before { background: var(--sage); }
  .stat-card.failed::before { background: var(--rust); }

  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }

  .stat-card .card-body {
    padding: 1.6rem 1.4rem 1.8rem;
    text-align: left;
  }

  .stat-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.8rem;
    display: block;
  }

  .stat-value {
    font-family: 'DM Serif Display', serif;
    font-size: 3rem;
    line-height: 1;
    margin: 0;
    display: block;
  }

  .stat-value.total { color: var(--slate); }
  .stat-value.scheduled { color: var(--gold); }
  .stat-value.published { color: var(--sage); }
  .stat-value.failed { color: var(--rust); }

  .stat-icon {
    position: absolute;
    bottom: 1rem;
    right: 1.2rem;
    font-size: 2.4rem;
    opacity: 0.08;
    font-family: 'DM Serif Display', serif;
    line-height: 1;
  }

  /* Section Cards */
  .section-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 2px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .section-card .card-header {
    background: transparent;
    border-bottom: 1px solid var(--border);
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-card .card-header .header-accent {
    width: 3px;
    height: 1.2rem;
    border-radius: 2px;
  }

  .section-card.upcoming .card-header .header-accent { background: var(--slate); }
  .section-card.platform .card-header .header-accent { background: var(--gold); }

  .section-card .card-header h5 {
    font-family: 'DM Serif Display', serif;
    font-size: 1.1rem;
    font-weight: 400;
    margin: 0;
    color: var(--ink);
  }

  .section-card .card-body {
    padding: 0;
  }

  /* List Group */
  .custom-list .list-group-item {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border);
    padding: 1.1rem 1.5rem;
    transition: background 0.15s ease;
  }

  .custom-list .list-group-item:last-child {
    border-bottom: none;
  }

  .custom-list .list-group-item:hover {
    background: rgba(14,14,14,0.02);
  }

  .post-content {
    font-family: 'DM Serif Display', serif;
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 0.3rem;
    line-height: 1.4;
  }

  .post-meta {
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 400;
    letter-spacing: 0.03em;
  }

  .platform-chip {
    display: inline-block;
    background: var(--ink);
    color: var(--paper);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.15rem 0.45rem;
    border-radius: 1px;
    margin-right: 0.3rem;
    margin-bottom: 0.2rem;
  }

  .post-date {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--muted);
    font-size: 0.72rem;
  }

  /* Table */
  .custom-table {
    margin: 0;
    border-collapse: separate;
    border-spacing: 0;
  }

  .custom-table thead tr th {
    background: var(--ink);
    color: var(--paper);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.9rem 1.5rem;
    border: none;
  }

  .custom-table tbody tr td {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
    font-size: 0.88rem;
    color: var(--ink);
    background: transparent;
    vertical-align: middle;
  }

  .custom-table tbody tr:first-child td {
    border-top: none;
  }

  .custom-table tbody tr:hover td {
    background: rgba(14,14,14,0.025);
  }

  .platform-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
    font-weight: 400;
  }

  .count-badge {
    display: inline-block;
    background: var(--gold-light);
    color: var(--ink);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.2rem 0.7rem;
    border-radius: 100px;
  }

  /* Empty State */
  .empty-state {
    padding: 3rem 1.5rem;
    text-align: center;
    color: var(--muted);
    font-size: 0.88rem;
    font-style: italic;
    font-family: 'DM Serif Display', serif;
  }

  /* Alert */
  .custom-alert {
    background: #fef4f2;
    border: 1px solid rgba(192,81,58,0.25);
    border-left: 3px solid var(--rust);
    border-radius: 2px;
    color: var(--rust);
    font-size: 0.88rem;
    padding: 1rem 1.2rem;
  }

  /* Spinner */
  .loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1rem;
  }

  .loading-wrap .spinner-border {
    color: var(--gold) !important;
    width: 2rem;
    height: 2rem;
    border-width: 2px;
  }

  .loading-text {
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
    color: var(--muted);
    font-style: italic;
  }

  /* Decorative rule */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    color: var(--muted);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .section-divider::before,
  .section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
`;

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const baseUrl = "https://social-media-content-scheduler-sigma.vercel.app";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        const statsResponse = await axios.get(
          `${baseUrl}/api/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const upcomingResponse = await axios.get(
          `${baseUrl}/api/dashboard/upcoming`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (statsResponse.data.status === "success") {
          console.log("Fetched stats:", statsResponse.data.data);
          setStats(statsResponse.data.data);
        }

        if (upcomingResponse.data.status === "success") {
          setUpcoming(upcomingResponse.data.data);
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch dashboard data.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <Container>
          <div className="loading-wrap">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading dashboard...</span>
            </Spinner>
            <span className="loading-text">Gathering your data…</span>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <Container className="dashboard-container">
          <Alert className="custom-alert">{error}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <Container className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-eyebrow">Content Command Centre</div>
          <h1 className="dashboard-title">Your Dashboard</h1>
          <p className="dashboard-subtitle">
            Overview of your scheduled content pipeline
          </p>
        </div>

        {/* Stat Cards */}
        <Row className="g-3 mb-4">
          <Col xs={12} md={3}>
            <Card className="stat-card total border-0">
              <Card.Body>
                <span className="stat-label">Total Posts</span>
                <span className="stat-value total">{stats?.total || 0}</span>
              </Card.Body>
              <span className="stat-icon">∑</span>
            </Card>
          </Col>

          <Col xs={12} md={3}>
            <Card className="stat-card scheduled border-0">
              <Card.Body>
                <span className="stat-label">Scheduled</span>
                <span className="stat-value scheduled">
                  {stats?.scheduled || 0}
                </span>
              </Card.Body>
              <span className="stat-icon">◷</span>
            </Card>
          </Col>

          <Col xs={12} md={3}>
            <Card className="stat-card published border-0">
              <Card.Body>
                <span className="stat-label">Published</span>
                <span className="stat-value published">
                  {stats?.published || 0}
                </span>
              </Card.Body>
              <span className="stat-icon">✓</span>
            </Card>
          </Col>

          <Col xs={12} md={3}>
            <Card className="stat-card failed border-0">
              <Card.Body>
                <span className="stat-label">Failed</span>
                <span className="stat-value failed">{stats?.failed || 0}</span>
              </Card.Body>
              <span className="stat-icon">!</span>
            </Card>
          </Col>
        </Row>

        {/* Upcoming Posts */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="section-card upcoming border-0">
              <Card.Header>
                <span className="header-accent" />
                <h5>Upcoming Scheduled Posts (Next 5)</h5>
              </Card.Header>
              <Card.Body>
                {upcoming.length === 0 ? (
                  <div className="empty-state">
                    No upcoming posts scheduled.
                  </div>
                ) : (
                  <ListGroup className="custom-list list-group-flush">
                    {upcoming.map((post) => (
                      <ListGroup.Item key={post._id}>
                        <div className="post-content">
                          {post.content.substring(0, 60)}…
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap mt-1">
                          {post.platforms.map((p) => (
                            <span key={p} className="platform-chip">
                              {p}
                            </span>
                          ))}
                          <span className="post-date">
                            ◷ {new Date(post.scheduleDate).toLocaleString()}
                          </span>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Posts by Platform */}
        {stats?.byPlatform && Object.keys(stats.byPlatform).length > 0 && (
          <Row>
            <Col xs={12}>
              <Card className="section-card platform border-0">
                <Card.Header>
                  <span className="header-accent" />
                  <h5>Posts by Platform</h5>
                </Card.Header>
                <Card.Body>
                  <Table className="custom-table" responsive>
                    <thead>
                      <tr>
                        <th>Platform</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stats.byPlatform).map(
                        ([platform, count]) => (
                          <tr key={platform}>
                            <td>
                              <span className="platform-name">{platform}</span>
                            </td>
                            <td>
                              <span className="count-badge">{count}</span>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default Dashboard;

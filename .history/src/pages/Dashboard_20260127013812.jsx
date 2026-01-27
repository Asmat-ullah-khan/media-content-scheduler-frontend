import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, ListGroup } from "react-bootstrap";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        // Fetch stats
        const statsResponse = await axios.get(
          "https://social-media-content-scheduler-sigma.vercel.app/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        // Fetch upcoming posts
        const upcomingResponse = await axios.get(
          "https://social-media-content-scheduler-sigma.vercel.app/api/dashboard/upcoming",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (statsResponse.data.status === "success") {
          setStats(statsResponse.data.data);
        }

        if (upcomingResponse.data.status === "success") {
          setUpcoming(upcomingResponse.data.data);
        }
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to fetch dashboard data. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4 d-flex justify-content-center">
        <h3>Loading dashboard...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="g-4">
        {/* Total Posts */}
        <Col xs={12} md={3}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Total Posts</Card.Title>
              <h2>{stats?.total || 0}</h2>
            </Card.Body>
          </Card>
        </Col>

        {/* Scheduled Posts */}
        <Col xs={12} md={3}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Scheduled Posts</Card.Title>
              <h2>{stats?.scheduled || 0}</h2>
            </Card.Body>
          </Card>
        </Col>

        {/* Published Posts */}
        <Col xs={12} md={3}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Published Posts</Card.Title>
              <h2>{stats?.published || 0}</h2>
            </Card.Body>
          </Card>
        </Col>

        {/* Failed Posts */}
        <Col xs={12} md={3}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Failed Posts</Card.Title>
              <h2>{stats?.failed || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Upcoming Posts Section */}
      <Row className="mt-5">
        <Col xs={12}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h5>Upcoming Scheduled Posts (Next 5)</h5>
            </Card.Header>
            <Card.Body>
              {upcoming.length === 0 ? (
                <p className="text-muted">No upcoming posts.</p>
              ) : (
                <ListGroup>
                  {upcoming.map((post) => (
                    <ListGroup.Item
                      key={post._id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{post.content.substring(0, 50)}...</strong>
                        <br />
                        <small className="text-muted">
                          Platforms: {post.platforms.join(", ")} | Due:{" "}
                          {new Date(post.scheduleDate).toLocaleString()}
                        </small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* By Platform Table */}
      {stats?.byPlatform && Object.keys(stats.byPlatform).length > 0 && (
        <Row className="mt-5">
          <Col xs={12}>
            <Card className="shadow">
              <Card.Header className="bg-info text-white">
                <h5>Posts by Platform</h5>
              </Card.Header>
              <Card.Body>
                <table className="table table-striped">
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
                          <td>{platform}</td>
                          <td>{count}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Dashboard;

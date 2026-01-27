import { Container, Row, Col, Card } from "react-bootstrap";

function Dashboard() {
  // Dummy data (later this will come from backend)
  const totalPosts = 20;
  const scheduledPosts = 8;
  const publishedPosts = 10;

  return (
    <Container className="mt-4">
      <Row className="g-4">
        {/* Total Posts */}
        <Col xs={12} md={4}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Total Posts</Card.Title>
              <h2>{totalPosts}</h2>
            </Card.Body>
          </Card>
        </Col>

        {/* Scheduled Posts */}
        <Col xs={12} md={4}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Scheduled Posts</Card.Title>
              <h2>{scheduledPosts}</h2>
            </Card.Body>
          </Card>
        </Col>

        {/* Published Posts */}
        <Col xs={12} md={4}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Published Posts</Card.Title>
              <h2>{publishedPosts}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;

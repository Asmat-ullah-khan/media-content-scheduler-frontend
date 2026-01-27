import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
} from "react-bootstrap";

function Dashboard() {
  // Dummy posts
  const [posts, setPosts] = useState([
    { id: 1, title: "Post One", status: "Scheduled" },
    { id: 2, title: "Post Two", status: "Published" },
    { id: 3, title: "Post Three", status: "Scheduled" },
    { id: 4, title: "Post Four", status: "Published" },
    { id: 5, title: "Post Five", status: "Scheduled" },
    { id: 6, title: "Post Six", status: "Published" },
  ]);

  // Pagination
  const postsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Modal state
  const [show, setShow] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Scheduled");

  const totalPosts = posts.length;
  const scheduledPosts = posts.filter((p) => p.status === "Scheduled").length;
  const publishedPosts = posts.filter((p) => p.status === "Published").length;

  const handleSave = () => {
    if (!title) return alert("Title is required");

    if (editPost) {
      setPosts(
        posts.map((p) => (p.id === editPost.id ? { ...p, title, status } : p)),
      );
    } else {
      setPosts([...posts, { id: Date.now(), title, status }]);
    }

    setShow(false);
    setEditPost(null);
    setTitle("");
    setStatus("Scheduled");
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <Container className="mt-4">
      {/* ===== CARDS ===== */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={4}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Total Posts</Card.Title>
              <h2>{totalPosts}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Scheduled Posts</Card.Title>
              <h2>{scheduledPosts}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="text-center shadow h-100">
            <Card.Body>
              <Card.Title>Published Posts</Card.Title>
              <h2>{publishedPosts}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ===== POSTS LIST ===== */}
      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">All Posts</h5>
            <Button onClick={() => setShow(true)}>Add Post</Button>
          </div>

          <div className="table-responsive">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post, index) => (
                  <tr key={post.id}>
                    <td>{indexOfFirstPost + index + 1}</td>
                    <td>{post.title}</td>
                    <td>{post.status}</td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setEditPost(post);
                          setTitle(post.title);
                          setStatus(post.status);
                          setShow(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={currentPage === i + 1 ? "primary" : "outline-primary"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* ===== MODAL ===== */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editPost ? "Edit Post" : "Add Post"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Post Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Scheduled</option>
                <option>Published</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Dashboard;

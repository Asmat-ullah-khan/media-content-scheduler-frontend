import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";

function Postlist() {
  // Dummy post data
  const initialPosts = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    content: `Post content ${i + 1}`,
    platform: ["Twitter", "Facebook"][i % 2],
    status: i % 3 === 0 ? "Published" : "Scheduled",
  }));

  const [posts, setPosts] = useState(initialPosts);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [newPlatform, setNewPlatform] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Pagination logic
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = posts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleCreate = () => {
    if (!newContent || !newPlatform) return alert("All fields are required");
    const newPost = {
      id: posts.length + 1,
      content: newContent,
      platform: newPlatform,
      status: "Scheduled",
    };
    setPosts([newPost, ...posts]);
    setNewContent("");
    setNewPlatform("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setShowModal(true);
  };

  const handleUpdate = () => {
    setPosts(
      posts.map((post) => (post.id === editPost.id ? { ...editPost } : post)),
    );
    setShowModal(false);
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3 text-center">Posts List</h3>

      {/* Create Post Form */}
      <Card className="p-3 mb-4 shadow">
        <Row className="g-2">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Post content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
            >
              <option value="">Select Platform</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={2}>
            <Button variant="primary" className="w-100" onClick={handleCreate}>
              Create
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Posts List */}
      <Row className="g-3">
        {currentPosts.map((post) => (
          <Col xs={12} md={6} lg={4} key={post.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{post.platform}</Card.Title>
                <Card.Text>{post.content}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">
                  Status: {post.status}
                </Card.Subtitle>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Pagination>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              type="text"
              value={editPost?.content || ""}
              onChange={(e) =>
                setEditPost({ ...editPost, content: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Platform</Form.Label>
            <Form.Select
              value={editPost?.platform || ""}
              onChange={(e) =>
                setEditPost({ ...editPost, platform: e.target.value })
              }
            >
              <option value="">Select Platform</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={editPost?.status || ""}
              onChange={(e) =>
                setEditPost({ ...editPost, status: e.target.value })
              }
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Published">Published</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Postlist;

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Pagination,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Postlist() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [content, setContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const navigate = useNavigate();

  const baseUrl = "https://social-media-content-scheduler-sigma.vercel.app";

  useEffect(() => {
    fetchPosts();
  }, [currentPage, postsPerPage, statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token. Redirecting to login...");
        navigate("/login");
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: postsPerPage,
      });
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await axios.get(`${baseUrl}/api/posts?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        setPosts(response.data.posts || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!content || selectedPlatforms.length === 0 || !scheduleDate) {
      alert("Content, platforms, and schedule date are required");
      return;
    }

    const date = new Date(scheduleDate);
    if (date <= new Date()) {
      alert("Schedule date must be in the future");
      return;
    }

    if (content.length > 500) {
      alert("Content must be max 500 characters");
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseUrl}/api/posts`,
        {
          content,
          platforms: selectedPlatforms,
          scheduleDate: date.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.status === "success") {
        setContent("");
        setSelectedPlatforms([]);
        setScheduleDate("");
        fetchPosts(); // Refresh list
        alert("Post created successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post.");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setSelectedPlatforms(post.platforms || []);
    setContent(post.content);
    setScheduleDate(
      post.scheduleDate
        ? new Date(post.scheduleDate).toISOString().slice(0, 16)
        : "",
    );
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!content || selectedPlatforms.length === 0 || !scheduleDate) {
      alert("Content, platforms, and schedule date are required");
      return;
    }

    const date = new Date(scheduleDate);
    if (date <= new Date()) {
      alert("Schedule date must be in the future");
      return;
    }

    if (content.length > 500) {
      alert("Content must be max 500 characters");
      return;
    }

    if (editPost.status === "published") {
      alert("Cannot edit published posts");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${baseUrl}/api/posts/${editPost._id}`,
        {
          content,
          platforms: selectedPlatforms,
          scheduleDate: date.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.status === "success") {
        setShowModal(false);
        fetchPosts(); // Refresh list
        alert("Post updated successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update post.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${baseUrl}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        fetchPosts(); // Refresh list
        alert("Post deleted successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  if (loading) {
    return (
      <Container className="mt-4 d-flex justify-content-center">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchPosts} variant="primary">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-3 text-center">Posts List</h3>

      {/* Create Post Form */}
      <Card className="p-3 mb-4 shadow">
        <h5>Create New Post</h5>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Post content (max 500 chars)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
            />
            <small className="text-muted">{content.length}/500</small>
          </Col>
          <Col xs={12} md={3}>
            <Form.Label>Platforms (Multi-Select)</Form.Label>
            <div>
              {["Twitter", "Facebook", "Instagram"].map((platform) => (
                <Form.Check
                  key={platform}
                  type="checkbox"
                  label={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                />
              ))}
            </div>
          </Col>
          <Col xs={12} md={2}>
            <Form.Label>Schedule Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </Col>
          <Col xs={12} md={1}>
            <Button
              variant="primary"
              className="w-100 mt-4"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Posts List */}
      <Row className="g-3">
        {posts.map((post) => (
          <Col xs={12} md={6} lg={4} key={post._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{post.platforms.join(", ")}</Card.Title>
                <Card.Text>{post.content}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">
                  Due: {new Date(post.scheduleDate).toLocaleString()}
                </Card.Subtitle>
                <Badge
                  bg={
                    post.status === "published"
                      ? "success"
                      : post.status === "scheduled"
                        ? "warning"
                        : "secondary"
                  }
                >
                  {post.status}
                </Badge>
                <div className="mt-2">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(post)}
                    disabled={post.status === "published"}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(post._id)}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Platforms (Multi-Select)</Form.Label>
            {["Twitter", "Facebook", "Instagram"].map((platform) => (
              <Form.Check
                key={platform}
                type="checkbox"
                label={platform}
                checked={selectedPlatforms.includes(platform)}
                onChange={() => handlePlatformChange(platform)}
              />
            ))}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Schedule Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Postlist;

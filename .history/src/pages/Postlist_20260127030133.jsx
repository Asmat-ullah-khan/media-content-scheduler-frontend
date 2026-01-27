import { useState, useEffect, useCallback } from "react";
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
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS

function Postlist() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Per-post deleting state
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [content, setContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const navigate = useNavigate();

  const baseUrl = "https://social-media-content-scheduler-sigma.vercel.app";

  const fetchPosts = useCallback(async () => {
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
  }, [currentPage, postsPerPage, statusFilter, navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const resetCreateForm = () => {
    setContent("");
    setSelectedPlatforms([]);
    setScheduleDate("");
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
        resetCreateForm();
        setShowCreateModal(false);
        setCurrentPage(1);
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
    setShowEditModal(true);
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
        setShowEditModal(false);
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

    setDeletingId(id); // Set per-post deleting state
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${baseUrl}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        // Optimistic remove: Filter out the post immediately
        const updatedPosts = posts.filter((post) => post._id !== id);
        setPosts(updatedPosts);

        // Adjust totalPages if necessary
        const newTotal = Math.max(
          1,
          Math.ceil((totalPages * postsPerPage - postsPerPage) / postsPerPage),
        );
        setTotalPages(newTotal);

        // If last post on page, go to previous page
        if (updatedPosts.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        alert("Post deleted successfully!"); // Ensure alert is visible

        // Fallback refetch if optimistic fails (e.g., ID mismatch)
        setTimeout(() => fetchPosts(), 500);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post.");
      // Always refetch on error to rollback
      fetchPosts();
    } finally {
      setDeletingId(null);
    }
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePostsPerPage = (e) => {
    setPostsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Container className="mt-4 d-flex justify-content-center align-items-center min-vh-50">
        <Spinner animation="border" role="status" size="lg">
          <span className="visually-hidden">Loading posts...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={fetchPosts}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center fw-bold text-dark">Posts List</h2>

      {/* Create Post Button */}
      <div className="text-end mb-4">
        <Button
          variant="success"
          className="rounded-pill px-4 py-2 fw-semibold"
          onClick={() => {
            resetCreateForm();
            setShowCreateModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create New Post
        </Button>
      </div>

      {/* Filters & Pagination Controls */}
      <Card className="mb-4 shadow-sm border-0 rounded-3">
        <Card.Body className="p-3">
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Label className="fw-semibold text-dark">
                Filter by Status
              </Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="rounded-3"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="failed">Failed</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="fw-semibold text-dark">
                Posts per Page
              </Form.Label>
              <Form.Select
                value={postsPerPage}
                onChange={handlePostsPerPage}
                className="rounded-3"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </Form.Select>
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant="outline-primary"
                className="rounded-pill px-4 fw-semibold"
                onClick={() => {
                  setCurrentPage(1);
                  fetchPosts();
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh List
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Posts Grid */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold text-dark mb-0">
            Showing {posts.length} of {totalPages * postsPerPage} posts
          </h6>
          <small className="text-muted">Filtered by: {statusFilter}</small>
        </div>
        <Row className="g-4">
          {posts.length === 0 ? (
            <Col xs={12}>
              <Alert variant="info" className="text-center rounded-3">
                <h6 className="mb-2">No posts found</h6>
                <p className="mb-3">Start by creating your first post!</p>
                <Button
                  variant="outline-info"
                  className="rounded-pill px-4"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Now
                </Button>
              </Alert>
            </Col>
          ) : (
            posts.map((post) => (
              <Col xs={12} md={6} lg={4} key={post._id}>
                <Card
                  className="h-100 shadow-sm border-0 rounded-3 overflow-hidden transition-all"
                  style={{ transition: "box-shadow 0.3s ease" }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Card.Title
                        className="fw-bold text-dark mb-0"
                        style={{ fontSize: "1rem" }}
                      >
                        {post.platforms.join(" • ")}
                      </Card.Title>
                      <Badge
                        bg={
                          post.status === "published"
                            ? "success"
                            : post.status === "scheduled"
                              ? "warning"
                              : post.status === "draft"
                                ? "secondary"
                                : "danger"
                        }
                        className="rounded-pill px-3 py-1 fw-semibold"
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </Badge>
                    </div>
                    <Card.Text
                      className="text-dark mb-3 lh-sm"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {post.content.length > 100
                        ? post.content.substring(0, 100) + "..."
                        : post.content}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-end mb-3">
                      <small className="text-muted">
                        <i className="bi bi-calendar-event me-1"></i>
                        {new Date(
                          post.scheduleDate,
                        ).toLocaleDateString()} at{" "}
                        {new Date(post.scheduleDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-clock-history me-1"></i>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="rounded-pill px-3 py-1 fw-semibold border-2 transition-all"
                        onClick={() => handleEdit(post)}
                        disabled={post.status === "published"}
                        style={{
                          borderColor:
                            post.status === "published" ? "#6c757d" : "#ffc107",
                        }}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-3 py-1 fw-semibold border-2 transition-all"
                        onClick={() => handleDelete(post._id)}
                        disabled={deletingId === post._id}
                        style={{
                          borderColor:
                            deletingId === post._id ? "#6c757d" : "#dc3545",
                        }}
                      >
                        <i className="bi bi-trash me-1"></i>
                        {deletingId === post._id ? (
                          <>
                            <Spinner
                              size="sm"
                              animation="border"
                              className="me-1"
                            />
                            Deleting
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5 mb-4">
          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
                className="rounded-pill mx-1"
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
      )}

      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header
          closeButton
          className="bg-light border-bottom-0 rounded-top-3"
        >
          <Modal.Title className="fw-bold text-dark">
            <i className="bi bi-plus-circle me-2"></i>
            Create New Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-3">
            <Col md={8}>
              <Form.Label className="fw-semibold text-dark">
                Content (max 500 chars)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                className="rounded-3 border-primary"
                style={{
                  borderColor: content.length > 450 ? "red" : "lightblue",
                }}
              />
              <small
                className={`text-${content.length > 450 ? "danger" : "muted"}`}
              >
                {content.length}/500 characters
              </small>
            </Col>
            <Col md={4}>
              <Form.Label className="fw-semibold text-dark">
                Platforms (Multi-Select)
              </Form.Label>
              <div className="d-flex flex-column gap-2 p-3 border rounded-3 bg-light">
                {["Twitter", "Facebook", "Instagram"].map((platform) => (
                  <Form.Check
                    key={platform}
                    type="checkbox"
                    label={
                      <span className="d-flex align-items-center">
                        <Badge bg="info" className="me-2">
                          {platform}
                        </Badge>
                        <small className="text-muted">Enable {platform}</small>
                      </span>
                    }
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                    className="mb-1"
                  />
                ))}
              </div>
              <small className="text-muted">
                Selected: {selectedPlatforms.length}/3
              </small>
            </Col>
            <Col xs={12}>
              <Form.Label className="fw-semibold text-dark">
                Schedule Date & Time
              </Form.Label>
              <Form.Control
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="rounded-3 border-warning"
              />
              <small className="text-muted">Must be future date</small>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top-0 rounded-bottom-3">
          <Button
            variant="secondary"
            className="rounded-pill px-4"
            onClick={() => {
              setShowCreateModal(false);
              resetCreateForm();
            }}
          >
            <i className="bi bi-x-circle me-1"></i>
            Cancel
          </Button>
          <Button
            variant="success"
            className="rounded-pill px-4 fw-semibold"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Creating...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-1"></i>
                Create Post
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header
          closeButton
          className="bg-light border-bottom-0 rounded-top-3"
        >
          <Modal.Title className="fw-bold text-dark">
            <i className="bi bi-pencil-square me-2"></i>
            Edit Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-3">
            <Col md={8}>
              <Form.Label className="fw-semibold text-dark">
                Content (max 500 chars)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Update post content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                className="rounded-3 border-primary"
                style={{
                  borderColor: content.length > 450 ? "red" : "lightblue",
                }}
              />
              <small
                className={`text-${content.length > 450 ? "danger" : "muted"}`}
              >
                {content.length}/500 characters
              </small>
            </Col>
            <Col md={4}>
              <Form.Label className="fw-semibold text-dark">
                Platforms (Multi-Select)
              </Form.Label>
              <div className="d-flex flex-column gap-2 p-3 border rounded-3 bg-light">
                {["Twitter", "Facebook", "Instagram"].map((platform) => (
                  <Form.Check
                    key={platform}
                    type="checkbox"
                    label={
                      <span className="d-flex align-items-center">
                        <Badge bg="info" className="me-2">
                          {platform}
                        </Badge>
                        <small className="text-muted">Enable {platform}</small>
                      </span>
                    }
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                    className="mb-1"
                  />
                ))}
              </div>
              <small className="text-muted">
                Selected: {selectedPlatforms.length}/3
              </small>
            </Col>
            <Col xs={12}>
              <Form.Label className="fw-semibold text-dark">
                Schedule Date & Time
              </Form.Label>
              <Form.Control
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="rounded-3 border-warning"
              />
              <small className="text-muted">Must be future date</small>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top-0 rounded-bottom-3">
          <Button
            variant="secondary"
            className="rounded-pill px-4"
            onClick={() => {
              setShowEditModal(false);
              setEditPost(null);
            }}
          >
            <i className="bi bi-x-circle me-1"></i>
            Cancel
          </Button>
          <Button
            variant="success"
            className="rounded-pill px-4 fw-semibold"
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Update Post
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Postlist;

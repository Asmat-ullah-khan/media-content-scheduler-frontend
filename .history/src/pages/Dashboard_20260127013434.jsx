import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Form,
  Button,
  Pagination,
  Alert,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("all"); // Filter: all, scheduled, published, draft, failed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const baseUrl = "https://social-media-content-scheduler-sigma.vercel.app";

  useEffect(() => {
    fetchPosts();
  }, [currentPage, limit, status]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit,
      });
      if (status !== "all") {
        params.append("status", status);
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
      const message =
        err.response?.data?.message ||
        "Failed to fetch posts. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Container className="mt-4 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading posts...</span>
        </Spinner>
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
      <Row className="mb-4">
        <Col md={4}>
          <Form.Label>Filter by Status</Form.Label>
          <Form.Select value={status} onChange={handleStatusChange}>
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label>Posts per Page</Form.Label>
          <Form.Select value={limit} onChange={handleLimitChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Form.Select>
        </Col>
      </Row>

      {posts.length === 0 ? (
        <Alert variant="info">
          No posts found.{" "}
          <Button variant="link" onClick={() => navigate("/posts/create")}>
            Create one
          </Button>
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow">
          <thead>
            <tr>
              <th>ID</th>
              <th>Content</th>
              <th>Platforms</th>
              <th>Schedule Date</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post._id.substring(0, 8)}...</td>
                <td>{post.content.substring(0, 50)}...</td>
                <td>{post.platforms.join(", ")}</td>
                <td>{new Date(post.scheduleDate).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge bg-${post.status === "published" ? "success" : post.status === "scheduled" ? "warning" : "secondary"}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/posts/edit/${post._id}`)}
                    disabled={post.status === "published"}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-1"
                    onClick={() => {
                      if (window.confirm("Delete this post?")) {
                        // Add delete API call here
                        alert("Post deleted!"); // Placeholder
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination */}
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}

export default PostsList;

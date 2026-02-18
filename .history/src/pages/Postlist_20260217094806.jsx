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
import "bootstrap/dist/css/bootstrap.min.css";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root {
    --ink: #0f0e0c;
    --cream: #f7f3ee;
    --warm-white: #fdfbf8;
    --sand: #e8e0d5;
    --taupe: #c4b8a8;
    --amber: #c9853a;
    --amber-light: #e8a855;
    --amber-dim: #f5deb8;
    --sage: #5a7a5e;
    --sage-light: #a8c4ab;
    --rose-red: #b84040;
    --rose-dim: #f0d0d0;
    --slate: #4a5568;
    --slate-light: #cbd5e0;
    --shadow-soft: 0 2px 16px rgba(15,14,12,0.08);
    --shadow-lift: 0 8px 32px rgba(15,14,12,0.14);
    --shadow-deep: 0 16px 48px rgba(15,14,12,0.18);
    --radius: 16px;
    --radius-sm: 10px;
    --radius-pill: 999px;
  }

  * { box-sizing: border-box; }

  body {
    background-color: var(--cream) !important;
    font-family: 'DM Sans', sans-serif !important;
    color: var(--ink) !important;
  }

  /* ── PAGE WRAPPER ─────────────────────────────────── */
  .pl-page {
    min-height: 100vh;
    background: var(--cream);
    padding: 2.5rem 0 5rem;
    position: relative;
  }

  .pl-page::before {
    content: '';
    position: fixed;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,133,58,0.10) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .pl-page::after {
    content: '';
    position: fixed;
    bottom: -150px;
    left: -150px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(90,122,94,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── HEADING ─────────────────────────────────────── */
  .pl-heading {
    font-family: 'DM Serif Display', serif !important;
    font-size: 2.6rem !important;
    font-weight: 400 !important;
    letter-spacing: -0.02em;
    color: var(--ink) !important;
    margin-bottom: 0.25rem !important;
  }

  .pl-heading-sub {
    font-size: 0.9rem;
    color: var(--taupe);
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 2.5rem;
  }

  /* ── TOOLBAR CARD ────────────────────────────────── */
  .pl-toolbar {
    background: var(--warm-white) !important;
    border: 1.5px solid var(--sand) !important;
    border-radius: var(--radius) !important;
    box-shadow: var(--shadow-soft) !important;
    margin-bottom: 2rem !important;
  }

  .pl-toolbar .card-body {
    padding: 1.25rem 1.5rem !important;
  }

  .pl-label {
    font-size: 0.72rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: var(--taupe) !important;
    margin-bottom: 0.45rem !important;
    display: block;
  }

  .pl-select {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.88rem !important;
    font-weight: 500 !important;
    color: var(--ink) !important;
    background: var(--cream) !important;
    border: 1.5px solid var(--sand) !important;
    border-radius: var(--radius-sm) !important;
    padding: 0.55rem 0.9rem !important;
    transition: border-color 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }

  .pl-select:focus {
    border-color: var(--amber) !important;
    box-shadow: 0 0 0 3px rgba(201,133,58,0.15) !important;
    outline: none !important;
  }

  /* ── BUTTONS ─────────────────────────────────────── */
  .pl-btn-primary {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.88rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.02em;
    background: var(--ink) !important;
    color: var(--cream) !important;
    border: none !important;
    border-radius: var(--radius-pill) !important;
    padding: 0.6rem 1.5rem !important;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(15,14,12,0.2);
  }

  .pl-btn-primary:hover {
    background: #282420 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(15,14,12,0.25) !important;
  }

  .pl-btn-primary:active {
    transform: translateY(0);
  }

  .pl-btn-refresh {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    background: transparent !important;
    color: var(--slate) !important;
    border: 1.5px solid var(--sand) !important;
    border-radius: var(--radius-pill) !important;
    padding: 0.55rem 1.3rem !important;
    transition: all 0.2s;
  }

  .pl-btn-refresh:hover {
    border-color: var(--taupe) !important;
    background: var(--sand) !important;
    color: var(--ink) !important;
  }

  /* ── POST CARDS ───────────────────────────────────── */
  .pl-post-card {
    background: var(--warm-white) !important;
    border: 1.5px solid var(--sand) !important;
    border-radius: var(--radius) !important;
    box-shadow: var(--shadow-soft) !important;
    transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s !important;
    overflow: hidden !important;
  }

  .pl-post-card:hover {
    box-shadow: var(--shadow-lift) !important;
    transform: translateY(-3px);
    border-color: var(--taupe) !important;
  }

  .pl-post-card .card-body {
    padding: 1.5rem !important;
  }

  .pl-platform-name {
    font-family: 'DM Serif Display', serif !important;
    font-size: 1.05rem !important;
    font-weight: 400 !important;
    color: var(--ink) !important;
    letter-spacing: -0.01em;
  }

  .pl-post-content {
    font-size: 0.9rem !important;
    color: #5a534a !important;
    line-height: 1.65 !important;
    margin-bottom: 1.1rem !important;
  }

  .pl-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-top: 1px solid var(--sand);
    border-bottom: 1px solid var(--sand);
    margin-bottom: 1rem;
  }

  .pl-meta-text {
    font-size: 0.75rem !important;
    color: var(--taupe) !important;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  /* ── BADGES ──────────────────────────────────────── */
  .pl-badge {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.68rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.07em !important;
    text-transform: uppercase !important;
    border-radius: var(--radius-pill) !important;
    padding: 0.3rem 0.75rem !important;
  }

  .pl-badge-published {
    background: var(--sage) !important;
    color: #fff !important;
  }

  .pl-badge-scheduled {
    background: var(--amber-dim) !important;
    color: #7a4e10 !important;
  }

  .pl-badge-draft {
    background: var(--sand) !important;
    color: var(--slate) !important;
  }

  .pl-badge-failed {
    background: var(--rose-dim) !important;
    color: var(--rose-red) !important;
  }

  /* ── ACTION BUTTONS (card) ───────────────────────── */
  .pl-btn-edit {
    font-size: 0.78rem !important;
    font-weight: 600 !important;
    font-family: 'DM Sans', sans-serif !important;
    background: transparent !important;
    color: var(--amber) !important;
    border: 1.5px solid var(--amber) !important;
    border-radius: var(--radius-pill) !important;
    padding: 0.35rem 1rem !important;
    transition: all 0.18s;
  }

  .pl-btn-edit:hover:not(:disabled) {
    background: var(--amber) !important;
    color: #fff !important;
  }

  .pl-btn-edit:disabled {
    opacity: 0.35 !important;
    cursor: not-allowed;
  }

  .pl-btn-delete {
    font-size: 0.78rem !important;
    font-weight: 600 !important;
    font-family: 'DM Sans', sans-serif !important;
    background: transparent !important;
    color: var(--rose-red) !important;
    border: 1.5px solid var(--rose-red) !important;
    border-radius: var(--radius-pill) !important;
    padding: 0.35rem 1rem !important;
    transition: all 0.18s;
  }

  .pl-btn-delete:hover:not(:disabled) {
    background: var(--rose-red) !important;
    color: #fff !important;
  }

  .pl-btn-delete:disabled {
    opacity: 0.45 !important;
    cursor: not-allowed;
  }

  /* ── EMPTY STATE ─────────────────────────────────── */
  .pl-empty {
    background: var(--warm-white) !important;
    border: 2px dashed var(--sand) !important;
    border-radius: var(--radius) !important;
    padding: 3rem 2rem !important;
    text-align: center;
    color: var(--taupe) !important;
  }

  .pl-empty h6 {
    font-family: 'DM Serif Display', serif !important;
    font-size: 1.4rem !important;
    font-weight: 400 !important;
    color: var(--ink) !important;
    margin-bottom: 0.5rem !important;
  }

  .pl-empty p {
    font-size: 0.9rem;
    color: var(--taupe);
    margin-bottom: 1.5rem !important;
  }

  /* ── PAGINATION ──────────────────────────────────── */
  .pl-pagination .page-item .page-link {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.82rem !important;
    font-weight: 600 !important;
    color: var(--slate) !important;
    background: var(--warm-white) !important;
    border: 1.5px solid var(--sand) !important;
    border-radius: var(--radius-sm) !important;
    margin: 0 3px;
    padding: 0.45rem 0.85rem !important;
    transition: all 0.18s;
  }

  .pl-pagination .page-item.active .page-link {
    background: var(--ink) !important;
    border-color: var(--ink) !important;
    color: var(--cream) !important;
  }

  .pl-pagination .page-item .page-link:hover {
    background: var(--sand) !important;
    color: var(--ink) !important;
    border-color: var(--taupe) !important;
  }

  .pl-pagination .page-item.disabled .page-link {
    opacity: 0.35 !important;
  }

  /* ── MODAL ───────────────────────────────────────── */
  .pl-modal .modal-content {
    border: none !important;
    border-radius: var(--radius) !important;
    overflow: hidden;
    box-shadow: var(--shadow-deep) !important;
    background: var(--warm-white) !important;
  }

  .pl-modal .modal-header {
    background: var(--cream) !important;
    border-bottom: 1.5px solid var(--sand) !important;
    padding: 1.4rem 1.75rem !important;
  }

  .pl-modal .modal-title {
    font-family: 'DM Serif Display', serif !important;
    font-size: 1.35rem !important;
    font-weight: 400 !important;
    color: var(--ink) !important;
    letter-spacing: -0.01em;
  }

  .pl-modal .modal-body {
    padding: 1.75rem !important;
    background: var(--warm-white) !important;
  }

  .pl-modal .modal-footer {
    background: var(--cream) !important;
    border-top: 1.5px solid var(--sand) !important;
    padding: 1.1rem 1.75rem !important;
  }

  .pl-modal .btn-close {
    opacity: 0.4;
    transition: opacity 0.2s;
  }

  .pl-modal .btn-close:hover {
    opacity: 0.8;
  }

  /* ── MODAL FORM ELEMENTS ─────────────────────────── */
  .pl-modal .form-label {
    font-size: 0.72rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: var(--taupe) !important;
    margin-bottom: 0.45rem !important;
  }

  .pl-modal textarea.form-control,
  .pl-modal input.form-control {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.9rem !important;
    color: var(--ink) !important;
    background: var(--cream) !important;
    border: 1.5px solid var(--sand) !important;
    border-radius: var(--radius-sm) !important;
    padding: 0.75rem 1rem !important;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: none;
  }

  .pl-modal textarea.form-control:focus,
  .pl-modal input.form-control:focus {
    border-color: var(--amber) !important;
    box-shadow: 0 0 0 3px rgba(201,133,58,0.15) !important;
    outline: none !important;
    background: var(--warm-white) !important;
  }

  .pl-platform-box {
    background: var(--cream) !important;
    border: 1.5px solid var(--sand) !important;
    border-radius: var(--radius-sm) !important;
    padding: 1rem 1.1rem !important;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .pl-platform-check .form-check-input {
    width: 1.1rem !important;
    height: 1.1rem !important;
    border: 2px solid var(--taupe) !important;
    border-radius: 4px !important;
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 0.1rem;
  }

  .pl-platform-check .form-check-input:checked {
    background-color: var(--amber) !important;
    border-color: var(--amber) !important;
  }

  .pl-platform-check .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(201,133,58,0.2) !important;
  }

  .pl-platform-check .form-check-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .pl-platform-badge {
    font-size: 0.65rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.06em !important;
    text-transform: uppercase !important;
    background: var(--ink) !important;
    color: var(--cream) !important;
    border-radius: var(--radius-pill) !important;
    padding: 0.22rem 0.65rem !important;
  }

  .pl-hint {
    font-size: 0.72rem !important;
    color: var(--taupe) !important;
    margin-top: 0.35rem !important;
  }

  .pl-char-ok { color: var(--taupe) !important; font-size: 0.72rem !important; }
  .pl-char-warn { color: var(--rose-red) !important; font-size: 0.72rem !important; }

  /* ── MODAL BUTTONS ───────────────────────────────── */
  .pl-modal-cancel {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    background: transparent !important;
    color: var(--slate) !important;
    border: 1.5px solid var(--sand) !important;
    border-radius: var(--radius-pill) !important;
    padding: 0.55rem 1.3rem !important;
    transition: all 0.18s;
  }

  .pl-modal-cancel:hover {
    background: var(--sand) !important;
    color: var(--ink) !important;
  }

  .pl-modal-confirm {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    background: var(--ink) !important;
    color: var(--cream) !important;
    border: none !important;
    border-radius: var(--radius-pill) !important;
    padding: 0.55rem 1.5rem !important;
    transition: all 0.2s;
    box-shadow: 0 2px 10px rgba(15,14,12,0.2);
  }

  .pl-modal-confirm:hover:not(:disabled) {
    background: #282420 !important;
    transform: translateY(-1px);
    box-shadow: 0 5px 18px rgba(15,14,12,0.28) !important;
  }

  .pl-modal-confirm:disabled {
    opacity: 0.55 !important;
    cursor: not-allowed;
  }

  /* ── SPINNER ─────────────────────────────────────── */
  .spinner-border {
    color: var(--amber) !important;
    width: 2.5rem !important;
    height: 2.5rem !important;
    border-width: 3px !important;
  }

  /* ── ERROR ALERT ─────────────────────────────────── */
  .pl-alert-error {
    background: var(--rose-dim) !important;
    border: 1.5px solid #e8b0b0 !important;
    border-radius: var(--radius) !important;
    color: var(--rose-red) !important;
    font-weight: 500;
  }

  /* ── STATS ROW ───────────────────────────────────── */
  .pl-stats-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--slate);
  }

  .pl-stats-filter {
    font-size: 0.75rem;
    color: var(--taupe);
    font-style: italic;
  }

  /* ── DIVIDER ─────────────────────────────────────── */
  .pl-section-divider {
    height: 1px;
    background: var(--sand);
    margin: 0.5rem 0 1.75rem;
  }
`;

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
  const [deletingId, setDeletingId] = useState(null);
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
        fetchPosts();
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
        fetchPosts();
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

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${baseUrl}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        const updatedPosts = posts.filter((post) => post._id !== id);
        setPosts(updatedPosts);

        const newTotal = Math.max(
          1,
          Math.ceil((totalPages * postsPerPage - postsPerPage) / postsPerPage),
        );
        setTotalPages(newTotal);

        if (updatedPosts.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        alert("Post deleted successfully!");

        setTimeout(() => fetchPosts(), 500);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post.");

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

  const getBadgeClass = (status) => {
    if (status === "published") return "pl-badge pl-badge-published";
    if (status === "scheduled") return "pl-badge pl-badge-scheduled";
    if (status === "draft") return "pl-badge pl-badge-draft";
    return "pl-badge pl-badge-failed";
  };

  const FormFields = () => (
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
        />
        <small className={content.length > 450 ? "pl-char-warn" : "pl-char-ok"}>
          {content.length}/500 characters
        </small>
      </Col>
      <Col md={4}>
        <Form.Label className="fw-semibold text-dark">Platforms</Form.Label>
        <div className="pl-platform-box">
          {["Twitter", "Facebook", "Instagram"].map((platform) => (
            <Form.Check
              key={platform}
              type="checkbox"
              className="pl-platform-check"
              label={
                <span className="d-flex align-items-center gap-2">
                  <Badge className="pl-platform-badge">{platform}</Badge>
                  <small style={{ color: "#8a8278", fontSize: "0.78rem" }}>
                    Enable
                  </small>
                </span>
              }
              checked={selectedPlatforms.includes(platform)}
              onChange={() => handlePlatformChange(platform)}
            />
          ))}
        </div>
        <small className="pl-hint">{selectedPlatforms.length}/3 selected</small>
      </Col>
      <Col xs={12}>
        <Form.Label className="fw-semibold text-dark">
          Schedule Date & Time
        </Form.Label>
        <Form.Control
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
        />
        <small className="pl-hint">Must be a future date & time</small>
      </Col>
    </Row>
  );

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div
          className="pl-page d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading posts...</span>
          </Spinner>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <Container className="mt-5">
          <Alert className="pl-alert-error">
            {error}
            <Button
              size="sm"
              className="ms-3 pl-btn-refresh"
              onClick={fetchPosts}
            >
              Retry
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="pl-page">
        <Container>
          {/* ── HEADER ── */}
          <div className="text-center mb-1">
            <h2 className="pl-heading">Posts</h2>
            <p className="pl-heading-sub">Content Scheduler</p>
          </div>

          {/* ── CREATE BUTTON ── */}
          <div className="text-end mb-3">
            <Button
              className="pl-btn-primary"
              onClick={() => {
                resetCreateForm();
                setShowCreateModal(true);
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create New Post
            </Button>
          </div>

          {/* ── TOOLBAR ── */}
          <Card className="pl-toolbar">
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={3}>
                  <span className="pl-label">Filter by Status</span>
                  <Form.Select
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    className="pl-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="failed">Failed</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <span className="pl-label">Posts per Page</span>
                  <Form.Select
                    value={postsPerPage}
                    onChange={handlePostsPerPage}
                    className="pl-select"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </Form.Select>
                </Col>
                <Col md={6} className="text-end">
                  <Button
                    className="pl-btn-refresh"
                    onClick={() => {
                      setCurrentPage(1);
                      fetchPosts();
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ── STATS ROW ── */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="pl-stats-label">
              Showing {posts.length} of {totalPages * postsPerPage} posts
            </span>
            <span className="pl-stats-filter">Filtered by: {statusFilter}</span>
          </div>
          <div className="pl-section-divider" />

          {/* ── POST GRID ── */}
          <Row className="g-4">
            {posts.length === 0 ? (
              <Col xs={12}>
                <div className="pl-empty">
                  <h6>No posts found</h6>
                  <p>Start by creating your first post!</p>
                  <Button
                    className="pl-btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Now
                  </Button>
                </div>
              </Col>
            ) : (
              posts.map((post) => (
                <Col xs={12} md={6} lg={4} key={post._id}>
                  <Card className="pl-post-card h-100">
                    <Card.Body>
                      {/* Platform + Badge */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="pl-platform-name">
                          {post.platforms.join(" · ")}
                        </span>
                        <span className={getBadgeClass(post.status)}>
                          {post.status.charAt(0).toUpperCase() +
                            post.status.slice(1)}
                        </span>
                      </div>

                      {/* Content */}
                      <p className="pl-post-content">
                        {post.content.length > 100
                          ? post.content.substring(0, 100) + "…"
                          : post.content}
                      </p>

                      {/* Meta */}
                      <div className="pl-meta-row">
                        <span className="pl-meta-text">
                          <i className="bi bi-calendar-event"></i>
                          {new Date(
                            post.scheduleDate,
                          ).toLocaleDateString()} ·{" "}
                          {new Date(post.scheduleDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="pl-meta-text">
                          <i className="bi bi-clock-history"></i>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-2">
                        <Button
                          className="pl-btn-edit"
                          onClick={() => handleEdit(post)}
                          disabled={post.status === "published"}
                        >
                          <i className="bi bi-pencil me-1"></i>Edit
                        </Button>
                        <Button
                          className="pl-btn-delete"
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id}
                        >
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
                            <>
                              <i className="bi bi-trash me-1"></i>Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5 mb-4">
              <Pagination className="pl-pagination mb-0">
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
          )}
        </Container>
      </div>

      {/* ── CREATE MODAL ── */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
        backdrop="static"
        className="pl-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Create New Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormFields />
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="pl-modal-cancel"
            onClick={() => {
              setShowCreateModal(false);
              resetCreateForm();
            }}
          >
            <i className="bi bi-x-circle me-1"></i>Cancel
          </Button>
          <Button
            className="pl-modal-confirm"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Creating…
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-1"></i>Create Post
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── EDIT MODAL ── */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
        backdrop="static"
        className="pl-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Edit Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormFields />
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="pl-modal-cancel"
            onClick={() => {
              setShowEditModal(false);
              setEditPost(null);
            }}
          >
            <i className="bi bi-x-circle me-1"></i>Cancel
          </Button>
          <Button
            className="pl-modal-confirm"
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Updating…
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-1"></i>Update Post
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Postlist;

import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0e0e0e;
    --paper: #f5f2eb;
    --cream: #ede9df;
    --gold: #c9a84c;
    --gold-light: #e8d5a3;
    --muted: #8a8177;
    --border: #d5cfc4;
  }

  .app-navbar {
    background: var(--ink) !important;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .app-navbar .container {
    height: 58px;
    display: flex;
    align-items: center;
  }

  /* Brand */
  .app-navbar .navbar-brand {
    font-family: 'DM Serif Display', serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--paper) !important;
    letter-spacing: 0.01em;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0;
    transition: opacity 0.2s ease;
  }

  .app-navbar .navbar-brand:hover {
    opacity: 0.85;
  }

  .brand-dot {
    width: 6px;
    height: 6px;
    background: var(--gold);
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  /* Toggle */
  .app-navbar .navbar-toggler {
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 2px;
    padding: 0.3rem 0.55rem;
    color: var(--paper);
  }

  .app-navbar .navbar-toggler:focus {
    box-shadow: none;
    border-color: var(--gold);
  }

  .app-navbar .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(245,242,235,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  }

  /* Nav links */
  .app-navbar .nav-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(245,242,235,0.55) !important;
    padding: 0 1.1rem !important;
    height: 58px;
    display: flex;
    align-items: center;
    position: relative;
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;
  }

  .app-navbar .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1.1rem;
    right: 1.1rem;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transition: transform 0.25s ease;
    transform-origin: left;
  }

  .app-navbar .nav-link:hover {
    color: var(--paper) !important;
  }

  .app-navbar .nav-link:hover::after {
    transform: scaleX(1);
  }

  /* Logout link — styled distinctly */
  .app-navbar .nav-link.logout-link {
    color: rgba(201,168,76,0.6) !important;
    margin-left: 0.5rem;
    padding-left: 1rem !important;
    border-left: 1px solid rgba(255,255,255,0.08);
  }

  .app-navbar .nav-link.logout-link:hover {
    color: var(--gold) !important;
  }

  .app-navbar .nav-link.logout-link::after {
    background: var(--gold);
    left: 1rem;
  }

  /* Divider between brand and nav on large screens */
  .nav-rule {
    flex: 1;
  }

  /* Collapsed mobile menu */
  @media (max-width: 991px) {
    .app-navbar .container {
      height: auto;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .app-navbar .navbar-collapse {
      border-top: 1px solid rgba(255,255,255,0.06);
      margin-top: 0.6rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .app-navbar .nav-link {
      height: auto;
      padding: 0.6rem 0.2rem !important;
      border-left: none;
    }

    .app-navbar .nav-link::after {
      bottom: auto;
      top: 50%;
      transform: translateY(-50%) scaleX(0);
      left: -0.6rem;
      right: auto;
      width: 2px;
      height: 1rem;
    }

    .app-navbar .nav-link:hover::after {
      transform: translateY(-50%) scaleX(1);
    }

    .app-navbar .nav-link.logout-link {
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.06);
      margin-left: 0;
      padding-left: 0.2rem !important;
      margin-top: 0.3rem;
      padding-top: 0.8rem;
    }
  }
`;

function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{styles}</style>
      <Navbar className="app-navbar" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="brand-dot" />
            Post Scheduler
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <div className="nav-rule" />
            <Nav>
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>

              <Nav.Link as={Link} to="/posts">
                List of Posts
              </Nav.Link>

              <Nav.Link className="logout-link" onClick={handleLogout}>
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AppNavbar;

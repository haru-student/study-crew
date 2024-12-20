import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { signIn, signOut } from './Login';

function Header({ user }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-5">
      <Container>
        <Navbar.Brand as={Link} to="/">Study Crew</Navbar.Brand>  {/* ブランドをLinkに変更 */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">ホーム</Nav.Link>  {/* Nav.LinkをLinkに変更 */}
            {user && (
              <Nav.Link as={Link} to={`/user/${user.uid}`}>マイページ</Nav.Link>
            )}
            <Nav.Link as={Link} to={`/meetsup`}>勉強会を探す</Nav.Link>
            <Nav.Link as={Link} to={`/chatgroup`}>グループチャット</Nav.Link>
          </Nav>
          {user ? (
            <Button className="btn-danger" onClick={signOut}>
              サインアウト
            </Button>
          ) : (
            <Button onClick={signIn}>
              サインイン
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

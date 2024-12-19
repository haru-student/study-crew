import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { signIn, signOut } from './Login';

function Header({ user }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-5">
      <Container>
        <Navbar.Brand href="#home">Study Crew</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
          {user ? (
            <Button onClick={signOut}>
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

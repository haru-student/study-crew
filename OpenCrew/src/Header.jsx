import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import  Login  from './Login';

function Header({ user }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-5 w-100 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className='title'>Open Crew</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">ホーム</Nav.Link>
            <Nav.Link as={Link} to={`/meetsup`}>イベントを探す</Nav.Link>
          </Nav>
          <Login />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

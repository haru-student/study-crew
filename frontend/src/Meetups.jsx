import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Nosession from './Nosession';
import Newsession from './Newsession';

function Meetups({user}) {
  return <Newsession user={user}/>
}

export default Meetups
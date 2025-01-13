import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/esm/Button'
import { useNavigate } from 'react-router-dom';
import Login from './Login';

function Nosession({user}) {
  const navigate = useNavigate();
  function goToNew(){
    navigate('/createsession');
  }
  return (
    <Container className='text-center '>
        <p>現在募集中のグループはありません。グループを作成してみませんか。</p>
        {user ? (
            <Login />
          ) : (
            <Button onClick={goToNew}>グループを作成する。</Button>
          )}
    </Container>
  )
}

export default Nosession
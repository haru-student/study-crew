import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/esm/Button'

function Nosession({user}) {
  return (
    <Container className='text-center '>
        <p>現在開催中の勉強会はありません。勉強会を開催してみませんか。</p>
        {user ? (
            <Button>勉強会を開催する</Button>
          ) : (
            <Button>ログインして勉強会を開催する</Button>
          )}
    </Container>
  )
}

export default Nosession
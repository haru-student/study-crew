import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';;

function Profile({user}) {
  return (
    <Container>
      <h1>マイページ</h1>
      <p>ユーザーID: {user.uid}</p>
    </Container>
  );
}

export default Profile;
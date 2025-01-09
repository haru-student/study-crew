import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import { Row, Col, Image } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Navigate } from 'react-router-dom';

function Toppage({user}) {
  const [redirect, setRedirect] = React.useState(null);

  const goToMeetsup = () => {
    setRedirect('/meetsup');
  };
  const goToChat = () => {
    setRedirect('/chatgroup');
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <Container fluid className="toppage text-center">
      <Image 
        src={user?.photoURL || 'default-image-url'}  
        alt="Profile Image" 
        roundedCircle 
        fluid 
        className="mb-3"
      />
      <h3>{user?.displayName || 'ユーザー名未設定'}</h3>
      <Button className='mb-5'>プロフィールを編集</Button>
      <div className="text-center mb-5">
        <h3 className="mb-2">参加中のグループ</h3>
        <p>現在参加中のグループはありません。</p>
        <Button onClick={goToMeetsup}>グループを探す</Button>
      </div>
  </Container>
  );
}

export default Toppage;

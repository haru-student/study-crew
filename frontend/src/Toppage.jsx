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
    <Container className='toppage'>
      <Row className="align-items-center mb-2">
        {/* 画像の部分 */}
        <Col xs="auto">
          <Image 
            src={user?.photoURL || 'default-image-url'}  
            alt="Profile Image" 
            roundedCircle 
            fluid 
          />
        </Col>

        {/* 名前と紹介文の部分 */}
        <Col>
          <div className="d-flex flex-column">
            <h3>{user?.displayName || 'ユーザー名未設定'}</h3>
            <p>プロフィールはまだ編集されていません。</p>
          </div>
        </Col>
      </Row>
      <hr />
      <div className="text-center mb-5">
        <h2 className="mb-2">参加中の勉強会</h2>
        <p>現在参加中の勉強会はありません。</p>
        <Button onClick={goToMeetsup}>勉強会を探す</Button>
      </div>
      <div className="text-center">
        <h2 className="mb-2">参加中のチャット</h2>
        <p>現在参加中のチャットはありません。</p>
        <Button onClick={goToChat}>グループチャットを探す</Button>
      </div>
    </Container>
  );
}

export default Toppage;

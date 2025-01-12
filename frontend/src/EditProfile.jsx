import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

function EditProfile({ user }) {
  const [icon, setIcon] = useState();
  const [name, setName] = useState();
  const [introduction, setIntroduciton] = useState();

  return (
    <Container className="border mt-0 p-5 fluid mx-auto">
      <h1 className="text-center fs-2">プロフィールの編集</h1>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>
            アイコン画像 ※画像の中心を自動でトリミングします
          </Form.Label>
          <Form.Control type="file" accept=".jpg, .jpeg, .png" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="freqInput">
          <Form.Label>名前</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>自己紹介</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="自己紹介"
            onChange={(e) => setIntroduciton(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary mt-3r" type="submit"className="d-block mx-auto">
          保存
         </Button>
      </Form>
    </Container>
  );
}

export default EditProfile;

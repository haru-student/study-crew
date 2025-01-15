import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import { RingLoader } from "react-spinners";
import { resizeImage, uploaderIcon } from "./handleImage";
import { getProfile, updateUserInfo } from "./dbControl";
import Introduction from "./Introduction";
import { toast } from "react-toastify";

function EditProfile({ user }) {
  const [icon, setIcon] = useState(null);
  const [iconName, setIconName] = useState("");
  const [iconURL, setIconURL] = useState("");
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const isNewUser = location.state?.isNewUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userInfo = await getProfile(user.uid);
        setIconURL(userInfo.icon);
        setName(userInfo.name);
        setIntroduction(userInfo.introduction);
      }
    };
    fetchProfile();
  }, [user]);

  const handleFileChange = async (e) => { 
    const file = e.target.files[0]; // ファイルを取得
    if (file) {
      setIconName(file.name); // ファイル名を状態に設定
      try {
        const resizedBlob = await resizeImage(file); // 画像リサイズを非同期で実行
        setIcon(resizedBlob); // リサイズした画像を状態に設定
      } catch (error) {
        toast.error("エラーが発生しました");// エラー時のログ出力
      }
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedURL = icon ? await uploaderIcon(icon, iconName, user.uid) : iconURL;
    
    if (uploadedURL) {
      setIconURL(uploadedURL);
    }

    try {
      updateUserInfo(user.uid, uploadedURL, name, introduction);
      setLoading(false);
      toast.success("プロフィールを設定しました！");
    } catch (error) {
      toast.error("アカウント情報の登録または更新に失敗しました。");
      setLoading(false);
      return;
    }
    setIcon(null);
    setIconURL("");
    setIconName("");
    setName("");
    setIntroduction("");
    navigate("/");
    
  };

  if (!user) {
    return <Introduction />;
  }

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <RingLoader size={48} color="blue" />
        </div>
      ) : (
        <Container className="border mt-0 p-5 fluid mx-auto">
          {isNewUser ? (
            <h1 className="text-center fs-2">プロフィールの設定</h1>
          ) : (
            <h1 className="text-center fs-2">プロフィールの編集</h1>
          )}
          <Form onSubmit={createAccount}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                アイコン画像 ※画像の中心を自動でトリミングします
              </Form.Label>
              <Form.Control type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="nameInput">
              <Form.Label>名前</Form.Label>
              <Form.Control
                type="text"
                value={name}
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
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary mt-3" type="submit" className="d-block mx-auto">
              保存
            </Button>
          </Form>
        </Container>
      )}
    </div>
  );
}

export default EditProfile;

import React, { useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { createAccount } from "./dbControl";
import { IpContext } from "./IpContext";
import TermsOfUse from "./TermsOfUse";
import Privacy from "./Privacy";

const Terms = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const ip = useContext(IpContext);

  // 開閉状態を管理する state
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // 認証状態を監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 同意ボタンを押した場合
  const handleAgree = () => {
    if (user) {
      createAccount(user.uid, user.displayName, user.photoURL, "", ip)
        .then(() => {
          navigate("/editprofile"); // プロフィール編集へ
        })
        .catch((error) => {
          console.error("ユーザー情報の保存に失敗:", error.message);
        });
    }
  };

  // 拒否ボタンを押した場合
  const handleDisagree = async () => {
    if (user) {
      try {
        await user.delete();
        navigate("/"); // ホームページへ
      } catch (error) {
        console.error("アカウント削除に失敗:", error.message);
      }
    }
  };

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="terms mx-auto text-center">
      <p className="fs-3">本サービスを利用するには、利用規約とプライバシーポリシーに同意する必要があります。</p>

      {/* 利用規約 */}
      <div className="policy-section">
        <h3
          onClick={() => setShowTerms(!showTerms)}
          className="policy-title fs-4"
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >
          利用規約 {showTerms ? "▲" : "▼"}
        </h3>
        {showTerms && (
          <TermsOfUse />
        )}
      </div>

      <div className="policy-section">
        <h3
          onClick={() => setShowPrivacy(!showPrivacy)}
          className="policy-title fs-4 mt-4"
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >
          プライバシーポリシー {showPrivacy ? "▲" : "▼"}
        </h3>
        {showPrivacy && (
          <Privacy />
        )}
      </div>

      <Button variant="success me-2 mt-3" onClick={handleAgree}>
        同意する
      </Button>
      <Button variant="danger mt-3" onClick={handleDisagree}>
        同意しない
      </Button>
    </div>
  );
};

export default Terms;

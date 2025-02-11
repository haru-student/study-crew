import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase"; // Firebase認証とFirestoreのインポート
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore"; // Firestoreにデータを保存するためのインポート
import { createAccount } from "./dbControl";
import { IpContext } from "./IpContext";

const Terms = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const ip = useContext(IpContext);

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

  // ユーザーがページを離れたらアカウント削除
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden" && user) {
        try {
          await user.delete(); // Firebase Auth から削除
          toast.info("同意しなかったためアカウントを削除しました。");
        } catch (error) {
          console.error("アカウント削除に失敗:", error.message);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  // 同意ボタンを押した場合
  const handleAgree = () => {
    if (user) {
      // Firestoreに新規ユーザーの情報を保存
      createAccount(user.uid, user.displayName, user.photoURL, "", ip)
        .then(() => {
          toast.success("同意ありがとうございます！");
          navigate("/editprofile"); // ここで遷移
        })
        .catch((error) => {
          console.error("ユーザー情報の保存に失敗:", error.message);
          toast.error("ユーザー情報の保存に失敗しました");
        });
    }
  };
  

  // 拒否ボタンを押した場合
  const handleDisagree = async () => {
    if (user) {
      try {
        await user.delete();
        toast.info("同意しなかったためアカウントを削除しました。");
        navigate("/"); // ホームページへ遷移
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
      <h2>利用規約</h2>
      <p>このアプリを利用するには、以下の利用規約に同意する必要があります。</p>
      <Button variant="success me-2" onClick={handleAgree}>同意する</Button>
      <Button variant="danger" onClick={handleDisagree}>同意しない</Button>
    </div>
  );
};

export default Terms;

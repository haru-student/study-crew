import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, provider } from './firebase';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { createAccount, checkIfNewUser } from './dbControl';
import {toast} from "react-toastify";

const Login = () => {
  const [isSignedIn, setIsSignedIn] = useState(false); // サインイン状態を管理
  const navigate = useNavigate(); // ページ遷移用

  // Firebase認証のサインイン状態を監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user); // ユーザーが存在する場合はtrue、それ以外はfalse
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const isNewUser = await checkIfNewUser(user.uid);
  
        if (isNewUser) {
          await createAccount(user.uid, user.displayName, null, "");
          toast("Open Crewにようこそ！");
          navigate('/editprofile', { state: { isNewUser: true } });
        } else {
          toast("おかえりなさい！");
          setIsSignedIn(true);
        }
      })
      .catch((error) => {
        console.error("サインインに失敗しました", error.code, error.message);
        toast.error("サインインに失敗しました: " + error.message);
      });
  };
  
  

  // サインアウト処理
  const signOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        toast.success("サインアウトしました");
        setIsSignedIn(false); // サインアウト状態を更新
      })
      .catch((error) => {
        toast.error("サインアウトに失敗しました", error.code, error.message); // 詳細なエラーメッセージを表示
      });
  };

  return (
    <div>
      {isSignedIn ? (
        <Button onClick={signOut} className="btn-danger">
          サインアウト
        </Button> // サインイン中はサインアウトボタン
      ) : (
        <Button onClick={signIn}>
          サインイン
        </Button>
      )}
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { checkIfNewUser } from "./dbControl"; 
import { toast } from "react-toastify";

const Login = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const isNewUser = await checkIfNewUser(user.uid, user);
        setIsSignedIn(true);

        if (isNewUser) {
          navigate("/agreement");
        } 
      } else {
        setIsSignedIn(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const isNewUser = await checkIfNewUser(user.uid, user);

      if (isNewUser) {
        navigate("/agreement");
      } else {
        toast("おかえりなさい！");
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error("サインインに失敗しました", error);
      toast.error("サインインに失敗しました: " + error.message);
    }
  };

  return (
    <div>
      {isSignedIn ? (
        <Button onClick={() => auth.signOut().then(() => setIsSignedIn(false))} className="btn-danger">
          サインアウト
        </Button>
      ) : (
        <Button onClick={signIn}>サインイン/新規登録</Button>
      )}
    </div>
  );
};

export default Login;

import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from "./firebase";

export const signIn = () => {
  return signInWithPopup(auth, provider)
    .then(() => {
    })
    .catch((error) => {
      console.error("サインインに失敗しました", error);
    });
};

export const signOut = () => {
  return auth.signOut()
    .then(() => {
      window.location.href = '/'; 
    })
    .catch((error) => {
      console.error("サインアウトに失敗しました", error);
    });
};

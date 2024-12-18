import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import {auth, provider} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import Container from 'react-bootstrap/Container';

function Login() {
    const [user] = useAuthState(auth);
    return (
        <Container className="text-center">
            {user ? (
            <div>
                <UserInfo />
                <SignOutButton />
            </div>
        ) : (
            <SignInButton />
        )}
        </Container>
    )
}

export default Login

function SignInButton() {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider);
    };
    return (
    <button onClick={signInWithGoogle}>
        <p>サインイン</p>
    </button>
    )
}

function SignOutButton() {
    return (
    <button onClick={() => auth.signOut()}>
        <p>サインアウト</p>
    </button>
    )
}

function UserInfo(){
    return (
        <div className = "userInfo">
            <img src={auth.currentUser.photoURL} alt="" />
            <p>{auth.currentUser.displayName}</p>
        </div>
    )

}
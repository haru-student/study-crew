import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import {auth, provider} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import Container from 'react-bootstrap/Container';

function Home() {
    const [user] = useAuthState(auth);
    return (
        <Container className="text-center">
            <h1>ログインを実装しようね</h1>
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

export default Home

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
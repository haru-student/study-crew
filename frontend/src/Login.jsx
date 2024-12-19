import { signInWithPopup } from 'firebase/auth';
import {auth, provider} from "./firebase";

export function signIn() {
    signInWithPopup(auth, provider);
}

export function signOut() {
    auth.signOut();   
}
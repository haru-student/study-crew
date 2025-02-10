import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getCircleDataById, getProfile } from "./dbControl";
import { Form, useParams } from "react-router-dom";
import { db } from "./firebase";

function Chat({ user }) {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [circle, setCircle] = useState("");
  const [secret, setSecret] = useState(false);
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");


  const fetchUserData = async () => {
    const userData = await getProfile(user.uid);
    if (userData){
      setIcon(userData.icon);
      setName(userData.name)
    }
  }
  useEffect(() => {
    if (user){
      fetchUserData();
    }
  },[user])
  useEffect(() => {
    const fetchCircleData = async () => {
      const circleData = await getCircleDataById(id);

      if (circleData) {
        setCircle(circleData);
      }
    };
    fetchCircleData();
  }, [id]);
  const checkSecret = () => {
    if (secret) {
      setSecret(false);
    } else {
      setSecret(true);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await addDoc(collection(db, `circles/${id}/chats`), {
      text: message,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: name,
      photoURL: icon,
      secret,
    });

    setMessage("");
  };
  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, `circles/${id}/chats`),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [id]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [circle]);

  return (
    <div className="chat-container p-3 rounded">
      {messages.length > 0 ? (
        messages.map((message) => {
          if ((user && circle && !circle.members.includes(user.uid) && message.secret) || (!user && message.secret)) return null; // 条件が満たされなければ何も表示しない

          return (
            <div key={message.id}>
              {user && user.uid === message.uid ? (
                <div className="text-container p-2 mb-3 rounded d-flex justify-content-end ms-auto">
                  <div className="text-wrap">{message.text}</div>
                </div>
              ) : (
                <>
                  <div className="align-items-center d-flex">
                    {message.photoURL && (
                      <img src={message.photoURL} alt="" className="rounded-circle icon" />
                    )}
                    <p className="mb-0 ms-1">{message.displayName}</p>
                  </div>
                  <div className="text-container p-2 mt-1 mb-3 rounded d-flex justify-content-start">
                    <div className="text-wrap">{message.text}</div>
                  </div>
                </>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center">まだ会話がありません。</p>
      )}

      <div ref={chatEndRef} />
      {user && circle && circle.members.includes(user.uid) && (
        <form onSubmit={sendMessage} className="sticky-bottom pb-2 mt-auto">
          <div className="mb-3 d-flex">
            <input
              type="text"
              className="form-control me-1" // me-2 でボタンとの間にスペース
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力"
            />
            <button type="submit" className="btn btn-primary w-auto">
              送信
            </button>
          </div>

          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={secret} // チェックボックスの状態に合わせる
              onChange={checkSecret} // チェックボックスが変更されたときに状態を更新
              id="secretCheckbox"
            />
            <label className="form-check-label" htmlFor="secretCheckbox">
              メンバーにのみメッセージを表示する
            </label>
          </div>
        </form>
      )}
    </div>
  );
}

export default Chat;

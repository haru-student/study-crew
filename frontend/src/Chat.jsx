import React, { useContext, useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { deleteChat, getCircleDataById, getProfile } from "./dbControl";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { IpContext } from "./IpContext";
import Report from "./Report";

function Chat({ user }) {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [circle, setCircle] = useState(null);
  const [secret, setSecret] = useState(false);
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const [popupMessageId, setPopupMessageId] = useState(null);
  const [report, setReport] = useState(false);
  const [improper, setImproper] = useState(null);
  const ip = useContext(IpContext);

  const fetchUserData = async () => {
    const userData = await getProfile(user.uid);
    if (userData) {
      setIcon(userData.icon);
      setName(userData.name);
    }
  };

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchCircleData = async () => {
      const circleData = await getCircleDataById(id);
      if (circleData) setCircle(circleData);
    };
    fetchCircleData();
  }, [id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await addDoc(collection(db, `circles/${id}/chats`), {
      ip,
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
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteChat = async (chatId) => {
    await deleteChat(id, chatId);
    setPopupMessageId(null);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".popup-container")) {
      setPopupMessageId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleReport = async(msg)=>{
    setImproper(msg);
    setReport(true)
  }

  return (
    <div>
      <Report report={report} setReport={setReport} user={user ? user.uid : null} data={improper}/>
      <div className="chat-container p-3 rounded">
        {messages.length > 0 ? (
          messages.map((msg) => {
            if (
              (user &&
                circle &&
                !circle.members.includes(user.uid) &&
                msg.secret) ||
              (!user && msg.secret)
            )
              return null;

            return (
              <div key={msg.id} className="position-relative">
                {user && user.uid === msg.uid ? (
                  <div className="text-container p-2 mb-3 rounded d-flex justify-content-end ms-auto">
                    <div
                      className="text-wrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPopupMessageId(
                          msg.id === popupMessageId ? null : msg.id
                        );
                      }}
                    >
                      {msg.text}
                    </div>
                    {popupMessageId === msg.id && (
                      <img
                        src="/trash.svg"
                        alt=""
                        className="ms-2"
                        onClick={() => handleDeleteChat(msg.id)}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <div className="align-items-center d-flex">
                      {msg.photoURL && (
                        <img
                          src={msg.photoURL}
                          alt=""
                          className="rounded-circle icon"
                        />
                      )}
                      <p className="mb-0 ms-1">{msg.displayName}</p>
                    </div>
                    <div className="text-container p-2 mt-1 mb-3 rounded d-flex justify-content-start">
                      <div className="text-wrap">{msg.text}</div>
                      <p className="ms-2 mb-0" onClick={() => handleReport(msg)}>
                        ︙
                      </p>
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
                className="form-control me-1"
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
                checked={secret}
                onChange={() => setSecret(!secret)}
                id="secretCheckbox"
              />
              <label className="form-check-label" htmlFor="secretCheckbox">
                メンバーにのみメッセージを表示する
              </label>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Chat;

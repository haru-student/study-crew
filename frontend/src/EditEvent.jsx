import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { Button, Form } from "react-bootstrap";
import { updateEvent } from "./dbControl";
import { toast } from "react-toastify";
import { IpContext } from "./IpContext";
Modal.setAppElement("#root");

function EditEvent({ editEvent, setEditEvent, circle, event }) {
  const [location, setLocation] = useState(event.eventlocation);
  const [URL, setURL] = useState(event.url);
  const [pass, setPass] = useState(event.password);
  const [pubDate, setPubDate] = useState(event.publishDate);
  const [notes, setNotes] = useState(event.notes);
  const ip = useContext(IpContext);

  // モーダルが開かれた時に、フォームの初期値をセット
  useEffect(() => {
    if (editEvent && event) {
      setLocation(event.eventlocation || "");
      setURL(event.url || "");
      setPass(event.password || "");
      setPubDate(event.publishDate || "");
      setNotes(event.notes || "");
    }
  }, [editEvent, event]);

  const handleEditEvent = async (e) => {
    e.preventDefault();
    const newEvent = {
      date: event.date,
      type: event.type,
      startTime: event.startTime,
      endTime: event.endTime,
      notes,
      onlineMember: event.onlineMember,
      inpersonMember: event.inpersonMember,
      eventlocation: location,
      inPersonCapacity:
        event.type === "対面" || event.type === "対面+オンライン" ? event.inPersonCapacity : null,
      onlineCapacity:
        event.type === "オンライン" || event.type === "対面+オンライン"
          ? event.onlineCapacity
          : null,
      url: event.type === "オンライン" || event.type === "対面+オンライン" ? URL : "",
      password: event.type === "オンライン" || event.type === "対面+オンライン" ? pass : "",
      publishDate:
        event.type === "オンライン" || event.type === "対面+オンライン" ? pubDate : "",
      identify: event.identify,
    };

    // 空のフィールドを削除
    Object.keys(newEvent).forEach((key) => {
      if (
        newEvent[key] === null ||
        newEvent[key] === "" ||
        newEvent[key] === undefined
      ) {
        delete newEvent[key];
      }
    });

    // Firestoreへの登録処理
    try {
      await updateEvent(circle.id, event.identify, newEvent, ip); // 作成したイベントオブジェクトを渡す
      // フィールドのリセット
      setLocation(""); // locationのリセット
      setURL(""); // URLのリセット
      setPass(""); // passwordのリセット
      setPubDate(""); // publishDateのリセット
      setNotes(""); // notesのリセット

      toast.success("イベントを更新しました!");
      setEditEvent(false);
    } catch (error) {
      toast.warning("イベントの更新に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <Modal
      isOpen={editEvent}
      onRequestClose={() => setEditEvent(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(128, 128, 128, 0.7)", // 半透明のグレー背景
        },
        content: {
          overflow: "auto", // スクロールを有効にする
          maxHeight: "90vh", // モーダルの高さを画面サイズに合わせる
          margin: "auto", // モーダルを中央揃え
        },
      }}
      contentLabel="イベントの編集"
      className="modal-form mx-auto mt-5 px-5 py-3 position-relative border bg-white"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={() => setEditEvent(false)}
      >
        ×
      </Button>
      <h1 className="text-center fs-2">イベントの編集</h1>
      <Form onSubmit={handleEditEvent}>
        {(event.type === "対面" || event.type === "対面+オンライン") && (
          <Form.Group className="mb-3" controlId="location">
            <Form.Label>開催場所</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
        )}
        {(event.type === "オンライン" || event.type === "対面+オンライン") && (
          <div>
            <Form.Group className="mb-3" controlId="online">
              <Form.Label>オンラインURL</Form.Label>
              <Form.Control
                type="text"
                placeholder="URLを入力して下さい"
                value={URL}
                onChange={(e) => setURL(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pass">
              <Form.Label>オンラインURLのパスワード</Form.Label>
              <Form.Control
                type="text"
                placeholder="パスワードを入力して下さい"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>オンラインURL、パスワード公開日時</Form.Label>
              <Form.Control
                type="date"
                value={pubDate}
                onChange={(e) => setPubDate(e.target.value)}
              />
            </Form.Group>
          </div>
        )}
        <Form.Group className="mb-3">
          <Form.Label>概要</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="特記事項"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>
        <Button className="d-block mx-auto mt-2" type="submit">
          更新
        </Button>
      </Form>
    </Modal>
  );
}

export default EditEvent;

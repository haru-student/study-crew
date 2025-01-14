import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { registerEvent } from "./dbControl";
import { toast } from "react-toastify";
Modal.setAppElement("#root");

function AddEvent({ addEvent, setAddEvent, circle }) {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [type, setType] = useState(circle.type);
  const [inPersonCapacity, setInPersonCapacity] = useState("");
  const [onlineCapacity, setOnlineCapacity] = useState("");
  const [location, setLocation] = useState(circle.location);
  const [URL, setURL] = useState("");
  const [pass, setPass] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddEvent = async () => {
    const eventDateOnly = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // 開催日チェック
    if (eventDateOnly < currentDate) {
      toast.warning("現在日付より前の開催日は設定できません");
      return;
    }
    if (!location && (type === "対面" || type === "対面+オンライン")) {
      toast.warning("開催場所を入力してください");
      return;
    }
    if (!date) {
      toast.warning("開催日時を入力してください");
      return;
    }

    const currentTime = new Date().getTime();
    const newEvent = {
      date,
      type,
      startTime: start,
      endTime: end,
      notes,
      onlineMember: [],
      inpersonMember: [],
      eventlocation: location,
      inPersonCapacity:
        type === "対面" || type === "対面+オンライン" ? inPersonCapacity : null,
      onlineCapacity:
        type === "オンライン" || type === "対面+オンライン"
          ? onlineCapacity
          : null,
      url: type === "オンライン" || type === "対面+オンライン" ? URL : "",
      password: type === "オンライン" || type === "対面+オンライン" ? pass : "",
      publishDate:
        type === "オンライン" || type === "対面+オンライン" ? pubDate : "",
      identify: currentTime,
    };

    // 空のフィールドを削除
    Object.keys(newEvent).forEach((key) => {
      if (newEvent[key] === null || newEvent[key] === "") {
        delete newEvent[key];
      }
    });

    // Firestoreへの登録処理
    try {
      await registerEvent(circle.id, newEvent); // 作成したイベントオブジェクトを渡す
      // フィールドのリセット
      setLocation(circle.location);
      setDate("");
      setStart("");
      setEnd("");
      setInPersonCapacity("");
      setOnlineCapacity("");
      setURL("");
      setPass("");
      setPubDate("");
      setNotes("");
      toast.success("イベントの追加に成功しました!");
      setAddEvent(false);
    } catch (error) {
      toast.warning("イベントの追加に失敗しました。もう一度お試しください。");
    }
  };

  // useEffectを使ってブラウザの戻るボタンをリッスン
  useEffect(() => {
    const handlePopState = (event) => {
      // モーダルが開いている場合に閉じる
      if (addEvent) {
        setAddEvent(false);
      }
    };

    // popstateイベントリスナーを追加
    window.addEventListener("popstate", handlePopState);

    // クリーンアップ（コンポーネントのアンマウント時）
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [addEvent, setAddEvent]);

  return (
    <Modal
      isOpen={addEvent}
      onRequestClose={() => setAddEvent(false)}
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
      contentLabel="イベントの作成"
      className="modal-form mx-auto mt-5 px-5 py-3 position-relative border bg-white"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={() => setAddEvent(false)}
      >
        ×
      </Button>
      <h1 className="text-center fs-2">イベントの作成</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>開催日</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>開始時刻</Form.Label>
          <Form.Control
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>終了時刻</Form.Label>
          <Form.Control
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>開催形式</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="対面"
              name="Type"
              value="対面"
              checked={type === "対面"}
              onChange={(e) => setType(e.target.value)}
              required
            />
            <Form.Check
              type="radio"
              label="オンライン"
              name="Type"
              value="オンライン"
              checked={type === "オンライン"}
              onChange={(e) => setType(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="対面+オンライン"
              name="Type"
              value="対面+オンライン"
              checked={type === "対面+オンライン"}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
        </Form.Group>
        {(type === "対面" || type === "対面+オンライン") && (
          <Form.Group className="mb-3">
            <Form.Label>対面参加定員</Form.Label>
            <Form.Control
              type="number"
              value={inPersonCapacity}
              onChange={(e) => setInPersonCapacity(e.target.value)}
            />
          </Form.Group>
        )}

        {(type === "オンライン" || type === "対面+オンライン") && (
          <Form.Group className="mb-3">
            <Form.Label>オンライン参加定員</Form.Label>
            <Form.Control
              type="number"
              value={onlineCapacity}
              onChange={(e) => setOnlineCapacity(e.target.value)}
            />
          </Form.Group>
        )}
        {(type === "対面" || type === "対面+オンライン") && (
          <Form.Group className="mb-3" controlId="location">
            <Form.Label>開催場所</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
        )}
        {(type === "オンライン" || type === "対面+オンライン") && (
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
      </Form>
      <Button className="d-block mx-auto mt-2" onClick={() => handleAddEvent()}>
        登録
      </Button>
    </Modal>
  );
}

export default AddEvent;

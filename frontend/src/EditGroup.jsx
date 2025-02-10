import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { uploader, resizeImage, deleteFile } from "./handleImage";

Modal.setAppElement("#root");

function EditGroup({ editGroup, setEditGroup, circle, setLoading }) {
  const [event, setEvent] = useState(circle.name);
  const [eventType, setEventType] = useState(circle.type);
  const [location, setLocation] = useState(circle.location);
  const [oneOffURL, setOneOffURL] = useState(circle.URL);
  const [oneOffPass, setOneOffPass] = useState(circle.oneOffPass);
  const [oneOffURLDate, setOneOffURLDate] = useState(circle.oneOffURLDate);
  const [fee, setFee] = useState(circle.fee);
  const [detail, setDetail] = useState(circle.detail);
  const [freqInput, setFreqInput] = useState(circle.freqInput); //開催頻度
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");

  const [upload, setUpload]= useState(false);

  const handleFileChange = async (e) => { // async を追加
    setUpload(true);
    const file = e.target.files[0]; // e.target.files[0] でファイルを取得
    if (file) {
      setFileName(file.name); // ファイル名を状態に設定
      try {
        const blob = await resizeImage(file); // 非同期処理を待つ
        setFile(blob); // Blob を状態に設定
        setUpload(false);
      } catch (error) {
        toast.error("エラーが発生しました。もう一度お試しください"); // エラー時のログ出力
        setUpload(false);
      }
    }
    setUpload(false);
  };

  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setEditGroup(false);
  };

  // モーダルを更新する処理
  const handleEditGroup = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploaded = null;
    if (file) {
      try {
        uploaded = await uploader(file, fileName);
        if (!uploaded) {
          toast.error(
            "ファイルのアップロードに失敗しました。もう一度お試しください"
          );
          setLoading(false);
          return;
        }
      } catch (uploadError) {
        console.error(uploadError);
        toast.error("ファイルアップロード中にエラーが発生しました");
        setLoading(false);
        return;
      }
      try{
        await deleteFile(circle.fileURL);
      }catch(error){
        console.error(error);
      }
    }

    try {
      const currentTime = new Date().getTime();
      const data = {
        fileURL: uploaded || circle.fileURL,
        name: event,
        freq: circle.freq,
        freqInput: freqInput,
        oneOff: circle.oneOffValue,
        type: eventType,
        location: location || "開催地未定",
        oneOffURL: oneOffURL,
        oneOffPass: oneOffPass,
        oneOffURLDate: oneOffURLDate,
        oneOffInpersonCapa: circle.oneinCapa,
        oneOffOnlineCapa: circle.oneOnlineCapa,
        oneOffInpersonMember: circle.oneOffInpersonMember,
        oneOffOnlineMember: circle.oneOffOnlineMember,
        fee: fee,
        detail: detail,
        events: circle.events,
        members: circle.members,
        host: circle.host,
        update: currentTime,
        block: circle.block
      };

      Object.keys(data).forEach((key) => {
        if (data[key] === null || data[key] === undefined || data[key] === "") {
          delete data[key];
        }
      });

      const docRef = await doc(db, "circles", circle.id);

      try {
        await setDoc(docRef, data);
        toast.success("グループの更新に成功しました！");
      } catch (groupListError) {
        console.error(groupListError);
        toast.error("エラーが発生しました。時間をおいてもう一度お試しください");
        setLoading(false);
      }
    } catch (docError) {
      console.error(docError);
      toast.error("サークル作成に失敗しました。");
      setLoading(false);
    }

    // フォームのリセット
    // フォームのリセット
    setEvent(circle.name || ""); // 初期値をcircleのデータに戻す
    setFreqInput(circle.freqInput || ""); // 開催頻度入力フィールドをリセット
    setEventType(circle.type || ""); // 開催形式をリセット
    setLocation(circle.location || "開催地未定"); // 開催場所をリセット
    setOneOffURL(circle.URL || ""); // オンラインURLをリセット
    setOneOffPass(circle.oneOffPass || ""); // オンラインパスワードをリセット
    setOneOffURLDate(circle.oneOffURLDate || ""); // オンラインURL公開日時をリセット
    setFee(circle.fee || ""); // 参加費をリセット
    setDetail(circle.detail || ""); // 概要をリセット
    setFileName(""); // ファイル名をリセット
    setFile(""); // ファイルをリセット
    
    setLoading(false);
    setEditGroup(false);
  };

  // モーダルとブラウザの戻るボタンの連携
  useEffect(() => {
    const handlePopState = () => {
      if (editGroup) {
        handleCloseModal();
      }
    };

    if (editGroup) {
      window.history.pushState({ modalOpen: true }, "");
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (editGroup) {
        window.history.back();
      }
    };
  }, [editGroup]);

  return (
    <Modal
      isOpen={editGroup}
      onRequestClose={handleCloseModal}
      style={{
        overlay: { backgroundColor: "rgba(128, 128, 128, 0.7)" },
        content: {
          overflow: "auto",
          maxHeight: "90vh",
          margin: "auto",
        },
      }}
      contentLabel="グループデータの更新"
      className="modal-form mx-auto mt-5 px-5 py-3 position-relative border bg-white"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={handleCloseModal}
      >
        ×
      </Button>
      <h1 className="text-center fs-2">グループデータの更新</h1>
      <Form onSubmit={handleEditGroup}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>ヘッダー画像 ※4:3にトリミングされます。</Form.Label>
          <Form.Control
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={(e) => handleFileChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="event">
          <Form.Label>イベント名</Form.Label>
          <Form.Control
            type="text"
            placeholder="イベント名を入力して下さい"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </Form.Group>
        {circle.freq === "複数回" && (
          <Form.Group className="mb-3" controlId="freqInput">
            <Form.Label>開催頻度</Form.Label>
            <Form.Control
              type="text"
              placeholder="例）毎週日曜日、不定期"
              value={freqInput}
              onChange={(e) => setFreqInput(e.target.value)}
              required
            />
          </Form.Group>
        )}
        <Form.Group className="mb-3">
          <Form.Label>開催形式</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="対面"
              name="eventType"
              value="対面"
              checked={eventType === "対面"}
              onChange={(e) => setEventType(e.target.value)}
              required
            />
            <Form.Check
              type="radio"
              label="オンライン"
              name="eventType"
              value="オンライン"
              checked={eventType === "オンライン"}
              onChange={(e) => setEventType(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="対面+オンライン"
              name="eventType"
              value="対面+オンライン"
              checked={eventType === "対面+オンライン"}
              onChange={(e) => setEventType(e.target.value)}
            />
          </div>
        </Form.Group>

        {(eventType === "対面" || eventType === "対面+オンライン") && (
          <Form.Group className="mb-3" controlId="location">
            <Form.Label>開催場所</Form.Label>
            <Form.Control
              type="text"
              placeholder="例）大阪府大阪市北区○○ビル〇階"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
        )}
        {circle.freq === "単発" &&
          (eventType === "オンライン" || eventType === "対面+オンライン") && (
            <div>
              <Form.Group className="mb-3" controlId="online">
                <Form.Label>オンラインURL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="URLを入力して下さい"
                  value={oneOffURL}
                  onChange={(e) => setOneOffURL(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="pass">
                <Form.Label>オンラインURLのパスワード</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="パスワードを入力して下さい"
                  value={oneOffPass}
                  onChange={(e) => setOneOffPass(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="date">
                <Form.Label>オンラインURL、パスワード公開日時</Form.Label>
                <Form.Control
                  type="date"
                  value={oneOffURLDate}
                  onChange={(e) => setOneOffURLDate(e.target.value)}
                />
              </Form.Group>
            </div>
          )}
        <Form.Group className="mb-3 mt-3">
          <Form.Label>参加費</Form.Label>
          <Form.Control
            type="text"
            placeholder="例）毎月300円"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>概要</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="グループの紹介"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </Form.Group>
        <Button className="d-block mx-auto mt-2" type="submit" disabled={upload}>
          更新
        </Button>
      </Form>
    </Modal>
  );
}

export default EditGroup;

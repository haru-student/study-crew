import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Button, Form } from "react-bootstrap";
import { createBlog } from "./dbControl";
import { toast } from "react-toastify";
import { resizeImage, uploader } from "./handleImage";
Modal.setAppElement("#root");

function NewBlog({ addBlog, setAddBlog, circle }) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [upload, setUpload] = useState(false);

  
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
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    let uploadedURL = null;
    if (file) {
      try {
        uploadedURL = await uploader(file, fileName);
        if (!uploadedURL) {
          toast.error("ファイルのアップロードに失敗しました。もう一度お試しください");
          setLoading(false);
          return;
        }
        setFileURL(uploadedURL);
      } catch (uploadError) {
        setLoading(false);
        toast.error("ファイルアップロード中にエラーが発生しました");
        return;
      }
    }

    const currentTime = new Date().getTime();
    const newBlog = {
        title,
        content,
        image: uploadedURL || fileURL,
        date: currentTime
    };
    if (newBlog.title==="" || newBlog.content===""){
        toast.warning("タイトルまたは本文が未入力です。");
        return;
    }

    // Firestoreへの登録処理
    try {
      await createBlog(circle.id, newBlog); // 作成したイベントオブジェクトを渡す
      // フィールドのリセット
      setTitle("");
      setContent("");
      setFile("");
      setFileName("");
      setFileURL("");
      toast.success("ブログを投稿しました！");
      setAddBlog(false);
    } catch (error) {
      toast.warning("ブログの投稿に失敗しました。もう一度お試しください。");
    }
  };

  // useEffectを使ってブラウザの戻るボタンをリッスン
  useEffect(() => {
    const handlePopState = () => {
      // モーダルが開いている場合に閉じる
      if (addBlog) {
        setAddBlog(false);
      }
    };

    if (addBlog) {
      // モーダルを開く際に履歴を追加
      window.history.pushState({ modalOpen: true }, "");
    }

    // popstateイベントリスナーを追加
    window.addEventListener("popstate", handlePopState);

    return () => {
      // クリーンアップ
      window.removeEventListener("popstate", handlePopState);

      // モーダルが開いている場合、履歴を元に戻す
      if (addBlog) {
        window.history.back();
      }
    };
  }, [addBlog, setAddBlog]);

  return (
    <Modal
      isOpen={addBlog}
      onRequestClose={() => setAddBlog(false)}
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
      contentLabel="ブログの投稿"
      className="modal-form mx-auto mt-5 px-5 py-3 position-relative border bg-white"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={() => setAddBlog(false)}
      >
        ×
      </Button>
      <h1 className="text-center fs-2">ブログの投稿</h1>
      <Form onSubmit={handleAddBlog}>
        <Form.Group className="mb-3">
          <Form.Label>タイトル</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>本文</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>画像ファイル</Form.Label>
          <Form.Control
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={(e) => handleFileChange(e)}
          />
        </Form.Group>
        <Button
          className="d-block mx-auto mt-2"
          type="submit"
          disabled={upload}
        >
          投稿
        </Button>
      </Form>
    </Modal>
  );
}

export default NewBlog;

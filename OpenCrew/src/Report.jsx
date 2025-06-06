import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";
import { improper } from "./dbControl";
Modal.setAppElement("#root");

function Report({ report, setReport, user, data }) {
    const handleReport = async() => {
        await improper(user, data)
        setReport(false);
    }
  return (
    <Modal
      isOpen={report}
      onRequestClose={() => setReport(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(128, 128, 128, 0.7)", // 半透明のグレー背景
          display: "flex", // Flexboxを使って中央揃え
          justifyContent: "center", // 横方向中央揃え
          alignItems: "center", // 縦方向中央揃え
          position: "fixed", // 固定表示
          top: 0, // 上端に固定
          left: 0, // 左端に固定
          right: 0, // 右端に固定
          bottom: 0, // 下端に固定
        },
        content: {
          maxWidth: "90vw", // モーダルの幅を画面の90%に設定
          maxHeight: "90vh", // モーダルの高さを画面の90%に設定
          margin: "auto", // モーダルを中央に配置
          padding: "20px", // 内側のパディング
        },
      }}
      contentLabel="不適切投稿"
      className="confirm mx-auto d-flex flex-column position-relative border bg-white py-5 px-3 rounded"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={() => setReport(false)}
      >
        ×
      </Button>
      <h1 className="fs-3 text-start">不適切投稿</h1>
      <p className="text-start">このコンテンツを不適切なコンテンツとして報告しますか？</p>
      <Button className="btn-danger mb-3 mx-5" onClick={() => {handleReport()}}>報告する</Button>
      <Button className="mx-5" onClick={() => setReport(false)}>キャンセル</Button>
    </Modal>
  );
}

export default Report;

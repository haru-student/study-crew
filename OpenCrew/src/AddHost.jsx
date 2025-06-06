import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";
import { newHost } from "./dbControl";
Modal.setAppElement("#root");

function AddHost({ addHost, setAddHost, id, target }) {
  const handleHost = async () => {
    await newHost(id, target.id);
    setAddHost(false);
  };
  return (
    <Modal
      isOpen={addHost}
      onRequestClose={() => setAddHost(false)}
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
      contentLabel="管理者権限の付与の確認"
      className="confirm mx-auto d-flex flex-column position-relative border bg-white py-5 px-3 rounded"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={() => setAddHost(false)}
      >
        ×
      </Button>
      {target && (
        <div>
          <h1 className="fs-3 text-start">
            {target.name}管理者権限を付与しますか？
          </h1>
          <p className="text-start">
            現在、管理者権限の取り消しを行うことができません。
          </p>
        </div>
      )}
      <Button
        className="btn-success mb-3 mx-5"
        onClick={() => {
          handleHost(id, target.id);
        }}
      >
        管理者権限を付与する
      </Button>
      <Button className="mx-5" onClick={() => setAddHost(false)}>
        キャンセル
      </Button>
    </Modal>
  );
}

export default AddHost;

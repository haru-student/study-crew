import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";
import { addBlock } from "./dbControl";
import { useNavigate } from "react-router-dom";
Modal.setAppElement("#root");

function Block({ block, setBlock, id, blockTarget }) {
  const navigate = useNavigate();
  const handleBlock = async () => {
    await addBlock(id, blockTarget.id, navigate);
    setBlock(false);
  }
  return (
    <Modal
      isOpen={block}
      onRequestClose={() => setBlock(false)}
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
      contentLabel="アカウントブロックの確認"
      className="confirm mx-auto d-flex flex-column position-relative border bg-white py-5 px-3 rounded"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={() => setBlock(false)}
      >
        ×
      </Button>
      {blockTarget && (
        <div>
          <h1 className="fs-3 text-start">{blockTarget.name}ブロックしますか？</h1>
          <p className="text-start">現在、ブロックの解除を行うことができません。</p>
        </div>
      )}
      <Button className="btn-danger mb-3 mx-5" onClick={() => {handleBlock()}}>ブロックする</Button>
      <Button className="mx-5" onClick={() => setBlock(false)}>キャンセル</Button>
    </Modal>
  )
}

export default Block
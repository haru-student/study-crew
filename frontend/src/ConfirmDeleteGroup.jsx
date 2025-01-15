import React from "react";
import Modal from "react-modal";
import { Button } from "react-bootstrap";
import { removeMember } from "./dbControl";
import { useNavigate } from "react-router-dom";
Modal.setAppElement("#root");

function ConfirmDeleteGroup({ confirm, setConfirm, circle, user, setLoading }) {
    const navigate=useNavigate();

    const handleDeleteGroup = async() => {
        setLoading(true);
        await removeMember(circle.id, user.uid, navigate);
        navigate("/"); // ホームページや適切なルートにリダイレクト
    }
  return (
    <Modal
      isOpen={confirm}
      onRequestClose={() => setConfirm(false)}
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
      contentLabel="退会確認"
      className="confirm mx-auto d-flex flex-column position-relative border bg-white py-5 px-3 rounded"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={() => setConfirm(false)}
      >
        ×
      </Button>
      <h1 className="fs-3 text-start">このグループも削除されます。</h1>
      <p className="text-start">退会すると、グループのホストが0人となるため、このグループは削除されます。このグループを削除せずに退会するには、他のメンバーに管理者権限を付与してから退会してください。</p>
      <Button className="btn-danger mb-3 mx-5" onClick={() => {handleDeleteGroup()}}>退会する</Button>
      <Button className="mx-5" onClick={() => setConfirm(false)}>キャンセル</Button>
    </Modal>
  );
}

export default ConfirmDeleteGroup;

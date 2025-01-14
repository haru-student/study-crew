import React from 'react'
import { Modal } from 'react-bootstrap'

function DeleteGroup() {
  return (
    <Modal
      isOpen={addEvent}
      onRequestClose={() => setAddEvent(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(128, 128, 128, 0.7)", // 半透明のグレー背景
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
      <Button
        className="d-block mx-auto mt-2"
        onClick={() => setAddEvent(false)}
      >
        登録
      </Button>
    </Modal>
  )
}

export default DeleteGroup
import React, { useState } from "react";
import Modal from "react-modal";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ReactStarsRating from 'react-awesome-stars-rating';
import { newReview } from "./dbControl";
Modal.setAppElement("#root");

function Review({ addReview, setAddReview, circle, user }) {
  const [value, setValue] = useState(3);
  const [atmosphere, setAtmosphere] = useState("");
  const [age, setAge] = useState("");
  const [detail, setDetail] = useState("");
  const onChange = (value) => {
    setValue(value)
  };
  const handleAddReview = async (e) => {
    e.preventDefault();

    const currentTime = new Date().getTime();
    const review = {
      value,
      atmosphere,
      age,
      detail,
      date: currentTime,
    };
    try {
      await newReview(circle.id, review, user.uid);
      // フィールドのリセット
      setValue(3);
      setAtmosphere("");
      setAge("");
      setDetail("");
      toast.success("クチコミを投稿しました！");
      setAddReview(false);
    } catch (error) {
      toast.warning("クチコミの投稿に失敗しました。もう一度お試しください。");
      console.error(error)
    }
  };

  return (
    <Modal
      isOpen={addReview}
      onRequestClose={() => setAddReview(false)}
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
      contentLabel="クチコミの投稿"
      className="modal-form mx-auto mt-5 px-5 py-3 position-relative border bg-white"
    >
      <Button
        className="btn btn-light rounded-circle fs-5 border border-dark close-btn p-0 position-absolute top-0 end-0"
        onClick={() => setAddReview(false)}
      >
        ×
      </Button>
      <h1 className="text-center fs-2">クチコミの投稿</h1>
      <ReactStarsRating onChange={onChange} value={value} className="mb-3"/>
      <Form onSubmit={handleAddReview}>
        <Form.Group controlId="atmosphere" className="my-3">
          <Form.Label>グループの雰囲気</Form.Label>
          <Form.Select
            aria-label="グループの雰囲気を選択"
            onChange={(e) => setAtmosphere(e.target.value)}
            value={atmosphere} // atmosphereが選択されるとその値に設定
          >
            <option value="">選択してください</option>
            <option value="落ち着いている">落ち着いている</option>
            <option value="やや落ち着いている">やや落ち着いている</option>
            <option value="ややにぎやか">ややにぎやか</option>
            <option value="にぎやか">にぎやか</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="age" className="mb-3">
          <Form.Label>年齢層</Form.Label>
          <Form.Select
            aria-label="年齢層を選択"
            onChange={(e) => setAge(e.target.value)}
            value={age} // ageが選択されるとその値に設定
          >
            <option value="">選択してください</option>
            <option value="若年層(30歳以下)が多い">
              若年層(30歳以下)が多い
            </option>
            <option value="中年層(30代から40代)が多い">
              中年層(30代から40代)が多い
            </option>
            <option value="シニア層(50歳以上)が多い">
              シニア層(50歳以上)が多い
            </option>
            <option value="幅広い年齢層が参加している">
              幅広い年齢層が参加している
            </option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>詳細</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </Form.Group>
        <Button className="d-block mx-auto mt-2" type="submit">
          投稿
        </Button>
      </Form>
    </Modal>
  );
}

export default Review;

import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useNavigate, Link } from "react-router-dom";
import Nosession from "./Nosession";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { db } from "./firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Meetups({ user }) {
  const navigate = useNavigate();
  const createCricle = () => {
    navigate("/createsession");
  };

  const [circles, setcircles] = useState([]);

  useEffect(() => {
    const fetchCircles = async () => {
      const circleData = collection(db, "circles");
      const snapShot = await getDocs(circleData);

      const allCircles = snapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const now = new Date();
      for (const circle of allCircles) {
        if (isEventExpired(circle)) {
          // ファイルとドキュメントを削除
          await deleteFile(circle.fileURL); // Storage のファイルを削除
          await deleteDoc(doc(db, "circles", circle.id)); // Firestore のドキュメントを削除
        }
      }

      // 終了していないイベントを state にセット
      setcircles(allCircles.filter((circle) => !isEventExpired(circle)));
    };

    fetchCircles();
  }, []);

  // 終了したイベントを判定する関数
  const isEventExpired = (circle) => {
    if (circle.freq !== "単発") return false;

    const [datePart, timePart] = circle.oneOff.split(/\s+/); // "2025/01/09 20:00～21:00" を分解
    const endTime = timePart.split("～")[1]; // 終了時刻を抽出
    const eventEndDateTime = new Date(
      `${datePart.replace(/\//g, "-")}T${endTime}`
    );
    return eventEndDateTime < new Date();
  };

  // Storage のファイルを削除する関数
  const deleteFile = async (fileURL) => {
    if (!fileURL) return; // ファイルが存在しない場合は何もしない
    try {
      const storage = getStorage();
      const fileRef = ref(storage, fileURL);
      await deleteObject(fileRef);
      console.log("ファイル削除成功:", fileURL);
    } catch (error) {
      console.error("ファイル削除エラー:", error);
    }
  };

  if (!circles.length) {
    return <Nosession />;
  }

  return (
    <Container>
      <Button onClick={createCricle} className="mb-3">
        イベントを開催する
      </Button>
      <Row>
        {circles.map((circle) => (
          <Col
            key={circle.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="mb-5 d-flex"
          >
            <Link
              to={`/detail/${circle.id}`}
              key={circle.id}
              className="text-decoration-none"
            >
              <Card className="event">
                {circle.fileURL && (
                  <Card.Img
                    variant="top"
                    src={`${circle.fileURL}?w=100&h=160&fit=crop`}
                  />
                )}
                <Card.Body>
                  <Card.Title>{circle.name}</Card.Title>
                  <Card.Text>
                    {circle.detail.length > 30
                      ? `${circle.detail.substring(0, 30)}...`
                      : circle.detail}
                  </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  {circle.type === "対面" && (
                    <ListGroup.Item className="d-flex align-items-center">
                      <img src="/geo-alt.svg" alt="" className="me-2" />
                      <p className="mb-0">{circle.location}</p>
                    </ListGroup.Item>
                  )}
                  {circle.type === "対面+オンライン" && (
                    <ListGroup.Item className="d-flex align-items-center">
                      <img src="/geo-alt.svg" alt="" className="me-2" />
                      <p className="mb-0">{circle.location}&オンライン</p>
                    </ListGroup.Item>
                  )}
                  {circle.type === "オンライン" && (
                    <ListGroup.Item className="d-flex align-items-center">
                      <img src="/geo-alt.svg" alt="" className="me-2" />
                      <p className="mb-0">オンライン</p>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className="d-flex align-items-center">
                    <img src="/calendar2.svg" alt="" className="me-2" />
                    {circle.freq === "単発" ? (
                      <p className="mb-0">{circle.oneOff}</p>
                    ) : (
                      <p className="mb-0">{circle.freqInput}</p>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Meetups;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Detail({ user }) {
  const { id } = useParams();
  const [circle, setCircle] = useState(null);

  // idを使ってデータを取得する関数
  const getCircleDataById = async (id) => {
    const circleRef = doc(db, "circles", id);
    const circleSnapshot = await getDoc(circleRef);
    if (circleSnapshot.exists()) {
      return circleSnapshot.data();
    } else {
      console.log("No such document!");
      return null;
    }
  };

  useEffect(() => {
    const fetchCircleData = async () => {
      const circleData = await getCircleDataById(id);
      setCircle(circleData);
    };

    fetchCircleData();
  }, [id]);

  if (!circle) {
    return <div>Loading...</div>;
  }
  const currentDate = new Date();
  return (
    <Container className="detail">
      <Row>
        <h1 className="fs-1 mb-2">{circle.name}</h1>
        <Col sm={12} md={8}>
          <img src={circle.fileURL} alt="" className="img-fluid mb-4 image" />
          {circle.detail && (
            <div className="mb-2">
              <h2 className="fs-3 mb-0">概要</h2>
              <p>{circle.detail}</p>
            </div>
          )}
          {circle.events.filter((event) => new Date(event.date) >= currentDate)
            .length > 0 && (
            <div>
              <h2 className="fs-3">イベントスケジュール</h2>
              <ul className="list-unstyled">
                {circle.events
                  .filter((event) => new Date(event.date) >= currentDate)
                  .map((event, index) => (
                    <li key={index} className="border mb-3 p-2 fs-5">
                      <h3>
                        {event.date}{" "}
                        {event.startTime
                          ? `${event.startTime} 〜 ${event.endTime || ""}`
                          : event.endTime
                          ? `開始時刻未定 〜 ${event.endTime}`
                          : ""}
                      </h3>
                      <div>
                        {circle.type === "対面" && (
                          <div className="d-flex align-items-center">
                            <img
                              src="/geo-alt.svg"
                              alt=""
                              className="me-2 icon"
                            />
                            <p className="mb-0">{event.eventlocation}</p>
                          </div>
                        )}
                        {circle.type === "対面+オンライン" && (
                          <div className="d-flex align-items-center">
                            <img
                              src="/geo-alt.svg"
                              alt=""
                              className="me-2 icon"
                            />
                            <p className="mb-0">
                              {event.eventlocation}&オンライン
                            </p>
                          </div>
                        )}
                        {circle.type === "オンライン" && (
                          <div className="d-flex align-items-center">
                            <img
                              src="/geo-alt.svg"
                              alt=""
                              className="me-2 icon"
                            />
                            <p className="mb-0">オンライン</p>
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-center">
                        {(circle.type === "対面" ||
                          circle.type === "対面+オンライン") && (
                          <div className="d-flex align-items-center">
                            <img
                              src="/people.svg"
                              alt=""
                              className="me-2 icon"
                            />
                            {event.inPersonCapacity ? (
                              <p className="mb-0">
                                対面参加人数：{event.inpersonMember.length}/
                                {event.inPersonCapacity}人
                              </p>
                            ) : (
                              <p className="mb-0">
                                対面参加人数：{event.inpersonMember.length}
                                人(参加人数制限なし)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-center">
                        {(circle.type === "対面+オンライン" ||
                          circle.type === "オンライン") && (
                          <div className="d-flex align-items-center">
                            <img
                              src="/people.svg"
                              alt=""
                              className="me-2 icon"
                            />
                            {event.onlineCapacity ? (
                              <p className="mb-0">
                                オンライン参加人数：{event.onlineMember.length}/
                                {event.onlineCapacity}人
                              </p>
                            ) : (
                              <p className="mb-0">
                                オンライン参加人数：{event.onlineMember.length}
                                人(参加人数制限なし)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </Col>
        <Col sm={12} md={4}>
          <div className="border-bottom mb-2">
            <div className="d-flex align-items-center">
              <img src="/calendar2.svg" alt="" className="me-2" />
              <p className="mb-0">開催日時/頻度</p>
            </div>
            {circle.freq === "単発" ? (
              <div className="content">
                <b className="mb-0 pb-1">{circle.oneOff}</b>
              </div>
            ) : (
              <div className="content">
                <b className="mb-0 pb-1">{circle.freqInput}</b>
              </div>
            )}
          </div>

          {circle.type === "対面" && (
            <div className="border-bottom mb-2">
              <div className="d-flex align-items-center">
                <img src="/geo-alt.svg" alt="" className="me-2" />
                <p className="mb-0">開催場所</p>
              </div>
              <div className="content">
                <b className="mb-0 pb-1">{circle.location}</b>
              </div>
            </div>
          )}
          {circle.type === "オンライン" && (
            <div className="border-bottom mb-2">
              <div className="d-flex align-items-center">
                <img src="/geo-alt.svg" alt="" className="me-2" />
                <p className="mb-0">開催形式</p>
              </div>
              <div className="content">
                <b className="mb-0 pb-1">オンライン</b>
              </div>
            </div>
          )}
          {circle.type === "対面+オンライン" && (
            <div className="border-bottom mb-2">
              <div className="d-flex align-items-center">
                <img src="/geo-alt.svg" alt="" className="me-2" />
                <p className="mb-0">開催場所</p>
              </div>
              <div className="content">
                <b className="mb-0 pb-1">{circle.location}&オンライン</b>
              </div>
            </div>
          )}
          {circle.fee && (
            <div className="border-bottom mb-2">
              <div className="d-flex align-items-center">
                <img src="/currency-yen.svg" alt="" className="me-2" />
                <p className="mb-0">参加費用</p>
              </div>
              <div className="content">
                <b className="mb-0 pb-1">{circle.fee}</b>
              </div>
            </div>
          )}
          <Link to={`/chat/${id}`} className="text-decoration-none chat">
            <div className="d-flex align-items-center">
              <img src="/wechat.svg" alt="" className="me-2" />
              <p className="mb-0">チャット</p>
            </div>
          </Link>
          <h2 className="fs-5 mt-3">活動の記録</h2>
          <Link to={`/blog/${id}`} className="text-decoration-none text-center">
            <p>Show more</p>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default Detail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  getCircleDataById,
  updateCircleEvents,
  newMember,
  removeMember,
  joinEvent,
  cancelEvent,
} from "./dbControl";
import { useNavigate } from "react-router-dom";
import AddEvent from "./AddEvent";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { RingLoader } from "react-spinners";

function Detail({ user }) {
  const { id } = useParams();
  const [circle, setCircle] = useState(null);
  const [addEvent, setAddEvent] = useState(false);
  const [key, setKey] = useState(false);

  const navigate = useNavigate();

  // 過去イベントを削除するロジック
  const filterExpiredEvents = (events) => {
    const currentDate = new Date();
    return events.filter((event) => {
      const endTime = event.endTime || "23:59"; // eventからendTimeを取得するように修正
      return new Date(`${event.date}T${endTime}`) >= currentDate;
    });
  };

  const fetchCircleData = async () => {
    const circleData = await getCircleDataById(id);

    if (circleData) {
      const filteredEvents = filterExpiredEvents(circleData.events);

      // 期限切れのイベントがある場合にFirestoreを更新
      if (filteredEvents.length !== circleData.events.length) {
        await updateCircleEvents(id, filteredEvents);
      }

      setCircle({ ...circleData, events: filteredEvents });
    }
  };
  useEffect(() => {
    fetchCircleData();
  }, [id]);
  const handleRemoveMember = async () => {
    await removeMember(id, user.uid, navigate);
    fetchCircleData(); // removeMember後に再度データを取得
  };
  const handleNewMember = async(cId, uId, type) => {
    await newMember(cId, uId, type);
    fetchCircleData();
  }
  const handleCancelEvent = async (cId, uId, eventIdentify) => {
    await cancelEvent(cId, uId, eventIdentify);
    fetchCircleData();
  }
  const handleJoinEvent = async (type, cId, uId, eventIdentify) => {
    await joinEvent(type, cId, uId, eventIdentify);
    fetchCircleData();
  }

  useEffect(() => {
    if(!addEvent){
      fetchCircleData()
    }
  }, [addEvent])

  if (!circle) {
    return <div className="d-flex justify-content-center mt-4">
    <RingLoader size={48} color="blue" />
  </div>;
  }
  return (
    <Container className="detail" key={key}>
      <AddEvent addEvent={addEvent} setAddEvent={setAddEvent} circle={circle} />
      <Row>
        <div className="d-flex align-items-start justify-content-between">
          <h1 className="fs-1 mb-2">{circle.name}</h1>
          {user && circle.host.includes(user.uid) && (
            <Button className="rounded-pill mb-0">編集する</Button>
          )}
        </div>
        <Col sm={12} md={8}>
          <img
            src={circle.fileURL}
            alt=""
            className="img-fluid mb-4 image"
          />
          {circle.detail && (
            <div className="mb-2">
              <h2 className="fs-3 mb-0">概要</h2>
              <p>{circle.detail}</p>
            </div>
          )}
          {user &&
            circle.members.includes(user.uid) &&
            circle.freq === "単発" &&
            (circle.type === "オンライン" ||
              circle.type === "対面+オンライン") && (
              <div>
                <h>オンライン参加の方へ</h>
                {circle.oneOffURL &&
                (new Date(circle.oneOffURLDate) <= new Date() ||
                  !circle.oneOffURLDate ||
                  circle.host.includes(user.uid)) ? (
                  <div>
                    <div>
                      <b>URL : </b>
                      <a
                        href={
                          circle.oneOffURL.startsWith("http")
                            ? circle.oneOffURL
                            : `https://${circle.oneOffURL}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {circle.oneOffURL}
                      </a>
                    </div>
                    {circle.oneOffPass && (
                      <div>
                        <div className="mt-2">
                          <b>パスワード :</b> {circle.oneOffPass}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p>オンライン参加のURLはまだ公開されていません</p>
                  </div>
                )}
              </div>
            )}
          {circle.freq === "複数回" && circle.events.length === 0 && (
            <div>
              <h2 className="fs-3">イベントスケジュール</h2>
              <p>現在開催予定のイベントはありません</p>
              {user && circle.host.includes(user.uid) && (
                <Button
                  variant="primary mt-3r"
                  className=""
                  onClick={() => setAddEvent(true)}
                >
                  イベントを追加する
                </Button>
              )}
            </div>
          )}
          {circle.events && circle.events.length > 0 && (
            <div>
              <ul className="list-unstyled event">
                {circle.events.map((event, index) => (
                  <li key={index} className="border mb-3 p-2 fs-5">
                    <h3>
                      {event.date.replace(/-/g, "/")}{" "}
                      {event.startTime
                        ? `${event.startTime} 〜 ${event.endTime || ""}`
                        : event.endTime
                        ? `開始時刻未定 〜 ${event.endTime}`
                        : ""}
                    </h3>
                    <div>
                      {event.type === "対面" && (
                        <div className="d-flex align-items-center">
                          <img
                            src="/geo-alt.svg"
                            alt=""
                            className="me-2 icon"
                          />
                          <p className="mb-0">{event.eventlocation}</p>
                        </div>
                      )}
                      {event.type === "対面+オンライン" && (
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
                      {event.type === "オンライン" && (
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
                      {(event.type === "対面" ||
                        event.type === "対面+オンライン") && (
                        <div className="d-flex align-items-center">
                          <img src="/people.svg" alt="" className="me-2 icon" />
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
                      {(event.type === "対面+オンライン" ||
                        event.type === "オンライン") && (
                        <div className="d-flex align-items-center">
                          <img src="/people.svg" alt="" className="me-2 icon" />
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
                    {user &&
                      circle.members.includes(user.uid) &&
                      (event.type === "オンライン" ||
                        event.type === "対面+オンライン") && (
                        <div>
                          {event.url &&
                          (new Date(event.publishDate) <= new Date() ||
                            !event.publishDate ||
                            circle.host.includes(user.uid)) ? (
                            <div>
                              <div>
                                <b>URL : </b>
                                <a
                                  href={
                                    event.url.startsWith("http")
                                      ? circle.url
                                      : `https://${event.url}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {event.url}
                                </a>
                              </div>
                              {event.password && (
                                <div>
                                  <b className="mt-2">パスワード : </b>
                                  {event.password}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p>オンライン参加のURLはまだ公開されていません</p>
                            </div>
                          )}
                        </div>
                      )}
                    {event.notes && (
                      <div>
                        <b className="mt-2 fs-5">概要</b>
                        <p>{event.notes}</p>
                      </div>
                    )}

                    {user &&
                      circle.members.includes(user.uid) &&
                      (event.onlineMember.includes(user.uid) ||
                        event.inpersonMember.includes(user.uid)) && (
                        <div className="text-center mt-3 mb-2">
                          <Button
                            variant="danger mt-3r"
                            className="d-block mx-auto my-3"
                            onClick={() =>
                              handleCancelEvent(id, user.uid, event.identify)
                            }
                          >
                            参加キャンセル
                          </Button>
                        </div>
                      )}
                    {user &&
                      circle.members.includes(user.uid) &&
                      ((event.type === "オンライン" &&
                        !event.onlineMember.includes(user.uid)) ||
                        (event.type === "対面" &&
                          !event.inpersonMember.includes(user.uid))) && (
                        <div className="text-center mt-3 mb-2">
                          <Button
                            variant="primary mt-3r"
                            className="d-block mx-auto my-3"
                            onClick={() =>
                              handleJoinEvent(
                                event.type,
                                id,
                                user.uid,
                                event.identify
                              )
                            }
                          >
                            参加登録
                          </Button>
                        </div>
                      )}
                    {user &&
                      circle.members.includes(user.uid) &&
                      event.type === "対面+オンライン" &&
                      !event.inpersonMember.includes(user.uid) &&
                      !event.onlineMember.includes(user.uid) && (
                        <div className="d-flex justify-content-evenly mt-3 mb-2">
                          <Button
                            variant="primary mt-3r"
                            className="d-block mx-auto my-3"
                            onClick={() =>
                              handleJoinEvent("対面", id, user.uid, event.identify)
                            }
                          >
                            対面参加
                          </Button>
                          <Button
                            variant="primary mt-3r"
                            className="d-block mx-auto my-3"
                            onClick={() =>
                              handleJoinEvent(
                                "オンライン",
                                id,
                                user.uid,
                                event.identify
                              )
                            }
                          >
                            オンライン参加
                          </Button>
                        </div>
                      )}
                  </li>
                ))}
              </ul>
              {user &&
                circle.host.includes(user.uid) &&
                circle.freq === "複数回" && (
                  <Button
                    variant="primary mt-3r"
                    className="d-block mx-auto my-3"
                    onClick={() => setAddEvent(true)}
                  >
                    イベントを追加する
                  </Button>
                )}
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
          {circle.freq === "複数回" && (
            <div className="border-bottom mb-2">
              <div className="d-flex align-items-center">
                <img src="/person.svg" alt="" className="me-2" />
                <p className="mb-0">
                  グループメンバー({circle.members.length}人)
                </p>
              </div>
            </div>
          )}
          {circle.freq === "単発" && circle.type === "対面" && (
            <div className="border-bottom mb-2">
              <div className="d-flex align-items-center">
                <img src="/people.svg" alt="" className="me-2" />
                {circle.oneOffInpersonCapa ? (
                  <p className="mb-0">
                    参加人数: {circle.oneOffInpersonMember.length}人(定員
                    {circle.oneOffInpersonCapa}人)
                  </p>
                ) : (
                  <p className="mb-0">
                    参加人数: {circle.oneOffInpersonMember.length}人
                  </p>
                )}
              </div>
            </div>
          )}
          {circle.freq === "単発" && circle.type === "オンライン" && (
            <div className="border-bottom mb-2">
              <div className="d-flex align-items-center">
                <img src="/people.svg" alt="" className="me-2" />
                {circle.oneOffInpersonCapa ? (
                  <p className="mb-0">
                    参加人数: {circle.oneOffOnlineMember.length}人(定員
                    {circle.oneOffOnlineCapa}人)
                  </p>
                ) : (
                  <p className="mb-0">
                    参加人数: {circle.oneOffOnlineMember.length}人
                  </p>
                )}
              </div>
            </div>
          )}
          {circle.freq === "単発" && circle.type === "対面+オンライン" && (
            <div>
              <div className="mb-2">
                <div className="d-flex align-items-center">
                  <img src="/people.svg" alt="" className="me-2" />
                  {circle.oneOffInpersonCapa ? (
                    <p className="mb-0">
                      参加人数: {circle.oneOffInpersonMember.length}人(定員
                      {circle.oneOffInpersonCapa}人)
                    </p>
                  ) : (
                    <p className="mb-0">
                      参加人数: {circle.oneOffInpersonMember.length}人
                    </p>
                  )}
                </div>
              </div>
              <div className="border-bottom mb-2">
                <div className="d-flex align-items-center">
                  <img src="/people.svg" alt="" className="me-2" />
                  {circle.oneOffInpersonCapa ? (
                    <p className="mb-0">
                      参加人数: {circle.oneOffOnlineMember.length}人(定員
                      {circle.oneOffOnlineCapa}人)
                    </p>
                  ) : (
                    <p className="mb-0">
                      参加人数: {circle.oneOffOnlineMember.length}人
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <Link to={`/chat/${id}`} className="text-decoration-none chat">
            <div className="d-flex align-items-center">
              <img src="/wechat.svg" alt="" className="me-2" />
              <p className="mb-0">チャット</p>
            </div>
          </Link>
          {user &&
            !circle.members.includes(user.uid) &&
            circle.freq === "複数回" && (
              <Button
                variant="primary mt-3r"
                className="d-block mx-auto my-3"
                onClick={() => handleNewMember(id, user.uid, "group")}
              >
                グループに参加する
              </Button>
            )}
          {user &&
            !circle.members.includes(user.uid) &&
            circle.freq === "単発" &&
            (circle.type === "対面" || circle.type === "オンライン") && (
              <Button
                variant="primary mt-3r"
                className="d-block mx-auto my-3"
                onClick={() => handleNewMember(id, user.uid, circle.type)}
              >
                参加する
              </Button>
            )}
          {user &&
            !circle.members.includes(user.uid) &&
            circle.freq === "単発" &&
            circle.type === "対面+オンライン" && (
              <div>
                <Button
                  variant="primary mt-3r"
                  className="d-block mx-auto my-3"
                  onClick={() => handleNewMember(id, user.uid, "対面")}
                >
                  対面で参加する
                </Button>
                <Button
                  variant="primary mt-3r"
                  className="d-block mx-auto my-3"
                  onClick={() => handleNewMember(id, user.uid, "オンライン")}
                >
                  オンラインで参加する
                </Button>
              </div>
            )}

          {user &&
            circle.members.includes(user.uid) &&
            circle.freq === "単発" && (
              <Button
                variant="danger mt-3r"
                className="d-block mx-auto my-3"
                onClick={() => handleRemoveMember()}
              >
                参加を辞退する
              </Button>
            )}
          {user &&
            circle.members.includes(user.uid) &&
            circle.freq === "複数回" && (
              <Button
                variant="danger mt-3r"
                className="d-block mx-auto my-3"
                onClick={() => handleRemoveMember()}
              >
                グループを退会する
              </Button>
            )}
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

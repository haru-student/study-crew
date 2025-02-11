import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  getCircleDataById,
  newMember,
  removeMember,
  joinEvent,
  cancelEvent,
  removeEvent,
  expiredEvent,
  getMembersInfo,
  getBlogs,
  getReviews,
  getProfile,
  deleteReview,
} from "./dbControl";
import { useNavigate } from "react-router-dom";
import AddEvent from "./AddEvent";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import EditGroup from "./EditGroup";
import ConfirmDeleteGroup from "./ConfirmDeleteGroup";
import EditEvent from "./EditEvent";
import { toast } from "react-toastify";
import Review from "./Review";
import AwesomeStarsRating from "react-awesome-stars-rating";
import { IpContext } from "./IpContext";
import Report from "./Report";

function Detail({ user }) {
  const { id } = useParams();
  const [circle, setCircle] = useState(null);
  const [addEvent, setAddEvent] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const [editEvent, setEditEvent] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState("");
  const [hosts, setHost] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [addReview, setAddReview] = useState(false);
  const [usersData, setUsersData] = useState({});
  const [report, setReport] = useState(false);
  const [improper, setImproper] = useState(null);
  const ip = useContext(IpContext);

  const navigate = useNavigate();

  const handleReport = async (msg) => {
    setImproper(msg);
    setReport(true);
  };

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
        await expiredEvent(id, filteredEvents);
      }

      setCircle({ ...circleData, events: filteredEvents });
    }
  };
  useEffect(() => {
    fetchCircleData();
  }, [id]);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogData = await getBlogs(id); // 非同期でブログデータを取得
        setBlogs(blogData); // 取得後にステートを更新
      } catch (error) {
        console.log("ブログの取得に失敗しました", error);
      }
    };
    const fetchReviews = async () => {
      try {
        const reviewData = await getReviews(id);
        setReviews(reviewData);
      } catch (error) {
        console.log(error);
      }
    };

    if (circle) {
      // circle が存在する場合にブログを取得
      fetchBlogs();
      fetchReviews();
    }
  }, [circle]);

  useEffect(() => {
    const fetchUsersData = async () => {
      const userIds = [...new Set(reviews.map((msg) => msg.user))];
      const usersDataTemp = {}; // 一時的なオブジェクトでユーザー情報を集める

      for (let userId of userIds) {
        const reviewer = await getProfile(userId);
        if (reviewer) {
          // reviewer.exists() は不要
          usersDataTemp[userId] = {
            // オブジェクトを初期化
            icon: reviewer.icon,
            name: reviewer.name,
          };
        }
      }

      // 全てのユーザー情報をステートにセット
      setUsersData(usersDataTemp);
    };

    if (reviews.length > 0) {
      fetchUsersData(); // reviews が更新されたらユーザー情報を取得
    }
  }, [reviews]);

  const fetchMembersInfo = async () => {
    if (circle) {
      const hostData = await getMembersInfo(circle.host);
      setHost(hostData);
    }
  };
  useEffect(() => {
    fetchMembersInfo();
  }, [circle]);
  const handleRemoveMember = async () => {
    if (circle.host.includes(user.uid) && circle.host.length === 1) {
      setConfirm(true);
    } else {
      try {
        await removeMember(id, user.uid, navigate);
        toast.success("退会しました");
      } catch {
        toast.error("退会に失敗しました");
      }
    }
    fetchCircleData(); // removeMember後に再度データを取得
  };

  const handleDeleteReview = async (reviewId) => {
    if (!id || !reviewId) return;
    try {
      await deleteReview(id, reviewId, user.uid);
      fetchCircleData();
    } catch (error) {
      console.error(error);
    }
  };
  const handleNewMember = async (cId, uId, type) => {
    await newMember(cId, uId, type);
    fetchCircleData();
  };
  const handleCancelEvent = async (cId, uId, eventIdentify) => {
    await cancelEvent(cId, uId, eventIdentify);
    fetchCircleData();
  };
  const handleJoinEvent = async (type, cId, uId, eventIdentify) => {
    await joinEvent(type, cId, uId, eventIdentify);
    fetchCircleData();
  };
  const handleRemoveEvent = async (id, event) => {
    await removeEvent(id, event, ip);
    fetchCircleData();
  };
  const handleUpdateEvent = async (event) => {
    setTarget(event);
  };
  useEffect(() => {
    if (target) {
      setEditEvent(true);
    }
  }, [target]);

  useEffect(() => {
    if (!addEvent && !editGroup && !editEvent && !addReview) {
      fetchCircleData();
    }
  }, [addEvent, editGroup, editEvent, addReview]);

  if (!circle || loading) {
    return (
      <div className="d-flex justify-content-center mt-4">
        <RingLoader size={48} color="blue" />
      </div>
    );
  }
  return (
    <Container className="detail" key={circle.id}>
      <AddEvent addEvent={addEvent} setAddEvent={setAddEvent} circle={circle} />
      <Report report={report} setReport={setReport} user={user ? user.uid : null} data={improper}/>
      <Review
        addReview={addReview}
        setAddReview={setAddReview}
        circle={circle}
        user={user}
      />
      <EditGroup
        editGroup={editGroup}
        setEditGroup={setEditGroup}
        circle={circle}
        setLoading={setLoading}
      />
      <ConfirmDeleteGroup
        confirm={confirm}
        setConfirm={setConfirm}
        circle={circle}
        user={user}
        setLoading={setLoading}
      />
      <EditEvent
        editEvent={editEvent}
        setEditEvent={setEditEvent}
        circle={circle}
        event={target}
      />
      <Row>
        <div className="d-flex align-items-start justify-content-between">
          <h1 className="fs-1 mb-2">{circle.name}</h1>
          {user && circle.host.includes(user.uid) ? (
            <Button
              className="rounded-pill mb-0"
              onClick={() => setEditGroup(true)}
            >
              編集する
            </Button>
          ) : (
            <p className="ms-2 mb-0" onClick={() => handleReport(circle)}>
            ︙
          </p>
          )}
        </div>
        <Col sm={12} md={8}>
          <img src={circle.fileURL} alt="" className="img-fluid mb-4 image" />
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
                  <li
                    key={index}
                    className="border mb-3 p-2 fs-5 position-relative"
                  >
                    {user && circle.host.includes(user.uid) && (
                      <div>
                        <img
                          src="/trash.svg"
                          alt=""
                          className="position-absolute top-0 end-0 mt-1 me-1 icon"
                          onClick={() => {
                            handleRemoveEvent(id, event);
                          }}
                        />
                        <img
                          src="/pencil-square.svg"
                          alt=""
                          className="position-absolute top-0 end-0 mt-5 me-1 icon"
                          onClick={() => {
                            handleUpdateEvent(event);
                          }}
                        />
                      </div>
                    )}
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
                              handleJoinEvent(
                                "対面",
                                id,
                                user.uid,
                                event.identify
                              )
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
          <h2 className="fs-3 mb-2 mt-3">クチコミ</h2>
          {reviews.length > 0 ? (
            reviews.map((review, index) => {
              const reviewer = usersData[review.user];
              if (!reviewer) return null;
              return (
                <div
                  key={index}
                  className="border-bottom pb-3 position-relative"
                >
                  {user && user.uid === review.user ? (
                    <img
                      src="/trash.svg"
                      alt="削除アイコン"
                      className="position-absolute top-0 end-0 mt-1 me-1 icon"
                      onClick={() => {
                        handleDeleteReview(review.id);
                      }}
                    />
                  ) : (
                    <p className="position-absolute top-0 end-0 mt-1 me-1 icon" onClick={() => handleReport(review)}>
                    ︙
                  </p>
                  )}
                  <div className="d-flex align-items-center">
                    <img
                      src={reviewer?.icon} // icon がない場合はデフォルト画像を表示
                      alt="" // name がない場合は 'Unknown' を表示
                      className="me-2 rounded-circle icon"
                    />
                    <p className="mb-0 fs-5">{reviewer?.name || "Unknown"}</p>
                  </div>
                  <div className="ms-2">
                    <div className="value">
                      <AwesomeStarsRating
                        value={review.data.value} // 表示する星の数（例: 3.5）
                        readonly={true} // ユーザーが変更できないようにする
                      />
                    </div>
                    {review.data.atmosphere && (
                      <p className="mt-2 mb-1">
                        雰囲気：{review.data.atmosphere}
                      </p>
                    )}
                    {review.data.age && (
                      <p className="mb-1">年齢層：{review.data.age}</p>
                    )}
                    {review.data.detail && <p>{review.data.detail}</p>}
                  </div>
                </div>
              );
            })
          ) : (
            <p>まだクチコミはありません</p>
          )}

          {user &&
            circle &&
            circle.members.includes(user.uid) &&
            !circle.reviewers.includes(user.uid) &&
            !circle.host.includes(user.uid) && (
              <Button
                variant="primary mt-3r"
                className="d-block mx-auto my-3"
                onClick={() => setAddReview(true)}
              >
                クチコミを投稿する
              </Button>
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
                <p className="mb-1">
                  グループメンバー({circle.members.length}人)
                </p>
              </div>
              {hosts.length > 0 && (
                <ul className="list-unstyled ms-2">
                  {hosts.map((host, index) => (
                    <li
                      key={index}
                      className="rounded-pill mini-list badge pe-3 py-1 mb-2"
                    >
                      <div className="d-flex align-items-center">
                        <img src={host.icon} alt="" className="me-2" />
                        <p className="mb-0">{host.name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to={`/members/${id}`}
                className="text-decoration-none text-center"
              >
                <p className="mb-0">参加メンバー一覧を見る</p>
              </Link>
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
              <Link
                to={`/members/${id}`}
                className="text-decoration-none text-center"
              >
                <p className="mb-0">参加メンバー一覧を見る</p>
              </Link>
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
              <Link
                to={`/members/${id}`}
                className="text-decoration-none text-center"
              >
                <p className="mb-0">参加メンバー一覧を見る</p>
              </Link>
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
                  {circle.oneOffOnlineCapa ? (
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
                <Link
                  to={`/members/${id}`}
                  className="text-decoration-none text-center"
                >
                  <p className="mb-0">参加メンバー一覧を見る</p>
                </Link>
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
          <h2 className="fs-4 mt-3 mb-3">活動の記録</h2>
          {blogs.length > 0 ? (
            <ul className="list-unstyled ms-2">
              {blogs.slice(0, 3).map((blog, index) => (
                <li key={index} className="position-relative border-botom">
                  <h5>{blog.data.title}</h5>
                  <p className="ms-1">{blog.data.content}</p>
                  {blog.data.image && (
                    <img
                      src={blog.data.image}
                      alt=""
                      className="img-fluid mb-4 d-block mx-auto"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>ブログはまだ投稿されていません</p>
          )}
          <Link to={`/blog/${id}`} className="text-decoration-none text-center">
            <p>Show more</p>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default Detail;

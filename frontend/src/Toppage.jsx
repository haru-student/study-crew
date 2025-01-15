import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import { Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useNavigate, Link } from "react-router-dom";
import { getProfile } from "./dbControl";
import { RingLoader } from "react-spinners";
import { getCircleDataById } from "./dbControl";
import DeleteAccount from "./DeleteAccount";

function Toppage({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [circles, setCircles] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (user.uid) {
          const userProfile = await getProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (profile && profile.groups.length > 0) {
      Promise.all(profile.groups.map((id) => getCircleDataById(id)))
        .then(setCircles)
        .catch((error) => console.error("Failed to fetch circle data:", error));
    } else {
      console.error();
    }
  }, [profile]);

  return (
    <>
      <DeleteAccount confirm={confirm} setConfirm={setConfirm} user={user}/>
      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <RingLoader size={48} color="blue" />
        </div>
      ) : (
        <Container fluid className="toppage">
          <div className="position-relative text-center border shadow p-3">
            <div className="position-absolute top-0 start-0 profile-title">Your Profile</div>
            <Image
              src={profile?.icon || user?.photoURL}
              alt="Profile Image"
              roundedCircle
              fluid
              className="mb-3 profile-icon mt-3"
            />
            <h3>{profile?.name || user?.displayName || "ゲストユーザー"}</h3>
            {profile?.introduction ? (
              <p>{profile.introduction}</p>
            ) : (
              <p>プロフィールは設定されていません。</p>
            )}
            <Button className="mb-5" onClick={() => navigate("/editprofile")}>
              プロフィールを編集
            </Button>
            <div className="text-center mb-5">
              <h3 className="mb-3">参加中のグループ</h3>
              {profile && profile.groups ? (
                profile.groups.length > 0 ? (
                  <ul className="list-unstyled">
                    {circles.map((circle) => (
                      <Link
                        to={`/detail/${circle.id}`}
                        key={circle.id}
                        className="text-decoration-none"
                      >
                        <li key={circle.id}>
                          <div className="position-relative mb-3 d-flex align-items-center profile-group text-center mx-auto p-0 group pe-2">
                            {circle.host.includes(user.uid) && (
                              <div className="position-absolute top-0 end-0 rounded-pill host-label px-2 py-1 fw-bold">
                                ホスト
                              </div>
                            )}
                            <Image
                              src={circle.fileURL}
                              alt=""
                              fluid
                            ></Image>
                            <div className="mx-auto">
                              <b className="mb-0">{circle.name}</b>
                              <p className="mb-0">
                                最終更新日：
                                {new Date(circle.update).toLocaleString(
                                  "ja-JP",
                                  {
                                    timeZone: "Asia/Tokyo",
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>
                ) : (
                  <p>現在参加中のグループはありません。</p>
                )
              ) : (
                <p>プロフィールの取得に失敗しました。</p>
              )}
            </div>
          </div>
          <div onClick={() => {setConfirm(true)}} className="deleteAccount mx-auto mt-5">アカウントを削除する</div>
        </Container>
      )}
    </>
  );
}

export default Toppage;

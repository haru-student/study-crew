import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import { Row, Col, Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Navigate, useNavigate } from "react-router-dom";
import {getProfile} from "./dbControl";
import { RingLoader } from "react-spinners";

function Toppage({ user }) {
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user.uid) {
        const userProfile = await getProfile(user.uid);
        setProfile(userProfile);
      }
    };

    fetchProfile();
  }, [user]);
  useEffect(() => {
    setLoading(false);
    if (profile === null) {
      navigate("/editprofile");
    }
  }, [profile, navigate]);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <RingLoader size={48} color="blue" />
        </div>
      ) : (
        <Container fluid className="toppage text-center">
          {profile ? (
            <>
              <Image
                src={profile.icon || user?.photoURL}
                alt="Profile Image"
                roundedCircle
                fluid
                className="mb-3"
              />
              <h3>{profile.name || user?.displayName}</h3>
              {profile.introduction && <p>{profile.introduction}</p>}
              <Button className="mb-5">プロフィールを編集</Button>
              <div className="text-center mb-5">
                <h3 className="mb-2">参加中のグループ</h3>
                <p>現在参加中のグループはありません。</p>
              </div>
            </>
          ) : (
            <p>プロフィールが見つかりません。編集ページに移動します。</p>
          )}
        </Container>
      )}
    </>
  );
}

export default Toppage;
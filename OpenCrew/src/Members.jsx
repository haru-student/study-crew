import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCircleDataById, getMembersInfo } from "./dbControl";
import { RingLoader } from "react-spinners";
import { Button, Container } from "react-bootstrap";
import Block from "./Block";
import AddHost from "./AddHost";

function Members({ user }) {
  const { id } = useParams();
  const [circle, setCircle] = useState(null);
  const [hosts, setHost] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addHost, setAddHost] = useState(false);
  const [block, setBlock] = useState(false);
  const [blockTarget, setBlockTarget] = useState(null);
  const [target, setTarget] = useState(null);

  const fetchCircleData = async () => {
    const circleData = await getCircleDataById(id);
    if (circleData) {
      setCircle({ ...circleData });
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchCircleData();
  }, [id]);

  const fetchMembersInfo = async () => {
    if (circle) {
      // ホストデータを取得
      const hostData = await getMembersInfo(circle.host);
      setHost(hostData);
  
      // membersが存在する場合
      if (circle.members) {
        // ホスト以外のメンバーをフィルタリング
        const nonHost = circle.members.filter((member) => !circle.host.includes(member));
  
        // nonHostが存在する場合のみ、membersデータを取得
        if (nonHost.length > 0) {
          const membersData = await getMembersInfo(nonHost);
          setMembers(membersData);
        } else {
          // nonHostがいない場合は、membersを空にする
          setMembers([]);
        }
      } else {
        setMembers([]); // circle.membersが存在しない場合は空配列にする
      }
    }
    setLoading(false);
  };
  

  useEffect(() => {
    if (target) {
      console.log(target)
      console.log(circle.id);
      setAddHost(true);
    }
  }, [target])
  useEffect(() => {
    if (blockTarget) {
      console.log(blockTarget)
      setBlock(true);
    }
  }, [blockTarget])
  useEffect(() => {
    if (!addHost){
      setTarget(null);
      setLoading(true);
      setTimeout(async() => {
        await fetchCircleData();
        setLoading(false);
      }, 1000)
    }
  },[addHost])
  useEffect(() => {
    if (!block){
      setBlockTarget(null);
      setLoading(true);
      setTimeout(async() => {
        await fetchCircleData();
        setLoading(false);
      }, 1000)
    }
  },[block])

  useEffect(() => {
    fetchMembersInfo();
  }, [circle]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-4">
        <RingLoader size={48} color="blue" />
      </div>
    );
  }

  return (
    <Container className="toppage">
      {circle && (
        <div>
          <AddHost
            addHost={addHost}
            setAddHost={setAddHost}
            id={circle.id}
            target={target}
          />
          <Block
            block={block}
            setBlock={setBlock}
            id={circle.id}
            blockTarget={blockTarget}
          />
        </div>
      )}
      {hosts.length > 0 && (
        <div>
          <h1 className="fs-3 mt-3">管理者メンバー</h1>
          <ul className="list-unstyled ms-2 text-start">
            {hosts.map((host, index) => (
              <li
                key={index}
                className="rounded-pill member-list badge pe-3 py-auto mb-3"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={host.icon}
                    alt=""
                    className="me-3 mini-icon"
                  />
                  <div className="text-start">
                    <b className="fs-4">{host.name}</b>
                    <p className="mt-2 text-wrap">
                      {host.introduction && (
                        host.introduction
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {members.length > 0 && (
        <div>
          <h1 className="fs-3">参加メンバー</h1>
          <ul className="list-unstyled ms-2 text-start">
            {members.map((member, index) => (
              <li
                key={index}
                className="rounded-pill member-list badge pe-3 py-auto mb-3"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={member.icon}
                    alt=""
                    className="me-3 mini-icon"
                  />
                  <div className="text-start">
                    <b className="fs-4">{member.name}</b>
                    <p className="mt-2">
                      {member.introduction &&
                      member.introduction.length > 50 ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: member.introduction.replace(
                              /(.{50})(?=.)/g,
                              "$1<br />"
                            ),
                          }}
                        />
                      ) : (
                        member.introduction
                      )}
                    </p>
                    {user && circle.host.includes(user.uid) && (
                      <div className="d-flex justify-content-evenly mt-1 mb-2">
                        <Button
                          variant="primary mt-3r"
                          className="d-block mx-auto my-3 me-5"
                          onClick={() => {setTarget(member)}}
                        >
                          管理者権限の付与
                        </Button>
                        <Button
                          variant="danger mt-3r"
                          className="d-block mx-auto my-3"
                          onClick={() => {setBlockTarget(member)}}
                        >
                          ブロック
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

export default Members;

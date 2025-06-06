import React from 'react'
import {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Introduction() {
        const [user] = useAuthState(auth);
        return (
            <div  className="text-center">
            <Container className="introduction">
                <h1>Open Crewにようこそ！</h1>
                <p className="text-left">
                    <b>Open Crew</b>は、あなたの活動の仲間を見つけるためのサービスです。
                    初めての人でも事前にグループの雰囲気を把握し、参加しやすいような設計にしました。
                    このサイトを通して、新しいことにチャレンジしてみませんか？
                </p>
            </Container>
            <h2 className="my-4">features</h2>
            <Container fluid>
                <Row>
                    <Col sm={12} md={4} className="features pb-1 px-5">
                        <h3>クチコミ</h3>
                        <img src="/undraw_questions_g2px.svg" className="img-fluid py-5" alt="" />
                        <p>評価は五段階で行うだけでなく、グループの雰囲気や年齢層に関する質問で、ユーザーがより詳細なフィードバックを提供できるようにします。</p>
                    </Col>
                    <Col sm={12} md={4} className="features pb-1 px-5">
                        <h3>オープンチャット</h3>
                        <img src="/chatting.svg" className="img-fluid py-5" alt="" />
                        <p>グループごとのチャットは参加していない方も閲覧ができ、グループの雰囲気を把握できます。</p>
                    </Col>
                    <Col sm={12} md={4} className="features border-end pb-1 px-5">
                        <h3>ブログ機能</h3>
                        <img src="/notebook.svg" className="img-fluid py-5" alt="" />
                        <p>ブログを通して、グループの活動を簡単に知ることができます。</p>
                    </Col>
                </Row>
            </Container>
            </div>
        )
}

export default Introduction
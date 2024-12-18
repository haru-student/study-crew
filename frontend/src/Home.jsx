import React from 'react'
import {auth, provider} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Home() {
    const [user] = useAuthState(auth);
    return (
        <div  className="text-center">
        <Container className="toppage">
            <h1>Study Crewにようこそ！</h1>
            <p>
                <b>Study Crew</b>は、あなたの学びの仲間を見つけ、一緒に成長するためのサービスです。
            </p>
            
        </Container>
        <h2 class="my-4">features</h2>
        <Container fluid>
            <Row>
                <Col sm={12} md={4} className="features pb-1 px-5">
                    <h3>仲間を集める</h3>
                    <img src="/togeter.svg" class="img-fluid py-5" alt="" />
                    <p>勉強会の主催や開催中の勉強会に参加しよう！</p>
                </Col>
                <Col sm={12} md={4} className="features pb-1 px-5">
                    <h3>分野について話し合う</h3>
                    <img src="/chatting.svg" class="img-fluid py-5" alt="" />
                    <p>チャット機能を通じて分野でのグループチャット、勉強会ごとのチャットを活用しよう！</p>
                </Col>
                <Col sm={12} md={4} className="features border-end pb-1 px-5">
                    <h3>勉強会の記録を残す</h3>
                    <img src="/notebook.svg" class="img-fluid py-5" alt="" />
                    <p>動画や資料を残して後で勉強会の内容を見直せるようにしよう！</p>
                </Col>
            </Row>
        </Container>
        </div>
    )
}

export default Home

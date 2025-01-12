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
                <p>
                    <b>Open Crew</b>は、あなたの活動の仲間を見つけるためのサービスです。
                </p>
                
            </Container>
            <h2 className="my-4">features</h2>
            <Container fluid>
                <Row>
                    <Col sm={12} md={4} className="features pb-1 px-5">
                        <h3>仲間を集める</h3>
                        <img src="/togeter.svg" className="img-fluid py-5" alt="" />
                        <p>イベントの主催や開催中のイベントに参加しよう！</p>
                    </Col>
                    <Col sm={12} md={4} className="features pb-1 px-5">
                        <h3>分野について話し合う</h3>
                        <img src="/chatting.svg" className="img-fluid py-5" alt="" />
                        <p>チャット機能を通じて分野でのグループチャット、イベントごとのチャットを活用しよう！</p>
                    </Col>
                    <Col sm={12} md={4} className="features border-end pb-1 px-5">
                        <h3>Blog機能</h3>
                        <img src="/notebook.svg" className="img-fluid py-5" alt="" />
                        <p>活動の記録を残し見直せるようにしたり、他の人に活動を知ってもらおう</p>
                    </Col>
                </Row>
            </Container>
            </div>
        )
}

export default Introduction
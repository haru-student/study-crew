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
                        <h3>匿名Q&A</h3>
                        <img src="/undraw_questions_g2px.svg" className="img-fluid py-5" alt="" />
                        <p>参加前の不安、疑問を気軽に質問しよう！</p>
                    </Col>
                    <Col sm={12} md={4} className="features pb-1 px-5">
                        <h3>オープンチャット</h3>
                        <img src="/chatting.svg" className="img-fluid py-5" alt="" />
                        <p>グループごとのチャットは参加していない方も閲覧ができます。参加前にグループの雰囲気を見てみよう！</p>
                    </Col>
                    <Col sm={12} md={4} className="features border-end pb-1 px-5">
                        <h3>ブログ機能</h3>
                        <img src="/notebook.svg" className="img-fluid py-5" alt="" />
                        <p>グループの活動の雰囲気を知ってもらおう！</p>
                    </Col>
                </Row>
            </Container>
            </div>
        )
}

export default Introduction
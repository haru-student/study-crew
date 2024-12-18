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
        <Container fluid>
            <Row>
                <Col xs={12} sm={12} md={4} className="border-end pb-2 px-2"></Col>
                <Col xs={12} sm={12} md={4} className="border-end pb-2 px-2"></Col>
                <Col xs={12} sm={12} md={4} className="pb-2 px-2 tmp"></Col>
            </Row>
        </Container>
        </div>
    )
}

export default Home

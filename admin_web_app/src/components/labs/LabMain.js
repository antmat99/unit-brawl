import { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import Leaderboard from "../../components/common/Leaderboard"

import API from '../../API'

function LabMain(props) {

    const MainComponents = {
        Trace: 'trace',
        Leaderboard: 'leaderboard',
        MyResults: 'myresults',
        Info: 'info'
    }

    const { lab, editLab, deleteLab, stopLab, numberOfPlayers } = props;
    const [labElement, setLabElement] = useState([])
    const [component, setComponent] = useState(MainComponents.Trace)
    const [dirty, setDirty] = useState(false);
    const [isWarHappening, setIsWarHappening] = useState(false)
    const [isWarDone, setIsWarDone] = useState(false)
    const [leaderboard, setLeaderboard] = useState(undefined)

    useEffect(() => {
        if (lab !== undefined) {
            setLabElement(undefined)
            setDirty(true)
        }
    }, [lab])

    useEffect(() => {
        if (dirty) {
            createLabElement(lab);
            setDirty(false);
        }
    }, [dirty])

    const beginWar = async () => {
        setIsWarHappening(true)
        const leaderboard = await API.beginWar(lab.id)
        setLeaderboard(leaderboard)
        setIsWarHappening(false)
        setIsWarDone(true)
    }


    const createLabElement = (lab) => {
        const warYetToHappen = lab.leaderboard.every(entry => entry.position === 0);
        setComponent(MainComponents.Trace)
        const ret = []
        console.log('War yet to happen: ' + warYetToHappen)
        ret.push(
            
            <Container fluid key='container'>
                <Row>
                    <Col>
                        <h1>
                            {lab.name}
                        </h1>
                    </Col>
                    {
                        lab.expired && warYetToHappen ?
                            <Col style={{ justifyContent: 'flex-end' }}>
                                <Button onClick={() => beginWar()}>Begin war</Button>
                            </Col>
                            :
                            ''
                    }
                    <Col style={{ justifyContent: 'flex-end' }}>
                        <Button onClick={() => editLab()}>Edit</Button>
                    </Col>
                    {
                        lab.expired ?
                            ''
                            :
                            <Col style={{ justifyContent: 'flex-end' }}>
                                <Button onClick={() => stopLab()}>Stop</Button>
                            </Col>
                    }
                    <Col style={{ justifyContent: 'flex-end' }}>
                        <Button onClick={() => deleteLab()}>Delete</Button>
                    </Col>
                </Row>
                <Row>
                    {
                        lab.expired ?
                            <h4>
                                Expired: {lab.deadline}
                            </h4>
                            :
                            <h4>
                                Deadline: {lab.deadline}
                            </h4>
                    }
                </Row>
                <Row>
                    <Nav
                        variant='tabs'
                        className='ms-auto'
                        defaultActiveKey={MainComponents.Trace}
                        onSelect={(selectedKey) => {
                            setComponent(selectedKey);
                            setDirty(true);
                        }}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey={MainComponents.Trace}>Trace</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={MainComponents.Info}>Info</Nav.Link>
                        </Nav.Item>
                        {
                            lab.expired && isWarDone ?
                                <Nav.Item>
                                    <Nav.Link eventKey={MainComponents.Leaderboard}>Leaderboard</Nav.Link>
                                </Nav.Item>
                                :
                                ''
                        }
                    </Nav>
                </Row>
                <Row>
                    {component === MainComponents.Trace ?
                        <MainComponentTrace trace={lab.trace} />
                        :
                        ''
                    }
                    {component === MainComponents.Leaderboard ?
                        <MainComponentLeaderboard leaderboard={leaderboard} /> :
                        ''
                    }
                    {component === MainComponents.MyResults ?
                        <MainComponentResult result={lab.userResult} /> :
                        ''
                    }
                    {component === MainComponents.Info ?
                        <MainComponentInfo players={numberOfPlayers} lab={lab} /> :
                        ''
                    }
                </Row>
            </Container>
        )
        setLabElement(ret)
    }


    return (
        <>
            {
                lab === undefined ?
                    ''
                    :
                    labElement
            }
        </>

    )
}

function MainComponentTrace(props) {
    return (
        <div dangerouslySetInnerHTML={{ __html: props.trace }} />
    )
}

function MainComponentLeaderboard(props) {

    return (
        <Leaderboard resultList={props.leaderboard} />
    )
}

function MainComponentResult(props) {

    return (
        <>
            <p style={{ marginTop: '1rem' }}>Obtained points: {props.result.points}</p>
            <p>Position in leaderboard: {props.result.position}</p>
        </>
    )
}

function MainComponentInfo(props) {

    return (
        <>
            <p style={{ marginTop: '1rem' }}>Id: {props.lab.id}</p>
            <p>Number of players: {props.players}</p>
            <p>Max number of tests: {props.lab.testMaxNumber}</p>
            <p>Link to solution repository: {props.lab.linkToIdealSolution}</p>
        </>
    )
}

export default LabMain;
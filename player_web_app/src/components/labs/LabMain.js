import { useEffect, useState } from "react";
import { ProgressBar, Container, Row, Col, Nav, Button } from 'react-bootstrap';
import Leaderboard from "../../components/common/Leaderboard"
import LabProgress from './LabsComponents/LabProgress'
import Countdown from 'react-countdown';
import API from '../../API'


const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

function LabMain(props) {

    const MainComponents = {
        Trace: 'trace',
        Leaderboard: 'leaderboard',
        MyResults: 'myresults',
        Progress: 'progress'
    }

    const { lab, labsAttendedIds, joinLab, userLabRegionLeaderboard, editRepository } = props;
    const [labElement, setLabElement] = useState([])
    const [component, setComponent] = useState(MainComponents.Trace)
    const [dirty, setDirty] = useState(false);
    const [labProgressState, setLabProgressState] = useState({
        loading: false,
        checkDone: false,
        compiles: false,
        requirements: [],
        instructionsCovered: 0,
        instructionsMissed: 0,
        methodsCovered: 0,
        methodsMissed: 0,
        classesCovered: 0,
        classesMissed: 0
    })

    function handleCheckStarted() {
        setLabProgressState({
            loading: true,
            checkDone: false,
            compiles: false,
            requirements: [],
            instructionsCovered: 0,
            instructionsMissed: 0,
            methodsCovered: 0,
            methodsMissed: 0,
            classesCovered: 0,
            classesMissed: 0
        })
    }

    function handleCheckDone(data) {
        setLabProgressState({
            loading: false,
            checkDone: true,
            compiles: data.compiles,
            requirements: data.requirements,
            instructionsCovered: data.instructionsCovered,
            instructionsMissed: data.instructionsMissed,
            methodsCovered: data.methodsCovered,
            methodsMissed: data.methodsMissed,
            classesCovered: data.classesCovered,
            classesMissed: data.classesMissed
        })
    }

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

    const countdown = () => {
        return (
            <Countdown date={dayjs(lab.deadline, 'DD-MM-YYYY').format('YYYY-MM-DDTHH:mm:ss')} daysInHours={true} />
        )
    }

    const progressBar = () => {
        const total = 1440 //1 day in minutes
        const minutesLeft = dayjs(lab.deadline, 'DD-MM-YYYY').diff(dayjs(), 'minute')
        const actualProgressInMinutes = total - minutesLeft
        //we begin from 80% of progress bar completed and add minutes to cover the 20% remaining
        const actualProgressBase20 = (actualProgressInMinutes * 20) / total;
        const completitionPercentage = 80 + actualProgressBase20;
        const variant = (actualProgressInMinutes < total / 2) ? 'warning' : 'danger'
        return (
            <ProgressBar style={{ height: '2rem', fontSize: '1.3em', textShadow: '1px 1px 2px black' }} now={completitionPercentage} animated variant={variant} label={countdown()} className='margin-bottom-1' />
        )
    };

    const createLabElement = (lab) => {
        setComponent(MainComponents.Trace)
        const ret = []
        ret.push(
            <Container fluid key='container'>
                <Row>
                    <Col lg='auto'>
                        <h1>
                            {lab.name}
                        </h1>
                    </Col>
                    <Col lg={1} className='center-vertically-row'>
                        {
                            (!lab.expired) ?
                                (labsAttendedIds.includes(lab.id)) ?
                                    <Button onClick={() => editRepository()} variant='primary' size="sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                        </svg>
                                    </Button>
                                    :
                                    <Button onClick={() => joinLab()} variant='primary' size="sm">Join</Button>
                                :
                                ''
                        }
                    </Col>
                </Row>
                <Row>
                    {
                        lab.expired ?
                            <h4>
                                Expired: {lab.deadline}
                            </h4>
                            :
                            // Timer progress bar is shown only if there are less than 24 hours left
                            (dayjs(lab.deadline, 'DD-MM-YYYY').diff(dayjs(), 'minute') < 1440) ?
                                <>
                                    <Col lg={12}>
                                        {progressBar()}
                                    </Col>
                                </>
                                :
                                <h4>
                                    Deadline: {lab.deadline}
                                </h4>


                    }
                </Row>
                <Row>
                    <Col lg={12} className='margin-bottom-1'>
                        <Nav
                            variant='tabs'
                            className='ms-auto'
                            defaultActiveKey={MainComponents.Trace}
                            onSelect={(selectedKey) => {
                                setComponent(selectedKey);
                                setDirty(true);
                            }}
                        >
                            {/*TODO: show requirements in trace section*/}
                            <Nav.Item>
                                <Nav.Link eventKey={MainComponents.Trace}>Trace</Nav.Link>
                            </Nav.Item>
                            {
                                (!lab.expired && (labsAttendedIds.includes(lab.id))) &&
                                <>
                                    <Nav.Item>
                                        <Nav.Link eventKey={MainComponents.Progress}>Progress</Nav.Link>
                                    </Nav.Item>
                                </>
                            }
                            {
                                lab.expired &&
                                <>
                                    <Nav.Item>
                                        <Nav.Link eventKey={MainComponents.Leaderboard}>Leaderboard</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey={MainComponents.MyResults}>My results</Nav.Link>
                                    </Nav.Item>
                                </>
                            }
                        </Nav>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        {component === MainComponents.Trace && <MainComponentTrace trace={lab.trace} />}
                        {component === MainComponents.Leaderboard && <MainComponentLeaderboard leaderboard={lab.leaderboard} />}
                        {component === MainComponents.MyResults &&
                            <MainComponentResult
                                result={lab.userResult}
                                lab={lab}
                                labsAttendedIds={labsAttendedIds}
                                resultLeaderboard={userLabRegionLeaderboard}
                            />
                        }
                        {component === MainComponents.Progress &&
                            <MainComponentProgress
                                lab={lab}
                                labProgressState={labProgressState}
                                handleCheckStarted={handleCheckStarted}
                                handleCheckDone={handleCheckDone}
                            />
                        }
                    </Col>
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
        <h5>
            {props.trace}
        </h5>
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
            {
                (props.result !== undefined && props.labsAttendedIds.includes(props.lab.id)) ?
                    <>
                        <Leaderboard resultList={props.resultLeaderboard} />
                    </>
                    :
                    <h5>You didn't take part to this lab.</h5>

            }
        </>
    )
}

function MainComponentProgress(props) {

    return (
        <LabProgress
            lab={props.lab}
            labProgressState={props.labProgressState}
            handleCheckStarted={props.handleCheckStarted}
            handleCheckDone={props.handleCheckDone}
            studentRepoLink={props.studentRepoLink}
            solutionRepoLink={props.solutionRepoLink}
        />
    )
}

export default LabMain;
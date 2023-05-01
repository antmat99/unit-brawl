import { useState } from 'react'
import { Button, Col, ProgressBar, Row, Spinner, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';

import API from '../../../API'

function LabProgress(props) {
    const [loading, setLoading] = useState(false)
    const [checkDone, setCheckDone] = useState(false)
    const [compiles, setCompiles] = useState(false)

    /* Tests report */
    const [total, setTotal] = useState(0)
    const [failures, setFailures] = useState(0)
    const [errors, setErrors] = useState(0)
    const [skipped, setSkipped] = useState(0)
    const [passed, setPassed] = useState(0)
    const [requirements, setRequirements] = useState([])
    /* ----------------------- */

    /* Coverage report */
    const [instructionsCovered, setInstructionsCovered] = useState(0)
    const [instructionsMissed, setInstructionsMissed] = useState(0)
    const [methodsCovered, setMethodsCovered] = useState(0)
    const [methodsMissed, setMethodsMissed] = useState(0)
    const [classesCovered, setClassesCovered] = useState(0)
    const [classesMissed, setClassesMissed] = useState(0)

    const checkProgress = async () => {
        setLoading(true);
        const reports = await API.test();
        const testReport = reports['testReport'];
        const coverageReport = reports['coverageReport']
        setTotal(testReport['totalTests']);
        setFailures(testReport['failures']);
        setErrors(testReport['errors']);
        setSkipped(testReport['skipped']);
        const reqs = Object.keys(testReport.testCases).map((key) => {
            var failed = false
            return {
                'classname': key,
                'tests': testReport.testCases[key].reduce((acc, cur) => {
                    const tcObj = {
                        'testname': cur.name,
                    }

                    if (cur.failureType) {
                        failed = true
                        tcObj.failureType = cur.failureType;
                    }
                    if (cur.failureMessage) {
                        tcObj.failureMessage = cur.failureMessage;
                    }
                    acc.push(tcObj);
                    return acc;
                }, []),
                'failed': failed
            }
        })
        setRequirements(reqs);

        setInstructionsCovered(coverageReport.instructionsCovered)
        setInstructionsMissed(coverageReport.instructionsMissed)
        setMethodsCovered(coverageReport.methodsCovered)
        setMethodsMissed(coverageReport.methodsMissed)
        setClassesCovered(coverageReport.classesCovered)
        setClassesMissed(coverageReport.classesMissed)

        setLoading(false);
        setCheckDone(true);
    };

    return <>
        {checkDone ?
            <>
                <Row>
                    <Col>
                        <h3 style={{ marginBottom: '20px' }}>Tests report summary</h3>
                        <TestsProgressBars requirements={requirements} />
                        <ReqReportTable
                            requirements={requirements}
                        />
                    </Col>
                    <Col>
                        <h3 style={{ marginBottom: '20px' }}>Coverage report summary</h3>
                        <CoverageDashboard
                            instrCovered={instructionsCovered}
                            instrMissed={instructionsMissed}
                            methodsCovered={methodsCovered}
                            methodsMissed={methodsMissed}
                            classesCovered={classesCovered}
                            classesMissed={classesMissed}
                        />
                    </Col>
                </Row>
                <Row>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                        <Button onClick={checkProgress}>Update progress</Button>
                    </div>
                </Row>
            </>
            :
            <>
                {
                    loading ?
                        <>
                            <Spinner animation="border" role="status">
                            </Spinner>
                            <h4>Please wait while we check your progress...</h4>
                        </>
                        :
                        <>
                            <Row>
                                <h4>Would you like to check your progress in the lab?</h4>
                            </Row>
                            <Row>
                                <Col>
                                    <Button
                                        onClick={checkProgress}
                                    >
                                        Check progress
                                    </Button>
                                </Col>
                            </Row>
                        </>
                }
            </>}
    </>
}

function TestsProgressBars(props) {
    const totalReqs = props.requirements.length
    const passedReqs = props.requirements.filter((r) => !r.failed).length
    const passed = passedReqs / totalReqs * 100
    const failed = (totalReqs - passedReqs) / totalReqs * 100

    return (
        <div style={{ marginBottom: '20px' }}>
            <ProgressBar>
                <ProgressBar style={{ backgroundColor: colorPicker(passed) }} now={passed} />
                <ProgressBar variant="danger" now={failed} />
            </ProgressBar>
        </div>
    );
}

function ReqReportTable(props) {

    return <>
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Requirement</th>
                    <th>Status</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                {props.requirements.map((r) => (<ReqReportRow req={r} />))}
            </tbody>
        </Table>
    </>
}

function ReqReportRow(props) {
    return <tr>
        <td>{props.req.classname.replace('Test', '')}</td>
        <td style={{ backgroundColor: props.req.failed ? '#fa3939' : '#6afa39' }}>{(props.req.failed) ? 'Failed' : 'Passed'}</td>
        {
            props.req.failed ?
                <ReqCommentElement tests={props.req.tests} />
                : <div>All the requested methods pass their tests!</div>
        }
    </tr>
}

function ReqCommentElement(props) {
    const failingTests = props.tests.filter(t => t.failureType !== undefined)
    const failingMethods = []
    failingTests.forEach((test) => {
        const methodNameCapitalized = test.testname.replace('test', '')
        const methodName = methodNameCapitalized.charAt(0).toLowerCase() + methodNameCapitalized.slice(1)
        failingMethods.push(methodName)
    })

    return <td>
        <div>There seem to be a problem with the following required methods: </div>
        {failingMethods.map((m) => {
            return <ul>{m}</ul>
        })}
    </td>
}

function colorPicker(value) {
    if (value <= 50) {
        return '#fa3939'
    } else if (value > 50 && value <= 75) {
        return '#fab039'
    } else return '#6afa39'
}

function CoverageDashboard(props) {
    const totalInstructions = Number(props.instrCovered) + Number(props.instrMissed)
    const totalMethods = Number(props.methodsCovered) + Number(props.methodsMissed)
    const totalClasses = Number(props.classesCovered) + Number(props.classesMissed)
    const instrCoveredPercentage = Math.round((props.instrCovered / totalInstructions * 100))
    const methodsCoveredPercentage = Math.round((props.methodsCovered / totalMethods * 100))
    const classesCoveredPercentage = Math.round((props.classesCovered / totalClasses * 100))

    return (
        <Row>
            <Col>
                <OverlayTrigger
                    placement='right'
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">
                        Instructions covered: {props.instrCovered} Instructions missed: {props.instrMissed}
                    </Tooltip>}
                    trigger='click'
                >
                    <div style={{ width: 150, height: 150 }}>
                        <CircularProgressbar
                            value={instrCoveredPercentage}
                            text={`${instrCoveredPercentage}%`}
                            strokeWidth={5}
                            styles={buildStyles({
                                pathColor: colorPicker(instrCoveredPercentage)
                            })}
                        />
                    </div>
                </OverlayTrigger>
                <h5>Instructions</h5>
            </Col>
            <Col>
                <OverlayTrigger
                    placement='right'
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">
                        Methods covered: {props.methodsCovered} Methods missed: {props.methodsMissed}
                    </Tooltip>}
                    trigger='click'
                >
                    <div style={{ width: 150, height: 150 }}>
                        <CircularProgressbar
                            value={methodsCoveredPercentage}
                            text={`${methodsCoveredPercentage}%`}
                            strokeWidth={5}
                            styles={buildStyles({
                                pathColor: colorPicker(methodsCoveredPercentage)
                            })}
                        />
                    </div>
                </OverlayTrigger>
                <h5>Methods</h5>
            </Col>
            <Col>
                <OverlayTrigger
                    placement='right'
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">
                        Classes covered: {props.classesCovered} Classes missed: {props.classesMissed}
                    </Tooltip>}
                    trigger='click'
                >
                    <div style={{ width: 150, height: 150 }}>
                        <CircularProgressbar
                            value={classesCoveredPercentage}
                            text={`${classesCoveredPercentage}%`}
                            strokeWidth={5}
                            styles={buildStyles({
                                pathColor: colorPicker(classesCoveredPercentage)
                            })}
                        />
                    </div>
                </OverlayTrigger>
                <h5>Classes</h5>
            </Col>
        </Row>
    )
}

export default LabProgress
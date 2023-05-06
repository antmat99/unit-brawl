import { useState, useEffect } from 'react'
import { Button, Col, ProgressBar, Row, Spinner, Table, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';

import API from '../../../API'

//TODO: progress tab should stay updated when switching to different tab

function LabProgress(props) {

    const [loading, setLoading] = useState(false)
    const [checkDone, setCheckDone] = useState(false)
    const [compiles, setCompiles] = useState(false)
    const [studentTestNumber, setStudentTestNumber] = useState(false)
    const [maxTestNumber, setMaxTestNumber] = useState(false)
    const [testNumberExceeded, setTestNumberExceeded] = useState(false)
    const [requirements, setRequirements] = useState()
    const [instructionsCovered, setInstructionsCovered] = useState()
    const [instructionsMissed, setInstructionsMissed] = useState()
    const [methodsCovered, setMethodsCovered] = useState()
    const [methodsMissed, setMethodsMissed] = useState()
    const [classesCovered, setClassesCovered] = useState()
    const [classesMissed, setClassesMissed] = useState()

    useEffect(() => {
        setLoading(props.labProgressState.loading)
        setCheckDone(props.labProgressState.checkDone)
        setCompiles(props.labProgressState.compiles)
        setStudentTestNumber(props.labProgressState.studentTestNumber)
        setMaxTestNumber(props.labProgressState.maxTestNumber)
        setTestNumberExceeded(props.labProgressState.testNumberExceeded)
        setRequirements(props.labProgressState.requirements)
        setInstructionsCovered(props.labProgressState.instructionsCovered)
        setInstructionsMissed(props.labProgressState.instructionsMissed)
        setMethodsCovered(props.labProgressState.methodsCovered)
        setMethodsMissed(props.labProgressState.methodsMissed)
        setClassesCovered(props.labProgressState.classesCovered)
        setClassesMissed(props.labProgressState.classesMissed)
    }, [props.labProgressState])

    const checkProgress = async () => {
        setLoading(true)
        props.handleCheckStarted()
        const reports = await API.checkProgress(props.studentRepoLink, props.solutionRepoLink)
        setCompiles(reports.compiles)
        setStudentTestNumber(reports.studentTestNumber)
        setMaxTestNumber(reports.maxTestNumber)
        setTestNumberExceeded(reports.testNumberExceeded)
        const testsReport = reports.testsReport
        /* If needed, reports.testsReport contains
            - totalTests
            - failures
            - errors
            - skipped
        */

        const coverageReport = reports.coverageReport
        const requirements = Object.keys(testsReport.testCases).map((key) => {
            var failed = false
            return {
                'classname': key.replace('it.polito.po.test.Test', ''),
                'tests': testsReport.testCases[key].reduce((acc, cur) => {
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
        const instructionsCovered = (coverageReport !== null) ? coverageReport.instructionsCovered : undefined
        const instructionsMissed = (coverageReport !== null) ? coverageReport.instructionsMissed : undefined
        const methodsCovered = (coverageReport !== null) ? coverageReport.methodsCovered : undefined
        const methodsMissed = (coverageReport !== null) ? coverageReport.methodsMissed : undefined
        const classesCovered = (coverageReport !== null) ? coverageReport.classesCovered : undefined
        const classesMissed = (coverageReport !== null) ? coverageReport.classesMissed : undefined

        const reportContent = {
            compiles: reports.compiles,
            studentTestNumber: reports.studentTestNumber,
            maxTestNumber: reports.maxTestNumber,
            testNumberExceeded: reports.testNumberExceeded,
            requirements: requirements,
            instructionsCovered: instructionsCovered,
            instructionsMissed: instructionsMissed,
            methodsCovered: methodsCovered,
            methodsMissed: methodsMissed,
            classesCovered: classesCovered,
            classesMissed: classesMissed
        }
        props.handleCheckDone(reportContent)
        setRequirements(requirements)
        setInstructionsCovered(instructionsCovered)
        setInstructionsMissed(instructionsMissed)
        setMethodsCovered(methodsCovered)
        setMethodsMissed(methodsMissed)
        setClassesCovered(classesCovered)
        setClassesMissed(classesMissed)
        setCheckDone(true)
        setLoading(false)
    }

    if (checkDone && !loading) {
        if (compiles) {
            return <>
                {testNumberExceeded && <>
                    <Alert variant='danger'>
                        Tests found in your solution: {studentTestNumber} - Maximum number of tests allowed: {maxTestNumber}
                    </Alert>
                </>}
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
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button onClick={checkProgress}>Update progress</Button>
                    </div>
                </Row>
            </>
        } else {
            return <h5>Your solution does not compile...</h5>
        }
    } else if (!checkDone && !loading) {
        return <>
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
    } else {
        return <>
            <Spinner animation="border" role="status">
            </Spinner>
            <h4>Please wait while we check your progress...</h4>
        </>
    }
}

function TestsProgressBars(props) {
    const totalReqs = props.requirements.length
    const passedReqs = props.requirements.filter((r) => !r.failed).length
    const passed = passedReqs / totalReqs * 100
    const failed = (totalReqs - passedReqs) / totalReqs * 100

    return (
        <div style={{ marginBottom: '20px' }}>
            <ProgressBar>
                <ProgressBar variant="success" now={passed} />
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
        <td>{props.req.classname.replace('it.polito.po.test.Test', '')}</td>
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
    let failingMethods = []
    failingTests.forEach((test) => {
        const methodNameCapitalized = test.testname.replace('test', '')
        var methodName = methodNameCapitalized.charAt(0).toLowerCase() + methodNameCapitalized.slice(1)
        if (/\d$/.test(methodName))
            methodName = methodName.slice(0, -1);
        failingMethods.push(methodName)
    })
    failingMethods = [...new Set(failingMethods)];

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
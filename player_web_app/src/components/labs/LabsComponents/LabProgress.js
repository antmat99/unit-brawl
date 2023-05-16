import { useState, useEffect } from 'react'
import { Button, Col, ProgressBar, Row, Spinner, Table, OverlayTrigger, Tooltip, Container, Card, Popover } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';

import API from '../../../API'

function LabProgress(props) {

    const [loading, setLoading] = useState(false)
    const [coverageLoading, setCoverageLoading] = useState(false)
    const [checkDone, setCheckDone] = useState(false)
    const [coverageCheckDone, setCoverageCheckDone] = useState(false)
    const [compiles, setCompiles] = useState(false)
    const [studentCompiles, setStudentCompiles] = useState(false)
    const [studentTestNumberByRequirement, setStudentTestNumberByRequirement] = useState(false)
    const [maxTestNumber, setMaxTestNumber] = useState(false)
    const [studentTestsPass, setStudentTestsPass] = useState(true)
    const [requirements, setRequirements] = useState()
    const [instructionsCovered, setInstructionsCovered] = useState()
    const [instructionsMissed, setInstructionsMissed] = useState()
    const [methodsCovered, setMethodsCovered] = useState()
    const [methodsMissed, setMethodsMissed] = useState()
    const [classesCovered, setClassesCovered] = useState()
    const [classesMissed, setClassesMissed] = useState()

    useEffect(() => {
        /* reqProgressState */
        setLoading(props.reqsProgressState.loading)
        setCheckDone(props.reqsProgressState.checkDone)
        setCompiles(props.reqsProgressState.compiles)
        setRequirements(props.reqsProgressState.requirements)

        /* coverageProgressState */
        setCoverageLoading(props.coverageProgressState.coverageLoading)
        setCoverageCheckDone(props.coverageProgressState.coverageCheckDone)
        setStudentCompiles(props.coverageProgressState.studentCompiles)
        setStudentTestNumberByRequirement(props.coverageProgressState.studentTestNumberByRequirement)
        setMaxTestNumber(props.coverageProgressState.maxTestNumber)
        setStudentTestsPass(props.coverageProgressState.studentTestsPass)
        setInstructionsCovered(props.coverageProgressState.instructionsCovered)
        setInstructionsMissed(props.coverageProgressState.instructionsMissed)
        setMethodsCovered(props.coverageProgressState.methodsCovered)
        setMethodsMissed(props.coverageProgressState.methodsMissed)
        setClassesCovered(props.coverageProgressState.classesCovered)
        setClassesMissed(props.coverageProgressState.classesMissed)
    }, [props.reqsProgressState, props.coverageProgressState])

    const retryTests = async () => {
        setCheckDone(false)
        setCoverageCheckDone(false)
        checkProgress()
    }

    const retryCoverage = async () => {
        setCoverageCheckDone(false)
        checkCoverage()
    }

    const checkProgress = async () => {
        setLoading(true)
        props.handleCheckStarted()
        const reports = await API.checkProgress(props.studentRepoLink, props.solutionRepoLink)
        setCompiles(reports.compiles)
        if (reports.compiles) {
            const testsReport = reports.testsReport
            /* If needed, reports.testsReport contains
                - totalTests
                - failures
                - errors
                - skipped
            */

            const requirements = Object.keys(testsReport.testCases).map((key) => {
                const classname = key.replace('it.polito.po.test.Test', '').substring(0, 2)
                var failed = false
                return {
                    'classname': classname,
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
                        if (cur.errorType) {
                            failed = true
                            tcObj.errorType = cur.errorType
                        }
                        if (cur.errorMessage) {
                            tcObj.errorMessage = cur.errorMessage
                        }
                        acc.push(tcObj);
                        return acc;
                    }, []),
                    'failed': failed
                }
            })

            const reportContent = {
                compiles: reports.compiles,
                requirements: requirements
            }
            props.handleCheckDone(reportContent)
            setRequirements(requirements)
        } else {
            const reportContent = {
                compiles: reports.compiles
            }
            props.handleCheckDone(reportContent)
        }

        setCheckDone(true)
        setLoading(false)
    }

    const checkCoverage = async () => {
        setCoverageLoading(true)
        props.handleCoverageCheckStarted()
        const result = await API.checkCoverage()
        setStudentCompiles(result.compiles)
        if (result.compiles) {
            setStudentTestsPass(result.studentTestsPass)
            if (result.studentTestsPass) {
                const coverageReport = result.coverageReport
                setStudentTestNumberByRequirement(result.studentTestNumberByRequirement)
                setMaxTestNumber(result.maxTestNumber)
                const instructionsCovered = coverageReport.instructionsCovered
                const instructionsMissed = coverageReport.instructionsMissed
                const methodsCovered = coverageReport.methodsCovered
                const methodsMissed = coverageReport.methodsMissed
                const classesCovered = coverageReport.classesCovered
                const classesMissed = coverageReport.classesMissed
                const reportContent = {
                    studentCompiles: result.compiles,
                    studentTestNumberByRequirement: result.studentTestNumberByRequirement,
                    maxTestNumber: result.maxTestNumber,
                    studentTestsPass: result.studentTestsPass,
                    instructionsCovered: instructionsCovered,
                    instructionsMissed: instructionsMissed,
                    methodsCovered: methodsCovered,
                    methodsMissed: methodsMissed,
                    classesCovered: classesCovered,
                    classesMissed: classesMissed
                }
                props.handleCoverageCheckDone(reportContent)
                setInstructionsCovered(instructionsCovered)
                setInstructionsMissed(instructionsMissed)
                setMethodsCovered(methodsCovered)
                setMethodsMissed(methodsMissed)
                setClassesCovered(classesCovered)
                setClassesMissed(classesMissed)
            } else {
                const reportContent = {
                    studentCompiles: result.compiles,
                    studentTestPass: result.studentTestPass,
                    maxTestNumber: result.maxTestNumber,
                    studentTestsPass: result.studentTestsPass,
                    instructionsCovered: 0,
                    instructionsMissed: 0,
                    methodsCovered: 0,
                    methodsMissed: 0,
                    classesCovered: 0,
                    classesMissed: 0
                }
                props.handleCoverageCheckDone(reportContent)
            }

        } else {
            const reportContent = {
                studentCompiles: result.compiles
            }
            props.handleCoverageCheckDone(reportContent)
        }
        setCoverageCheckDone(true)
        setCoverageLoading(false)
    }

    if (!checkDone && !loading) {
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
    }

    if (!checkDone && loading) {
        return <>
            <Spinner animation="border" role="status">
            </Spinner>
            <h4>Please wait while we check your progress...</h4>
            <h5>This may take a few minutes, do not refresh the page</h5>
        </>
    }

    if (checkDone && !loading) {
        if (!compiles) {
            return <>
                <CompiledFailedCard retryTests={retryTests} />
            </>
        }
    }

    return (
        <div>
            <Row>
                <Col>
                    <h3 style={{ marginBottom: '20px' }}>Tests report summary</h3>
                    <TestsProgressBars requirements={requirements} />
                    <ReqReportTable
                        requirements={requirements}
                        studentTestNumberByRequirement={studentTestNumberByRequirement}
                        maxTestNumber={maxTestNumber}
                    />
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <div className="text-center">
                                <Button onClick={retryTests}>Update requirements progress</Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    {
                        coverageCheckDone && !coverageLoading && (
                            studentCompiles && studentTestsPass ? (
                                //<h5>Coverage report here</h5>
                                <>
                                    <CoverageDashboard
                                        studentTestNumberByRequirement={studentTestNumberByRequirement}
                                        maxTestNumber={maxTestNumber}
                                        instrCovered={instructionsCovered}
                                        instrMissed={instructionsMissed}
                                        methodsCovered={methodsCovered}
                                        methodsMissed={methodsMissed}
                                        classesCovered={classesCovered}
                                        classesMissed={classesMissed}
                                    />
                                    <Row>
                                        <Col className="d-flex justify-content-center">
                                            <div className="text-center">
                                                <Button onClick={retryCoverage}>Update coverage</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <>
                                    <h5>Coverage report was not generated</h5>
                                    <h6>This is normal if you have not provided any test yet. If you have, make sure your solution compiles and check if any test fails.
                                        Your test classes should be placed in <code>test/sXXXXXX/</code>, where <code>sXXXXXX</code> is
                                        your student ID. For example, if you have created two classes, <code>TestClassA.java</code> and <code>TestClassB.java</code>
                                        , their location should be <code>test/sXXXXXX/TestClassA.java</code> and <code>test/sXXXXXX/TestClassB.java</code></h6>
                                    <Row>
                                        <Col className="d-flex justify-content-center">
                                            <div className="text-center">
                                                <Button onClick={retryCoverage}>Try again</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            )
                        )
                    }
                    {
                        !coverageCheckDone && !coverageLoading && (
                            <>
                                <Row>
                                    <h4>Would you like to check the coverage for your tests?</h4>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-center">
                                        <div className="text-center">
                                            <Button onClick={checkCoverage}>Check coverage</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        )
                    }
                    {
                        coverageLoading && !coverageCheckDone && (
                            <>
                                <Spinner animation="border" role="status">
                                </Spinner>
                                <h4>Please wait while we check your coverage...</h4>
                                <h5>This may take a few minutes, do not refresh the page</h5>
                            </>
                        )
                    }
                </Col>
            </Row></div>
    )

    /*
    if (checkDone && !loading) {
        if (compiles) {
            return <>
                <Row>
                    <Col>
                        <h3 style={{ marginBottom: '20px' }}>Tests report summary</h3>
                        <TestsProgressBars requirements={requirements} />
                        <ReqReportTable
                            requirements={requirements}
                            studentTestNumberByRequirement={studentTestNumberByRequirement}
                            maxTestNumber={maxTestNumber}
                        />
                    </Col>
                    <Col>
                        <h3 style={{ marginBottom: '20px' }}>Coverage report summary</h3>
                        {
                            (coverageCheckDone && !coverageLoading) ?
                                {
                                   {
                            compiles && <CoverageDashboard
                                instrCovered={instructionsCovered}
                                instrMissed={instructionsMissed}
                                methodsCovered={methodsCovered}
                                methodsMissed={methodsMissed}
                                classesCovered={classesCovered}
                                classesMissed={classesMissed}
                            />
                        } 
                                }
                        :
                        <>
                            <h5>Coverage report was not generated</h5>
                            <h6>This is normal if you have not provided any test yet. If you have, check if any of them fails,
                                and make sure to place the test classes in <code>test/sXXXXXX/</code>, where <code>sXXXXXX</code> is
                                your student ID. For example, if you have created two classes, <code>TestClassA.java</code> and <code>TestClassB.java</code>
                                , their location should be <code>test/sXXXXXX/TestClassA.java</code> and <code>test/sXXXXXX/TestClassB.java</code></h6>
                        </>

                        }
                    </Col>
                </Row>
                <Row>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <Button onClick={checkProgress}>Update progress</Button>
                    </div>
                </Row>
            </>
        } else {
            return <>
                <CompiledFailedCard checkProgress={checkProgress} />
            </>
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
            <h5>This may take a few minutes, do not refresh the page</h5>
        </>
    }
    */
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
                    <th>Comment (Click on the failing methods for more info)</th>
                </tr>
            </thead>
            <tbody>
                {props.requirements.map((r) => (<ReqReportRow req={r} maxTestNumber={props.maxTestNumber} />))}
            </tbody>
        </Table>
    </>
}

function ReqReportRow(props) {
    var color
    var status
    if (props.req.failed) {
        status = 'Failed'
        color = '#fa3939'
    } /* else if (props.req.testNumber > props.maxTestNumber) {
        status = 'Exceeded test limit'
        color = '#fab039'
    } */ else {
        status = 'Passed'
        color = '#6afa39'
    }
    return <tr>
        <td>{props.req.classname.replace('it.polito.po.test.Test', '')}</td>
        <td style={{ backgroundColor: color }}>{status}</td>
        <td>
            {status === 'Failed' && <ReqCommentElement tests={props.req.tests} />}
            {status === 'Exceeded test limit' && <ExceededLimitElement limit={props.maxTestNumber} number={props.req.testNumber} />}
            {status === 'Passed' && <div>All the requested methods pass their tests!</div>}
        </td>
    </tr>
}

function ExceededLimitElement(props) {
    return <>
        Test number limit per requirement: {props.limit} - Your tests for this requirement: {props.number}
    </>
}

function ReqCommentElement(props) {

    const liStyle = { margin: 0, paddingBottom: '3px', listStyle: 'circle' }
    const failingTests = props.tests.filter(t => (t.failureType !== undefined || t.errorType !== undefined))
    let failingMethods = []
    failingTests.forEach((test) => {
        const methodNameCapitalized = test.testname.replace('test', '')
        var methodName = methodNameCapitalized.charAt(0).toLowerCase() + methodNameCapitalized.slice(1)
        if (/\d$/.test(methodName))
            methodName = methodName.slice(0, -1);
        const methodObj = {
            name: methodName,
        }
        if (test.failureType !== undefined) {
            methodObj.message = test.failureMessage
            methodObj.type = test.failureType
        }
        else {
            methodObj.message = test.errorMessage
            methodObj.type = test.errorType
        }
        failingMethods.push(methodObj)
    })
    failingMethods = [...new Set(failingMethods)];

    return <td>
        <div>There seems to be a problem with the following required methods: </div>
        <ul>
            {failingMethods.map((m) => {
                return <li style={liStyle}>
                    <ListElement m={m} />
                </li>
            })}
        </ul>
    </td>
}

function ListElement(props) {
    const [showPopover, setShowPopover] = useState(false);
    return <>
        <OverlayTrigger
            placement='right'
            delay={{ show: 250, hide: 400 }}
            overlay={<Popover id="popover-basic">
                <Popover.Header as="h3">{props.m.type}</Popover.Header>
                <Popover.Body>
                    {props.m.message}
                </Popover.Body>
            </Popover>}
            trigger='click'
            onToggle={(show) => setShowPopover(show)}
        >
            <div style={{ fontWeight: showPopover ? 'bold' : 'normal' }}>
                {props.m.name}
            </div>
        </OverlayTrigger>
    </>
}

function colorPicker(value) {
    if (value <= 50) {
        return '#fa3939'
    } else if (value > 50 && value <= 75) {
        return '#fab039'
    } else return '#6afa39'
}

function CoverageDashboard(props) {
    const filterRequirements = (obj, threshold) => {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] > threshold) {
                result[key] = obj[key];
            }
        }
        return result;
    }
    const totalInstructions = Number(props.instrCovered) + Number(props.instrMissed)
    const totalMethods = Number(props.methodsCovered) + Number(props.methodsMissed)
    const totalClasses = Number(props.classesCovered) + Number(props.classesMissed)
    const instrCoveredPercentage = Math.round((props.instrCovered / totalInstructions * 100))
    const methodsCoveredPercentage = Math.round((props.methodsCovered / totalMethods * 100))
    const classesCoveredPercentage = Math.round((props.classesCovered / totalClasses * 100))
    const exceededReqs = filterRequirements(props.studentTestNumberByRequirement, props.maxTestNumber)
    const exceeded = Object.keys(exceededReqs).length > 0

    return (
        <>
            {
                exceeded && <TestNumberExceededAlert exceededReqs={exceededReqs} max={props.maxTestNumber} />
            }
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
        </>
    )
}

function CompiledFailedCard(props) {
    return (
        <Card bg='danger' text='light'>
            <Card.Body>
                <Card.Title>Your solution does not compile...</Card.Title>
                <Button variant='light' onClick={props.retryTests}>Try again</Button>
            </Card.Body>
        </Card>
    );
}

function TestNumberExceededAlert(props) {

    return (
        <>
            <Row>Test number per requirement exceeded - You should have at most {props.max} tests per requirements</Row>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Requirement</th>
                        <th>Number of tests</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(props.exceededReqs).sort().map((key) => (<ExceededTableRow req={key} tests={props.exceededReqs[key]} />))}
                </tbody>
            </Table>
        </>
    )
}

function ExceededTableRow(props) {
    return <tr>
        <td>{props.req}</td>
        <td>{props.tests}</td>
    </tr>
}

export default LabProgress
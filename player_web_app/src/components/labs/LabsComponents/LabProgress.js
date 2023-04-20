import { useState, useEffect } from 'react'
import { Button, Col, ProgressBar, Row, Spinner} from 'react-bootstrap';
import API from '../../../API'

function LabProgress(props) {
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [checkDone, setCheckDone] = useState(false)
    const [compiles, setCompiles] = useState(false)
    const [total, setTotal] = useState(0)
    const [failures, setFailures] = useState(0)
    const [errors, setErrors] = useState(0)
    const [skipped, setSkipped] = useState(0)
    const [passed, setPassed] = useState(0)
    const [testcases, setTestcases] = useState({})

    const checkProgress = async () => {
        setLoading(true)
        const progress = await API.checkLabProgress()
        const report = progress['report']
        setTotal(report['totalTests'])
        setFailures(report['failures'])
        setErrors(report['errors'])
        setSkipped(report['skipped'])
        setPassed(total - failures - skipped - errors)
        setTestcases(report['testCases'])
        setLoading(false)
        setCheckDone(true)
    }

    return <>
        {checkDone ?
            <ProgressDashboard
                totalTests={total}
                failures={failures}
                errors={errors}
                skipped={skipped}
                testcases={testcases}
            />
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
                        <Button
                            onClick={checkProgress}
                        >
                        Check progress
                        </Button>
                    </Row> 
                </>   
        }
        </>}
    </>
}

function ProgressDashboard(props) {
    return <>
            <h3>`We have run ${props.totalTests} tests on your solution`</h3>
            <h4>`${props.passed} tests passed`</h4>
            <h4>`${props.failed} tests failed`</h4>
            <h4>`${props.skipped} tests skipped`</h4>
            <TestReportTable testcases={props.testcases}/>
        </>
}


/* TODO: implement each row to refer to a requirement
    Check all the tests for that requirement
    If there are no failures: green background, status=OK
    If there are failures: red background, status=NOT OK
*/

function TestReportTable(props) {
    return<>
        <Table>
            <thead>
                <tr>
                    <th>Requirement</th>
                    <th>Status</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                {props.testcases.map((tc) => (<RequirementRow ={exam} editable={editable} 
                    removeExam={props.removeExam} mode={mode} setMode={setMode} editExam={editExam}/>))}
            </tbody>
        </Table>
    </>
}

export default LabProgress
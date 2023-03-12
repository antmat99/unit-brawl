import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Popover, OverlayTrigger } from "react-bootstrap";
import API from "../../API";
import '../../App.css';

const xlsx = require('xlsx');

function Reports() {

    const [selectedTopic, setSelectedTopic] = useState('');

    const Topics = {
        General: 'general',
        Labs: 'labs',
        Users: 'users',
        UserLabs: 'user_labs'
    }

    const generateAndDownload = async () => {
        switch (selectedTopic) {
            case Topics.General: await generateAndDownloadGeneralReport(); break;
            case Topics.Labs: await generateAndDownloadLabsReport(); break;
            case Topics.Users: await generateAndDownloadUsersReport(); break;
            case Topics.UserLabs: await generateAndDownloadUserLabsReport(); break;
            default: break;
        }
    }

    const generateAndDownloadGeneralReport = async () => {
        const data = await API.getGeneralReport();
        const columnNames = ['Total labs', 'Total players', 'Avg participants per lab', 'Avg points per lab'];
        generateAndDownloadExcelSingle(data, columnNames)
    }

    const generateAndDownloadLabsReport = async () => {
        const data = await API.getLabsReport();
        const array = []
        data.forEach(elem => {
            array.push([elem.id, elem.participants, elem.participantsPercentage, elem.avgPoints])
        })
        const columnNames = ['id', 'Total participants', '% participants', 'Avg points'];
        generateAndDownloadExcel(array, columnNames)
    }

    const generateAndDownloadUsersReport = async () => {
        const data = await API.getUsersReport();
        const array = []
        data.forEach(elem => {
            array.push([elem.id, elem.nickname, elem.fullName, elem.labsAttendedCount, elem.labsAttendedPercentage, elem.avgPoints, elem.bestPosition])
        })
        const columnNames = ['id', 'Username', 'Name', 'Total labs attended', '% labs attended', 'Avg points', 'Best score'];
        generateAndDownloadExcel(array, columnNames)
    }

    const generateAndDownloadUserLabsReport = async () => {
        const data = await API.getUserLabsReport();
        const array = []
        data.forEach(elem => {
            array.push([elem.user_id, elem.lab_id, elem.points, elem.position, elem.repository, elem.coverage_percentage, elem.tests_failed_on_enemy, elem.tests_enemy_passed])
        })
        const columnNames = ['user_id', 'lab_id', 'points', 'position', 'repository', 'coverage %', 'tests_failed_on_enemies', 'tests_passed_on_own'];
        generateAndDownloadExcel(array, columnNames)
    }

    const generateAndDownloadExcel = (dataArray, columnNames) => {
        const workSheetName = 'Report';
        const filePath = './report.xlsx';
        const workBook = xlsx.utils.book_new();
        const workSheetData = [
            columnNames,
            ...dataArray
        ]
        const worksheet = xlsx.utils.aoa_to_sheet(workSheetData);
        xlsx.utils.book_append_sheet(workBook, worksheet, workSheetName)
        xlsx.writeFile(workBook, filePath)
    }

    const generateAndDownloadExcelSingle = (dataArray, columnNames) => {
        const workSheetName = 'Report';
        const filePath = './report.xlsx';
        const workBook = xlsx.utils.book_new();
        const workSheetData = [
            columnNames,
            Object.values(dataArray)
        ]
        const worksheet = xlsx.utils.aoa_to_sheet(workSheetData);
        xlsx.utils.book_append_sheet(workBook, worksheet, workSheetName)
        xlsx.writeFile(workBook, filePath)
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Wait!</Popover.Header>
            <Popover.Body>
                You should choose your report's topic first.
            </Popover.Body>
        </Popover>
    );

    return (
        <Container  >
            <Row className='margin-top'>
                <h3 className='center-horizontal'>
                    Select the type of report you want to generate
                </h3>
            </Row>
            <Row className='margin-top'>
                <Form className='center-horizontal'>
                    <Form.Check
                        inline
                        label='General'
                        value='general'
                        name='form'
                        type='radio'
                        id='check-general'
                        onClick={() => setSelectedTopic(Topics.General)}
                    />
                    <Form.Check
                        inline
                        label='Labs'
                        value='labs'
                        name='form'
                        type='radio'
                        id='check-labs'
                        onClick={() => setSelectedTopic(Topics.Labs)}
                    />
                    <Form.Check
                        inline
                        label='Users'
                        value='users'
                        name='form'
                        type='radio'
                        id='check-users'
                        onClick={() => setSelectedTopic(Topics.Users)}
                    />
                    <Form.Check
                        inline
                        label='user_labs'
                        value='user_labs'
                        name='form'
                        type='radio'
                        id='check-user-labs'
                        onClick={() => setSelectedTopic(Topics.UserLabs)}
                    />
                </Form>
            </Row>
            <Row className='margin-top'>
                <Col lg={5}> </Col>
                <Col lg={2}>
                    {
                        selectedTopic == '' ?
                            <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                                <Button onClick={() => generateAndDownload()} >
                                    Download
                                </Button>
                            </OverlayTrigger>
                            :
                            <Button onClick={() => generateAndDownload()} >
                                Download
                            </Button>
                    }
                </Col>
                <Col lg={5}> </Col>
            </Row>
        </Container>
    )
}

export default Reports
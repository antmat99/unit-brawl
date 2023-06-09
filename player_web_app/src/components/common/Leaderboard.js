import { useEffect, useState } from "react";
import { Col, Container, Row, Image, Table } from "react-bootstrap";
import API from '../../API'

function Leaderboard(props) {
    const { resultList, user } = props;
    const [resultRows, setResultRows] = useState([]);

    useEffect(() => {
        createRows();
    }, [resultList])

    const createRows = () => {
        const ret = [];
        resultList.forEach((result, index) => {
            const rowStyle = {}
            if(props.local !== true) {
                if (index === 0) {
                    // First place: light golden background
                    rowStyle.backgroundColor = "#FFD700";
                } else if(result.username === user) {
                    rowStyle.backgroundColor = "#00FF77"
                }
            }
            ret.push(
                <tr key={index} style={rowStyle}>
                    <td>
                        <Container>
                            <Row>
                                <Col lg='auto'>
                                    <h4 className='margin-top-50'>{result.position}</h4>
                                </Col>
                            </Row>
                        </Container>
                    </td>
                    <td className='avatar-big'>
                        <Container>
                            <Row>
                                <Col lg='1'>
                                    <Image fluid src={result.userAvatarLink} />
                                </Col>
                                <Col lg='auto' className='center-vertically-row'>
                                    {result.username}
                                </Col>
                            </Row>
                        </Container>
                    </td>
                    <td >
                    <Container>
                            <Row >
                                <Col lg='2' className='center-vertically-row'>
                                    <p className='margin-top-50'>{result.points.toFixed(1)}</p>
                                </Col>
                            </Row>
                        </Container>
                    </td>
                </tr >
            )
        })
        setResultRows(ret);
    }

    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {resultRows}
            </tbody>
        </Table>
    )
}

export default Leaderboard;
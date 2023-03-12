import { useEffect,useState } from "react";
import { Col,Container,Row,Image,Table } from "react-bootstrap";

function Leaderboard(props) {
    const { resultList } = props;
    const [resultRows, setResultRows] = useState([]);

    useEffect(() => {
        createRows();
    }, [resultList])

    //TODO insert user avatar in row

    const createRows = () => {
        //riordino resultList in base alla posizione
        //TODO
        const ret = [];
        resultList.forEach((result, index) => {
            ret.push(
                <tr key={index}>
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
                                    <p className='margin-top-50'>{result.points}</p>
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
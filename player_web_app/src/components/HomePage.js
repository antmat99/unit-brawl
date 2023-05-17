import { Button, Container, Row, Col } from "react-bootstrap";
import { PLAYERPREFIX } from "../utils";

function HomePage(props) {
    const { loggedIn } = props

    return (
        <Container fluid className='center-vertically'>
            <Row className='justify-content-md-center margin-bottom-row'>
                <Col lg='auto'>
                    <h2>Welcome!</h2>
                </Col>
            </Row>
            <Row className='justify-content-md-center'>
                <Col lg='auto'>
                    {
                        loggedIn ?
                            ''
                            :
                            <Button href={PLAYERPREFIX + '/login'}>
                                Login
                            </Button>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default HomePage; 
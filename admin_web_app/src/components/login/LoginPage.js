import { Form, Button, Alert, Modal, FloatingLabel, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

function LoginPage(props) {
    const { doLogIn } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')


    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };
        let valid = true;
        //const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);

        if (password.length < 6) {
            valid = false;
        }
        if (valid) {
            try {
                await doLogIn(credentials)
            } catch (e) {
                setErrorMessage(e)
            }
        } else {
            setErrorMessage("Incorrect username and/or password");
        }
    }

    return (
        <Container fluid>
            <Row className='justify-content-md-center'>
                <Col lg='auto'>
                    <h1>Login</h1>
                </Col>
            </Row>
            <Row className='justify-content-md-center'>
                <Col lg='auto'>
                    <Alert
                        show={errorMessage != ''}
                        variant='danger'>
                        {errorMessage}
                    </Alert>
                </Col>
            </Row>
            <Row className='justify-content-md-center'>
                <Col lg='auto'>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="validationCustomUsername">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Username"
                                className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(ev) => setUsername(ev.target.value)}
                                    aria-describedby="inputGroupPrepend"
                                    required />
                                <Form.Control.Feedback type="invalid">
                                    Please insert a username.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group controlId="validationCustomUsername">
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control
                                    type="password"
                                    placeholder="password"
                                    value={password}
                                    onChange={(ev) => setPassword(ev.target.value)}
                                    aria-describedby="inputGroupPrepend"
                                    required
                                />
                                <Form.Text className="text-muted">
                                    At least 6 characters.
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    Please insert a valid password.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>
                        <Button type="submit"> Login </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;
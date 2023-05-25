import { useEffect, useState } from "react";
import LabList from "./LabList";
import LabMain from "./LabMain";
import { Container, Row, Col, Alert, Modal, Button, Form } from 'react-bootstrap'
import { Button as FloatingActionButton, Container as FABContainer } from 'react-floating-action-button';
import API from "../../API";
import Lab from "../../models/Lab";

const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


function Labs() {
    const [loading, setLoading] = useState(false)
    const [labs, setLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(undefined);
    const [activeLab, setActiveLab] = useState(undefined);
    const [showModalStartEditLab, setShowModalStartLab] = useState(false);
    const [editLab, setEditLab] = useState(false);
    const [showModalDeleteLab, setShowModalDeleteLab] = useState(false);
    const [showModalStopLab, setShowModalStopLab] = useState(false);
    const [numberOfPlayers, setNumberOfPayers] = useState(0);
    const [dirty, setDirty] = useState(true);

    useEffect(() => {
        const update = async () => {
            if (dirty) {
                setLoading(true)
                try {
                    const labs = await API.getLabs()
                    setLabs(labs)
                    setSelectedLab(labs[labs.length - 1])
                    const active = await API.getActiveLab()
                    setActiveLab(active)
                } catch (e) {
                    console.log(e)
                } finally {
                    setDirty(false)
                    setLoading(false)
                }
            }
        }
        update()
    }, [dirty])

    useEffect(() => {
        const f = async () => {
            if(selectedLab){
                await API.getNumberOfPlayers(selectedLab.id)
                .then(n => setNumberOfPayers(n))
                .catch(err => handleError(err))
            }
        }
        f();
    }, [selectedLab])

    function handleError(err) {
        console.log(err);
    }

    const selectLab = (lab) => {
        setSelectedLab(lab);
    }

    const closeModalStartEditLab = async () => {
        if (editLab) {
            const l = await API.getLab(selectedLab.id);
            setSelectedLab(l);
        }
        setShowModalStartLab(false);
        setEditLab(false);
        setDirty(true)
    }

    const openEditLabModal = () => {
        setEditLab(true);
        setShowModalStartLab(true);
    }

    const openDeleteLabModal = () => {
        setShowModalDeleteLab(true);
    }

    const closeModalDeleteLab = (lab) => {
        if (lab != null) setDirty(true)
        setShowModalDeleteLab(false);
    }

    const openModalStopLab = () => {
        setShowModalStopLab(true);
    }

    const closeModalStopLab = () => {
        setShowModalStopLab(false);
        setDirty(true)
    }

    return <>
        {
            loading ? <></> :
                <Container fluid>
                    {
                        activeLab ?
                            ''
                            :
                            <Alert variant='warning'>
                                There aren't any active labs. Click on the "+" button to create one.
                            </Alert>
                    }
                    <Row>
                        <Col lg={2}>
                            <LabList labs={labs} selectLab={selectLab} />
                        </Col>
                        <Col lg={9}>
                            <LabMain lab={selectedLab} editLab={openEditLabModal} deleteLab={openDeleteLabModal} stopLab={openModalStopLab} numberOfPlayers={numberOfPlayers} />
                        </Col>
                    </Row>
                    {
                        activeLab ?
                            ''
                            :
                            <FABContainer>
                                <FloatingActionButton onClick={() => setShowModalStartLab(true)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                    </svg>
                                </FloatingActionButton>
                            </FABContainer>
                    }

                    <ModalStartEditLab show={showModalStartEditLab} closeModal={closeModalStartEditLab} edit={editLab} labToEdit={selectedLab} setDirty={setDirty}/>
                    <ModalDeleteLab show={showModalDeleteLab} closeModal={closeModalDeleteLab} lab={selectedLab} />
                    <ModalStopLab show={showModalStopLab} closeModal={closeModalStopLab} lab={selectedLab} />
                </Container>
        }

    </>

}

function ModalStartEditLab(props) {
    const { show, closeModal, edit, labToEdit, setDirty } = props;
    const [isValidName, setIsValidName] = useState(false);
    const [isValidTrace, setIsValidTrace] = useState(false);
    const [isValidDate, setIsValidDate] = useState(false);
    const [isValidTestMaxNumber, setIsValidTestMaxNumber] = useState(false);
    const [isValidLinkToIdealSolution, setIsValidLinkToIdealSolution] = useState(false);
    const [name, setName] = useState('');
    const [trace, setTrace] = useState('');
    const [date, setDate] = useState('');
    const [testMaxNumber, setTestMaxNumber] = useState('');
    const [linkToIdealSolution, setLinkToIdealSolution] = useState('');
    const [gitLabUsername, setGitLabUsername] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [backendError, setBackendError] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState('');

    const handleClose = () => {
        setName('');
        setTrace('');
        setDate('');
        setTestMaxNumber('');
        setLinkToIdealSolution('');
        setDirty(true)
        closeModal();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isValidName && isValidTrace && isValidDate && isValidTestMaxNumber && isValidLinkToIdealSolution) {
            setBackendError(false);
            setBackendErrorMessage('');
            try {
                if (edit) { //edit lab
                    try {
                        await API.updateLab(new Lab(labToEdit.id, name, date, trace, false, labToEdit.leaderboard, testMaxNumber, linkToIdealSolution), gitLabUsername, accessToken)
                        handleClose()
                    } catch(e) {
                        setBackendError(true)
                        setBackendErrorMessage(`Something went wrong. Is ${linkToIdealSolution} the correct link?`)
                    }
                }
                else { //start lab
                    //set fake id as 0, backend will overwrite it
                    try {
                        await API.createAndStartLab(new Lab(0, name, date, trace, false, null, testMaxNumber, linkToIdealSolution), gitLabUsername, accessToken)
                        handleClose()
                    } catch(e) {
                        setBackendError(true)
                        setBackendErrorMessage(`Something went wrong. Is ${linkToIdealSolution} the correct link?`)
                    }
                }
            } catch (errorMessage) {
                setBackendError(true);
                setBackendErrorMessage(errorMessage);
            }
        }
        else { //invalid text in form
            console.log('Invalid data in form')
            console.log('Name valid: ' + isValidName)
            console.log('Trace valid: ' + isValidTrace)
            console.log('Max test number valid: ' + isValidTestMaxNumber)
            console.log('Link to solution valid: ' + isValidLinkToIdealSolution)
            event.stopPropagation();
        }
    };

    const onShow = () => {
        if (edit) {
            onChangeName(labToEdit.name);
            onChangeTrace(labToEdit.trace);
            onChangeDate(labToEdit.deadline);
            onChangeTestMaxNumber(labToEdit.testMaxNumber);
            onChangeLinkToIdealSolution(labToEdit.linkToIdealSolution);
        }
    }

    const onChangeName = (formName) => {
        setName(formName);
        if (formName === '') setIsValidName(false);
        else setIsValidName(true);
    }

    const onChangeTrace = (formTrace) => {
        setTrace(formTrace);
        if (formTrace === '') setIsValidTrace(false);
        else setIsValidTrace(true);
    }

    const onChangeDate = (formDate) => {
        setDate(formDate);
        if (formDate === '' || !dayjs(formDate, 'DD-MM-YYYY', false).isValid() || dayjs(formDate, 'DD-MM-YYYY').isBefore(dayjs()))
            setIsValidDate(false);
        else setIsValidDate(true);
    }

    const onChangeTestMaxNumber = (formNum) => {
        setTestMaxNumber(formNum);
        if (formNum === '' || Number(formNum) <= 0) setIsValidTestMaxNumber(false);
        else setIsValidTestMaxNumber(true);
    }

    const onChangeLinkToIdealSolution = (formLinkToIdealSolution) => {
        setLinkToIdealSolution(formLinkToIdealSolution);
        if (formLinkToIdealSolution === '') setIsValidLinkToIdealSolution(false);
        else setIsValidLinkToIdealSolution(true);
    }

    return (
        <Modal
            show={show}
            onShow={onShow}
            animation={true}
            onHide={handleClose}>
            <Modal.Header closeButton>
                {
                    edit ?
                        <Modal.Title>Edit Lab</Modal.Title>
                        :
                        <Modal.Title>Start a new Lab</Modal.Title>

                }
            </Modal.Header>
            <Modal.Body>
                {
                    backendError ?
                        <Alert variant='danger'>
                            {backendErrorMessage}
                        </Alert>
                        :
                        ''
                }
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                    <Form.Group as={Col} md="3" controlId="validationGitlabUsername">
                            <Form.Label>GitLab Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert GitLab username"
                                defaultValue={''}
                                onChange={e => setGitLabUsername(e.target.value)}
                            />
                            <Form.Text>{'> 0'}</Form.Text>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationAccessToken">
                            <Form.Label>GitLab Access Token</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert GitLab Access Token"
                                defaultValue={''}
                                onChange={e => setAccessToken(e.target.value)}
                            />
                            <Form.Text>{'> 0'}</Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Please provide a max number of tests {'( > 0 )'}.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert name"
                                defaultValue={edit ? labToEdit.name : name}
                                onChange={e => onChangeName(e.target.value)}
                                isInvalid={!isValidName}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationTrace">
                            <Form.Label>Trace</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert trace"
                                defaultValue={edit ? labToEdit.trace : trace}
                                onChange={e => onChangeTrace(e.target.value)}
                                isInvalid={!isValidTrace}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a trace.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationDate">
                            <Form.Label>Expiration date</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert expiration date"
                                defaultValue={edit ? labToEdit.deadline : date}
                                onChange={e => onChangeDate(e.target.value)}
                                isInvalid={!isValidDate}
                            />
                            <Form.Text>dd-mm-yyyy</Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Please provide a date {'(in the future)'}.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationTestMaxNumber">
                            <Form.Label>Test number</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Insert test max number"
                                defaultValue={edit ? labToEdit.testMaxNumber : testMaxNumber}
                                onChange={e => onChangeTestMaxNumber(e.target.value)}
                                isInvalid={!isValidTestMaxNumber}
                            />
                            <Form.Text>{'> 0'}</Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Please provide a max number of tests {'( > 0 )'}.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group md="3" controlId="validationLinkToIdealSolution">
                            <Form.Label>Solution's repository URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert link to solution repository"
                                defaultValue={edit ? labToEdit.linkToIdealSolution : linkToIdealSolution}
                                onChange={e => onChangeLinkToIdealSolution(e.target.value)}
                                isInvalid={!isValidLinkToIdealSolution}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a link to solution repository.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    {
                        edit ?
                            <Button type="submit" style={{ marginTop: '1rem', marginRight: '1rem' }}>Save</Button>
                            :
                            <Button type="submit">Create lab</Button>
                    }
                    <Button variant='secondary' onClick={() => handleClose(false)} style={{ marginTop: '1rem', marginRight: '1rem' }}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

function ModalDeleteLab(props) {
    const { show, closeModal, lab } = props;
    const [backendError, setBackendError] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState('');

    const handleClose = () => {
        setBackendError(false);
        setBackendErrorMessage('');
        closeModal(null);
    }

    const handleDelete = async () => {
        setBackendError(false);
        setBackendErrorMessage('');
        try {
            await API.deleteLab(lab);
            closeModal(lab);
        } catch (errorMessage) {
            setBackendError(true);
            setBackendErrorMessage(errorMessage);
        }

    }

    return (
        <Modal
            show={show}
            animation={true}
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete this lab?</Modal.Title>
            </Modal.Header>
            {
                backendError ?
                    <Modal.Body>
                        <Alert variant='danger'>{backendErrorMessage}</Alert>
                    </Modal.Body>
                    :
                    ''
            }
            <Modal.Footer>
                <Button variant='danger' onClick={() => handleDelete()}>Delete</Button>
                <Button variant='outline-secondary' onClick={() => handleClose(false)}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}

function ModalStopLab(props) {
    const { show, closeModal, lab } = props;
    const [backendError, setBackendError] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState('');

    const handleClose = () => {
        setBackendError(false);
        setBackendErrorMessage('');
        closeModal();
    }

    const handleStop = async () => {
        setBackendError(false);
        setBackendErrorMessage('');
        try {
            await API.stopLab(lab);
            closeModal();
        } catch (errorMessage) {
            setBackendError(true);
            setBackendErrorMessage(errorMessage);
        }

    }

    return (
        <Modal
            show={show}
            animation={true}
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to stop this lab?</Modal.Title>
            </Modal.Header>
            {
                backendError ?
                    <Modal.Body>
                        <Alert variant='danger'>{backendErrorMessage}</Alert>
                    </Modal.Body>
                    :
                    ''
            }
            <Modal.Footer>
                <Button variant='danger' onClick={() => handleStop()}>Stop</Button>
                <Button variant='outline-secondary' onClick={() => handleClose(false)}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Labs;
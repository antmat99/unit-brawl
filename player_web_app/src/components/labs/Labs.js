import { useEffect, useState } from "react";
import LabList from "./LabList";
import LabMain from "./LabMain";
import { Container, Row, Col, Modal, Button, Form, Alert } from 'react-bootstrap'
import API from "../../API";

//TODO: fix all forms

function Labs() {
    const [labs, setLabs] = useState([])
    const [labsAttendedIds, setLabsAttendedIds] = useState([])
    const [selectedLab, setSelectedLab] = useState(undefined)
    const [showModalJoinLab, setShowModalJoinLab] = useState(false)
    const [showModalEditRepository, setShowModalEditRepository] = useState(false)
    const [dirty, setDirty] = useState(true);
    //partial leaderboard
    const [userLabRegionLeaderboard, setUserLabRegionLeaderboard] = useState([]);
    const [repositoryLink, setRepositoryLink] = useState([])
    const [activeRepoLink, setActiveRepoLink] = useState('')
    const [activeSolRepoLink, setActiveSolRepoLink] = useState('')


    useEffect(() => {
        if (dirty) {
            API.getLabs()
                .then(list => {
                    setLabs(list);
                    setSelectedLab(list[list.length - 1])
                    API.getUserLabsAttended()
                        .then(list => {
                            setLabsAttendedIds(list);
                        })
                        .catch(err => handleError(err));
                })
                .catch(err => handleError(err))
            setDirty(false)
        }
    }, [dirty])

    useEffect(() => {
        API.getUserLabsAttended()
            .then(list => {
                setLabsAttendedIds(list);
            })
            .catch(err => handleError(err));
        if (selectedLab != undefined)
            API.getUserLabRegionLeaderboard(selectedLab.id)
                .then(list => {
                    setUserLabRegionLeaderboard(list)
                })
                .catch(err => handleError(err))
    }, [selectedLab])


    function handleError(err) {
        console.log(err);
    }

    const selectLab = (lab) => {
        setSelectedLab(lab);
    }

    const openModalJoinLab = () => {
        setShowModalJoinLab(true);
    }

    const closeModalJoinLab = () => {
        setShowModalJoinLab(false);
    }

    const openModalEditRepository = () => {
        API.getRepositoryLink(selectedLab.id)
            .then(link => {
                console.log(link)
                setRepositoryLink(link)
                setShowModalEditRepository(true);
            })
            .catch(err => handleError(err))
    }

    const closeModalEditRepository = (newLink) => {
        if (newLink != undefined) setRepositoryLink(newLink);
        setShowModalEditRepository(false);
    }

    return (
        <Container fluid>
            <Row>
                <Col lg={2}>
                    <LabList labs={labs} selectLab={selectLab} />
                </Col>
                <Col lg={9}>
                    <LabMain lab={selectedLab} studentRepoLink={activeRepoLink} solutionRepoLink={activeSolRepoLink} labsAttendedIds={labsAttendedIds} joinLab={openModalJoinLab} userLabRegionLeaderboard={userLabRegionLeaderboard} editRepository={openModalEditRepository} />
                </Col>
            </Row>
            <ModalJoinLab lab={selectedLab} show={showModalJoinLab} close={closeModalJoinLab} setActiveRepoLink={setActiveRepoLink} setActiveSolRepoLink={setActiveSolRepoLink}/>
            <ModalEditRepository lab={selectedLab} show={showModalEditRepository} close={closeModalEditRepository} actualLink={repositoryLink} setActiveRepoLink={setActiveRepoLink}/>
        </Container>
    )
}


function ModalJoinLab(props) {
    const { lab, show, close } = props;

    const [link, setLink] = useState('');
    const [isValidLink, setIsValidLink] = useState(false);
    const [backendError, setBackendError] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState('');

    const handleClose = () => {
        setLink('');
        setBackendError(false);
        setBackendErrorMessage('');
        close();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isValidLink) {
            setBackendError(false);
            setBackendErrorMessage('');
            try {
                await API.joinLab(link);
            } catch (errorMessage) {
                setBackendError(true);
                setBackendErrorMessage(errorMessage);
                event.preventDefault();
                event.stopPropagation();
            }
        }
        else { //invalid text in form
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const onChangeLink = (formLink) => {
        setLink(formLink);
        if (formLink === '') setIsValidLink(false);
        else setIsValidLink(true);
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            animation={true}
        >
            <Modal.Header>
                Do you want to join {(lab != undefined) ? lab.name : ''}?
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

                        <Form.Group md='4' controlId="validationRepository">
                            <Form.Label>Insert link to your lab's repository</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Link"
                                onChange={e => onChangeLink(e.target.value)}
                                isInvalid={!isValidLink}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a link to your repository.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Button type='submit'>Join</Button>
                    <Button variant='secondary' onClick={() => handleClose()}>Cancel</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )

}

function ModalEditRepository(props) {
    const { lab, show, close, actualLink } = props;

    const [link, setLink] = useState(actualLink);
    const [isValidLink, setIsValidLink] = useState(false);
    const [backendError, setBackendError] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState('');

    const handleClose = () => {
        const newLink = link;
        setBackendError(false);
        setBackendErrorMessage('');
        close(newLink);
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (isValidLink) {
            setBackendError(false);
            setBackendErrorMessage('');
            try {
                await API.editRepository(lab.id, link);
            } catch (errorMessage) {
                setBackendError(true);
                setBackendErrorMessage(errorMessage);
                event.preventDefault();
                event.stopPropagation();
            }
        }
        else { //invalid text in form
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const onChangeLink = (formLink) => {
        setLink(formLink);
        if (formLink === '') setIsValidLink(false);
        else setIsValidLink(true);
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            animation={true}
        >
            <Modal.Header>
                <Modal.Title>
                    Edit your solution's repository for this lab
                </Modal.Title>
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

                        <Form.Group md='4' controlId="validationRepository">
                            <Form.Label>Insert link to your lab's repository</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Link"
                                defaultValue={actualLink}
                                onChange={e => onChangeLink(e.target.value)}
                                isInvalid={!isValidLink}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a link to your repository.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Button variant='secondary' onClick={() => handleClose()}>Cancel</Button>
                    <Button type='submit' className='margin-left'>Edit</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )

}

export default Labs;
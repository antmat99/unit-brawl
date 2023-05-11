import { useEffect, useState } from "react";
import LabList from "./LabList";
import LabMain from "./LabMain";
import { Container, Row, Col, Modal, Button, Form, Alert } from 'react-bootstrap'
import API from "../../API";

//TODO: fix all forms

function Labs() {
    const [loading, setLoading] = useState(false)
    const [labs, setLabs] = useState([])
    const [labsAttendedIds, setLabsAttendedIds] = useState([])
    const [selectedLab, setSelectedLab] = useState(undefined)
    const [showModalJoinLab, setShowModalJoinLab] = useState(false)
    const [showModalEditRepository, setShowModalEditRepository] = useState(false)
    const [dirty, setDirty] = useState(true);
    //partial leaderboard
    const [userLabRegionLeaderboard, setUserLabRegionLeaderboard] = useState([]);
    const [repositoryLink, setRepositoryLink] = useState([])


/*     useEffect(() => {
        if (dirty) {
            setLoading(true)
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
            setLoading(false)
        }
    }, [dirty]) */

    useEffect(() => {
        const update = async () => {
            if (dirty) {
                setLoading(true)
                try {
                    const allLabs = await API.getLabs()
                    setLabs(allLabs)
                    setSelectedLab(allLabs[allLabs.length - 1])
                    const userLabs = await API.getUserLabsAttended()
                    setLabsAttendedIds(userLabs)
                } catch(e) {
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

    return <>
        {
            loading ? <></> :
                <Container fluid>
                    <Row>
                        <Col lg={2}>
                            <LabList labs={labs} selectLab={selectLab} />
                        </Col>
                        <Col lg={9}>
                            <LabMain lab={selectedLab} labsAttendedIds={labsAttendedIds} joinLab={openModalJoinLab} userLabRegionLeaderboard={userLabRegionLeaderboard} editRepository={openModalEditRepository} />
                        </Col>
                    </Row>
                    <ModalJoinLab lab={selectedLab} show={showModalJoinLab} close={closeModalJoinLab} setDirty={setDirty} />
                    <ModalEditRepository lab={selectedLab} show={showModalEditRepository} close={closeModalEditRepository} actualLink={repositoryLink} />
                </Container>
        }
    </>
}


function ModalJoinLab(props) {
    const { lab, show, close, setDirty } = props;

    const [link, setLink] = useState('');
    const [backendError, setBackendError] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState('');

    const handleClose = () => {
        setLink('');
        setBackendError(false);
        setBackendErrorMessage('');
        setDirty(true)
        close();
    }

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!link) {
            alert('Please provide a link')
        }
        else {
            setBackendError(false);
            setBackendErrorMessage('');
            try {
                API.joinLab(link)
                handleClose()
            } catch (e) {
                setBackendError(true)
                setBackendErrorMessage(`Something went wrong. Is ${link} the correct link?`)
                event.stopPropagation();
            }
        }
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            animation={true}
        >
            <Modal.Header>
                Insert link to your repository for lab {(lab != undefined) ? lab.name : ''}
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
                            <Form.Label>Link</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Enter link to lab repository'
                                value={link}
                                onChange={handleLinkChange}
                                required
                            />
                        </Form.Group>
                    </Row>
                    <Button type='submit'>Join</Button>
                    <Button variant='secondary' onClick={handleClose}>Cancel</Button>
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
                handleClose()
            } catch (errorMessage) {
                setBackendError(true)
                setBackendErrorMessage(`Something went wrong. Is ${link} the correct link?`)
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
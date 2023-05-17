import '../../App.css';
import API from '../../API.js';
import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Alert, Button, Modal, Figure } from 'react-bootstrap';
import { PLAYERPREFIX } from '../../utils';

function ProfileSectionAvatars(props) {

    const [avatarList, setAvatarList] = useState([]); 
    const [avatarElementList, setAvatarElementList] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const [showModalMoreInfo, setShowModalMoreInfo] = useState(false);

    useEffect(() => {
        API.getUserAvatars()
            .then(list => {
                setAvatarList(list)
            })
            .catch(err => handleError(err))
    }, [])

    useEffect(() => {
        createAvatarElementList()
    }, [avatarList])

    function handleError(err) {
        //TODO handle errors
        console.log(err)
    }

    const setAvatarAsPropic = (avatar) => {
        API.setAvatarAsPropic(avatar.id)
            .then(id => props.changeDirtyPropic(true))
            .catch(err => handleError(err))
    }

    const openModalMoreInfo = (avatar) => {
        setSelectedAvatar(avatar);
        setShowModalMoreInfo(true);
    }

    const closeModalMoreInfo = () => {
        setSelectedAvatar(undefined);
        setShowModalMoreInfo(false);
    }

    const createAvatarElementList = () => {
        let ret = [];
        avatarList.forEach((avatar, index) => {
            ret.push(
                <Col key={index} lg='auto' >
                    <Card className='card-avatar'>
                        <Card.Img src={avatar.imagePath} className='margin-bottom-row'/>
                        <Card.Title className='margin-left'> {avatar.name} </Card.Title>
                        <Card.Footer >
                            <Button
                                onClick={() => setAvatarAsPropic(avatar)}
                                style={{ position: 'relative', float: 'right' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                            </Button>
                            <Button onClick={() => openModalMoreInfo(avatar)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                                </svg>
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            )
        })
        setAvatarElementList(ret);
    }

    return (
        <Container>
            <Row className='scrollable-vertically '>
                {
                    avatarList.length == 0 ?
                        <Alert key='alert' variant='warning'>
                            You have no avatars yet. Try buying some at the <a href={PLAYERPREFIX + '/shop'}>shop</a>!
                        </Alert>
                        :
                        avatarElementList
                }
            </Row>
            {
                selectedAvatar != undefined ?
                    <ModalMoreInfo show={showModalMoreInfo} closeModal={closeModalMoreInfo} avatar={selectedAvatar} />
                    :
                    ''
            }

        </Container>
    )
}


function ModalMoreInfo(props) {
    const { avatar, closeModal, show } = props;

    const handleClose = () => {
        closeModal()
    }

    return (
        <Modal
            show={show}
            animation={true}
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{avatar.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col lg={4}>
                            <Figure>
                                <Figure.Image
                                    src={avatar.imagePath}
                                />
                            </Figure>
                        </Col>
                        <Col lg={8} className='center-vertically-row'>
                            {avatar.description}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer><h6><b>Price:</b> {avatar.price}</h6></Modal.Footer>
        </Modal>
    )
}

export default ProfileSectionAvatars;
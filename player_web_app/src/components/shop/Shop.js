import { useEffect, useState } from 'react';
import { Alert, Container, Row, Col, Card, Button, Offcanvas, Figure, ListGroup, Modal, OverlayTrigger, Tooltip, Toast, Overlay, Badge } from 'react-bootstrap';
import { Button as FloatingActionButton, Container as FABContainer } from 'react-floating-action-button';
import API from '../../API';
import '../../App.css'

function Shop() {

    const [userMoney, setUserMoney] = useState(0)
    const [availableAvatars, setAvailableAvatars] = useState([]) //avatars not owned by user
    const [availabelAvatarElementList, setAvailableAvatarElementList] = useState([]) 
    const [showCart, setShowCart] = useState(false);
    const [avatarsInCart, setAvatarsInCart] = useState([]);
    const [avatarsInCartElementList, setAvatarsInCartElementList] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [modalErrorMessage, setModalErrorMessage] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
    const [showToastOrderConfirmed, setShowToastOrderConfirmed] = useState(false);

    useEffect(() => {
        if (dirty) {
            API.getUserMoney()
                .then(number => setUserMoney(number))
                .catch(err => handleError(err))

            API.getAvailableAvatars()
                .then(list => setAvailableAvatars(list))
                .catch(err => handleError(err))
            setDirty(false)
            setAvatarsInCart([])
            setShowCart(false)
        }
    }, [dirty])

    useEffect(() => {
        createAvailableAvatarElementList()
    }, [availableAvatars])

    useEffect(() => {
        createAvatarInCartElementList()
    }, [avatarsInCart])

    function handleError(err) {
        //TODO handle errors
        console.log(err)
    }

    const createAvailableAvatarElementList = () => {
        const ret = [];
        availableAvatars.forEach((avatar, index) => {
            ret.push(
                <Col key={index} lg='auto'>
                    <Card className='card-avatar'>
                        <Card.Img src={avatar.imagePath} />
                        <Card.Title className='margin-left'> {avatar.name} </Card.Title>
                        <Card.Subtitle className="mb-2 margin-left">Price: {avatar.price}</Card.Subtitle>
                        <Card.Footer>
                            <Button
                                onClick={() => addAvatarToCart(avatar)}
                                style={{ position: 'relative', float: 'right' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
                                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                </svg>
                            </Button>
                            <Button onClick={() => openInfoModal(avatar)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                                </svg>
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            )
        });
        setAvailableAvatarElementList(ret);
    }

    const createAvatarInCartElementList = () => {
        const ret = [];
        avatarsInCart.forEach((avatar, index) => {
            ret.push(
                <ListGroup.Item key={index}>
                    <Container fluid>
                        <Row>
                            <Col lg={2}>
                                <Figure>
                                    <Figure.Image
                                        src={avatar.imagePath}
                                    />
                                </Figure>
                            </Col>
                            <Col lg={8}>
                                <h5>{avatar.name}</h5>
                                <h6>Price: {avatar.price}</h6>
                                <Button variant='link' onClick={() => openInfoModal(avatar)} className='p-0'>
                                    More info
                                </Button>
                            </Col>
                            <Col lg={2}>
                                <Button onClick={() => removeAvatarFromCart(avatar)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                    </svg>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </ListGroup.Item>
            )
        });
        setAvatarsInCartElementList(ret);
    }

    const addAvatarToCart = (avatar) => {
        setAvatarsInCart([...avatarsInCart, avatar]);
        setAvailableAvatars(availableAvatars.filter(a => a.id !== avatar.id))
    }

    const removeAvatarFromCart = (avatar) => {
        setAvatarsInCart(avatarsInCart.filter(a => a.id !== avatar.id))
        setAvailableAvatars([...availableAvatars, avatar])
    }

    const getAvatarsInCartTotalPrice = () => {
        return avatarsInCart
            .map(avatar => avatar.price)
            .reduce((previousPrice, currentPrice) => previousPrice + currentPrice, 0)
    }

    const confirmOrder = () => {
        if (getAvatarsInCartTotalPrice() > userMoney) {
            setModalErrorMessage("You don't have enough money to submit this order.")
            setShowErrorModal(true);
        }
        else {
            API.buyAvatars(avatarsInCart)
                .then(() => {
                    setDirty(true)
                    setShowToastOrderConfirmed(true)
                })
                .catch(() => handleError())
        }
    }

    const closeErrorModal = () => {
        setShowErrorModal(false);
        setModalErrorMessage('');
    }

    const openInfoModal = (avatar) => {
        setSelectedAvatar(avatar);
        setShowInfoModal(true);
    }

    const closeInfoModal = () => {
        setSelectedAvatar(null);
        setShowInfoModal(false);
    }

    const openConfirmOrderModal = () => {
        setShowConfirmOrderModal(true);
    }

    const closeConfirmOrderModal = (confirm) => {
        if (confirm) confirmOrder();
        setShowConfirmOrderModal(false);
    }

    return (
        <>
            {
                <Overlay show={showToastOrderConfirmed} placement="bottom">
                    <Toast bg='success' onClose={() => setShowToastOrderConfirmed(false)} delay={3000} position='top-center' autohide>
                        <Toast.Header>
                            <strong className="me-auto">Woohoo</strong>
                        </Toast.Header>
                        <Toast.Body>Your order has been confirmed!</Toast.Body>
                    </Toast>
                </Overlay>

            }
            <Container fluid>
                <Row>
                    <Col lg='auto'>
                        <h4>
                            <Badge pill bg='warning' text='dark' key='alert'>
                                💲 Your money: {userMoney}
                            </Badge>
                        </h4>
                    </Col>
                </Row>
                <Row>
                    {availabelAvatarElementList}
                </Row>
                <FABContainer>
                    <FloatingActionButton onClick={() => setShowCart(true)} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-fill" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z" />
                        </svg>
                    </FloatingActionButton>
                </FABContainer>
            </Container>


            <Offcanvas placement='end' show={showCart} onHide={() => setShowCart(false)}>
                <Offcanvas.Header closeButton>
                    <Container fluid>
                        <Row>
                            <h2>Cart</h2>
                        </Row>
                        <Row>
                        </Row>
                    </Container>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ListGroup variant='flush'>
                        {avatarsInCartElementList}
                    </ListGroup>
                    <Container fluid className='footer background-light-grey'>
                        <Row style={{ marginTop: '0.7rem', marginBottom: '0.7rem' }}>
                            <Col lg={9} className='center-vertically-row '>
                                <h5><b>Total:</b> {getAvatarsInCartTotalPrice()}</h5>
                            </Col>
                            <Col lg='auto'>
                                {
                                    avatarsInCart.length != 0 ?
                                        <Button onClick={() => openConfirmOrderModal()}>
                                            Buy
                                        </Button>
                                        :
                                        <OverlayTrigger
                                            placement='left'
                                            overlay={
                                                <Tooltip id={`tooltip-left`}>
                                                    Your cart is empty!
                                                </Tooltip>
                                            }
                                        >
                                            <Button>Buy</Button>
                                        </OverlayTrigger>
                                }

                            </Col>
                        </Row>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>

            <ModalError show={showErrorModal} errorMessage={modalErrorMessage} closeModal={closeErrorModal} />

            {
                selectedAvatar !== null ?
                    <ModalMoreInfo show={showInfoModal} closeModal={closeInfoModal} avatar={selectedAvatar} />
                    :
                    ''
            }
            {
                <ModalConfirmOrder show={showConfirmOrderModal} closeModal={closeConfirmOrderModal} />
            }

        </>
    )
}

function ModalError(props) {
    const { show, errorMessage, closeModal } = props;

    const handleClose = () => {
        closeModal()
    }

    return (
        <Modal
            show={show}
            animation={true}
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ops! An error occurred</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage}
            </Modal.Body>
        </Modal>
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

function ModalConfirmOrder(props) {
    const { closeModal, show } = props;

    const handleClose = (confirmOrder) => {
        closeModal(confirmOrder);
    }

    return (
        <Modal
            show={show}
            animation={true}
            onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Do you want to confirm your order?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button onClick={() => handleClose(true)}>
                    Confirm
                </Button>
                <Button variant='secondary' onClick={() => handleClose(false)}>
                    Go back
                </Button>
            </Modal.Footer>
        </Modal>
    )

}

export default Shop;
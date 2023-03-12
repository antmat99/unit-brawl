import { useEffect, useState } from "react";
import { Button as FloatingActionButton, Container as FABContainer } from 'react-floating-action-button';
import API from "../../API";
import { Container, Row, Col, Alert, Modal, Button, Form, Table } from 'react-bootstrap';
import Avatar from '../../models/Avatar';



function Avatars() {
    const [avatarList, setAvatarList] = useState([]);
    const [showModalAddEdit, setShowModalAddEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [avatarSelected, setAvatarSelected] = useState(undefined);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        const f = async () => {
            const list = await API.getAvatarList();
            setAvatarList(list);
        }
        f();
    }, [])

    const closeModalDelete = () => {
        setAvatarSelected(undefined);
        setShowModalDelete(false);
        //todo update avatarlist
    }

    const closeModalAddEdit = () => {
        setAvatarSelected(undefined);
        setShowModalAddEdit(false);
        setEdit(false);
        //todo update avatarlist
    }

    const deleteAvatar = (avatar) => {
        setAvatarSelected(avatar);
        setShowModalDelete(true);
    }

    const editAvatar = (avatar) => {
        setEdit(true)
        setAvatarSelected(avatar);
        setShowModalAddEdit(true);
    }

    const createAvatar = () => {
        setEdit(false);
        setShowModalAddEdit(true);
    }

    return (
        <>
            <Table striped condensed hover>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>imagePath</th>
                        <th>Price</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {avatarList.map((avatar, index) =>
                        <tr key={index} className='collapsable'>
                            <td>{avatar.id}</td>
                            <td>{avatar.name}</td>
                            <td>{avatar.description}</td>
                            <td>{avatar.imagePath}</td>
                            <td>{avatar.price}</td>
                            <td><Button onClick={() => editAvatar(avatar)}>Edit</Button></td>
                            <td><Button variant='danger' onClick={() => deleteAvatar(avatar)}>Delete</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <FABContainer>
                <FloatingActionButton onClick={() => createAvatar()} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg>
                </FloatingActionButton>
            </FABContainer>
            <ModalAddEdit show={showModalAddEdit} closeModal={closeModalAddEdit} avatar={avatarSelected} edit={edit} />
            <ModalDelete show={showModalDelete} closeModal={closeModalDelete} avatar={avatarSelected} />
        </>

    );

}

function ModalAddEdit(props) {
    const { show, closeModal, avatar, edit } = props;
    const [isValidName, setIsValidName] = useState(false);
    const [isValidDescription, setIsValidDescription] = useState(false);
    const [isValidImagePath, setIsValidImagePath] = useState(false);
    const [isValidPrice, setIsValidPrice] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [price, setPrice] = useState('');
    const [backendError, setBackendError] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState('');

    const handleClose = () => {
        setName('');
        setDescription('');
        setImagePath('');
        setPrice('');
        setIsValidName(false);
        setIsValidDescription(false);
        setIsValidImagePath(false);
        setIsValidPrice(false);
        closeModal();
    }

    const handleSubmit = async (event) => {
        if (isValidName && isValidDescription && isValidImagePath && isValidPrice) {
            setBackendError(false);
            setBackendErrorMessage('');
            try {
                if (edit)
                    await API.updateAvatar(new Avatar(avatar.id, name, description, imagePath, price));
                else
                    await API.createAvatar(new Avatar(0, name, description, imagePath, price))
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

    const onShow = () => {
        if (edit) {
            onChangeName(avatar.name);
            onChangeDescription(avatar.description);
            onChangeImagePath(avatar.imagePath);
            onChangePrice(avatar.price);
        }
    }

    const onChangeName = (formName) => {
        setName(formName);
        if (formName === '') setIsValidName(false);
        else setIsValidName(true);
    }

    const onChangeDescription = (formDescription) => {
        setDescription(formDescription);
        if (formDescription === '') setIsValidDescription(false);
        else setIsValidDescription(true);
    }

    const onChangeImagePath = (formImagePath) => {
        setImagePath(formImagePath);
        if (formImagePath === '') setIsValidImagePath(false);
        else setIsValidImagePath(true);
    }

    const onChangePrice = (formPrice) => {
        setPrice(formPrice);
        if (formPrice === '' || Number(formPrice) < 0) setIsValidPrice(false);
        else setIsValidPrice(true);
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
                        <Modal.Title>Edit avatar</Modal.Title>
                        :
                        <Modal.Title>Create avatar</Modal.Title>

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
                        <Form.Group as={Col} md="4" controlId="validationName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert name"
                                defaultValue={name}
                                onChange={e => onChangeName(e.target.value)}
                                isInvalid={!isValidName}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert description"
                                defaultValue={description}
                                onChange={e => onChangeDescription(e.target.value)}
                                isInvalid={!isValidDescription}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a description.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationImagePath">
                            <Form.Label>Image path</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert image path"
                                defaultValue={imagePath}
                                onChange={e => onChangeImagePath(e.target.value)}
                                isInvalid={!isValidImagePath}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide an image path.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Insert price"
                                defaultValue={price}
                                onChange={e => onChangePrice(e.target.value)}
                                isInvalid={!isValidPrice}
                            />
                            <Form.Text>{'>= 0'}</Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Please provide a price {'( >= 0 )'}.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    {
                        edit ?
                            <Button type="submit">Save</Button>
                            :
                            <Button type="submit">Create</Button>
                    }
                    <Button variant='secondary' onClick={() => handleClose(false)}>Cancel</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )


}

function ModalDelete(props) {
    const { show, closeModal, avatar } = props;
    const [backendError, setBackendError] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState('');

    const handleClose = () => {
        setBackendError(false);
        setBackendErrorMessage('');
        closeModal();
    }

    const handleDelete = async () => {
        setBackendError(false);
        setBackendErrorMessage('');
        try {
            await API.deleteAvatar(avatar);
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
                <Modal.Title>Are you sure to delete this avatar?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    backendError ?
                        <Alert variant='danger'>{backendErrorMessage}</Alert>
                        :
                        ''
                }
                {
                    avatar ?
                        avatar.name
                        :
                        ''
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={() => handleDelete()}>Delete</Button>
                <Button variant='secondary' onClick={() => handleClose(false)}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Avatars;
import { useEffect, useState } from 'react';
import { Container, Row, Col, Figure, Button, Form, InputGroup } from 'react-bootstrap';
import API from '../../API';

function ProfileHeader(props) {

    const { leftColDimension, rightColDimension } = props;

    const [edit, setEdit] = useState(false)
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [nickname, setNickname] = useState('')
    const [money, setMoney] = useState(0)
    const [unlockedAchievementsCount, setUnlockedAchievementsCount] = useState(0)
    const [avatarSelected, setAvatarSelected] = useState(undefined)


    useEffect(() => {
        if (props.dirtyPropic) {
            API.getUserName()
                .then(string => setName(string))
                .catch(err => handleError(err))

            API.getUserSurname()
                .then(string => setSurname(string))
                .catch(err => handleError(err))

            API.getUserNickname()
                .then(string => setNickname(string))
                .catch(err => handleError(err))

            API.getUserMoney()
                .then(number => setMoney(number))
                .catch(err => handleError(err))

            API.getUserUnlockedAchievementsCount()
                .then(number => setUnlockedAchievementsCount(number))
                .catch(err => handleError(err))

            API.getUserAvatarSelected()
                .then(avatar => setAvatarSelected(avatar))
                .catch(err => handleError(err))
            props.changeDirtyPropic(false);
        }
    }, [props.dirtyPropic])

    function handleError(err) {
        //TODO handle errors
        console.log(err)
    }

    const changeInfo = (info) => {
        setName(info.name);
        setSurname(info.surname);
        setNickname(info.nickname);
    }

    return (
        <Container>
            <Row>
                <Col lg={leftColDimension}>
                    <Figure>
                        {
                            avatarSelected != undefined ?
                                <Figure.Image
                                    src={avatarSelected.image_path}
                                />
                                :
                                ''
                        }

                    </Figure>
                </Col>
                <Col lg={props.rightColDimension - 1} className='center-vertically-row'>
                    <Container>
                        <Row>
                            {edit ?
                                <EditInfo name={name} surname={surname} nickname={nickname} changeInfo={changeInfo} />
                                :
                                <ShowInfo name={name} surname={surname} nickname={nickname} />
                            }
                        </Row>
                        <Row>
                            <h5>
                                <b>Money:</b> {money}
                            </h5>
                        </Row>
                        <Row>
                            <h5>
                                <b>Unlocked achievements:</b> {unlockedAchievementsCount}
                            </h5>
                        </Row>
                    </Container>


                </Col>
                <Col lg={1}>
                    {
                        /*
                    <Button onClick={() => setEdit(!edit)>
                        {edit ?
                            'Save'
                            :
                            'Edit'
                        }
                    </Button>
                    {edit ?
                        <Button onClick={() => setEdit(false)}>
                            Cancel
                        </Button>
                        :
                        ''
                    }
                    */
                    }
                </Col>
            </Row>
        </Container>
    )
}

function ShowInfo(props) {
    const { name, surname, nickname } = props;

    return (
        <>
            <Row>
                <h3>
                    @{nickname}
                </h3>
            </Row>
            <Row>
                <h4>
                    {name} {surname}
                </h4>
            </Row>
        </>
    )
}

function EditInfo(props) {
    const { name, surname, nickname } = props

    const [info, setInfo] = useState({ name: name, surname: surname, nickname: nickname })

    return (
        <Row>
            <Form>

                <Form.Group className="mb-3" controlId="formName">
                    <InputGroup>
                        <InputGroup.Text id="inputgroup-name">Name    </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder={name}
                            onChange={e => setInfo({ name: e.target.value })}
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSurname">
                    <InputGroup>
                        <InputGroup.Text id="inputgroup-surname">Surname </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder={surname}
                            onChange={e => setInfo({ surname: e.target.value })}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formNickname">
                    <InputGroup>
                        <InputGroup.Text id="inputgroup-nickname">Nickname</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder={nickname}
                            onChange={e => setInfo({ nickname: e.target.value })}
                        />
                    </InputGroup>
                </Form.Group>
            </Form>
        </Row>

    )

}

export default ProfileHeader;
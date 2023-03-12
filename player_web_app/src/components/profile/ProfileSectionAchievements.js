import { useEffect, useState } from 'react';
import { Card, ProgressBar, Container, Row, Col, Figure, Nav } from 'react-bootstrap';
import API from '../../API';



function ProfileSectionAchievements() {

    const [achievements, setAchievements] = useState([]) 
    const [achievementElementList, setAchievementElementList] = useState([])
    const [coverageAchievements, setCoverageAchievements] = useState([]);

    useEffect(() => {
        API.getUserAchievements()
            .then(list => {
                //if there is an active lab and user joined it, take coverage achievement's completion percentage
                //from fake table updated by gitlab
                API.isUserJoinedActiveLab()
                    .then(res => {
                        if (res) {
                            API.getUserAchievementsFake()
                                .then(achievements => {
                                    setCoverageAchievements(achievements); //if length is not the same take achievements from here
                                    setAchievements(list);
                                })
                                .catch(err => handleError(err))
                        }
                        else {
                            setAchievements(list);
                        }
                    })
                    .catch(err => handleError(err))
            })
            .catch(err => handleError(err))
    }, [])

    useEffect(() => {
        createAchievementElementList(achievements);
    }, [achievements])

    function handleError(err) {
        //TODO handle errors
        console.log(err)
    }

    const createAchievementElementList = (list) => {
        const ret = [];
        list.forEach((achievement, index) => {
            let background = 'white'
            if (coverageAchievements.length != 0 && achievement.code.startsWith('COVERAGE')) {
                achievement = coverageAchievements.find(a => a.code == achievement.code);
                background = 'yellow'
            }
            ret.push(
                <div className='margin-bottom-row'>
                    <Row key={index}>
                        <AchievementRow achievement={achievement} background={background} />
                    </Row>
                </div>
            )
        })
        setAchievementElementList(ret)
    }

    const filterAchievementElementList = (condition) => {
        const filteredAchievements = achievements.filter((achievement) => {
            switch (condition) {
                case 'all': return true;
                case 'todo': return !achievement.completed;
                case 'unlocked': return achievement.completed;
                default: return true;
            }
        })
        createAchievementElementList(filteredAchievements);
    }

    return (
        <Container fluid>
            <Row className='margin-bottom-row'>
                <Nav
                    variant='tabs'
                    className='ms-auto'
                    defaultActiveKey='all'
                    onSelect={(selectedKey) => filterAchievementElementList(selectedKey)}
                >
                    <Nav.Item>
                        <Nav.Link eventKey='all'>All</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='todo'>To do</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='unlocked'>Unlocked</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Row>
            {achievementElementList}
        </Container>
    )
}

function AchievementRow(props) {
    const { achievement, background } = props

    return (
        <>
            {
                background == 'white' ?
                    <Card>
                        <Card.Body>
                            <Container fluid>
                                <Row>
                                    <Col lg={11}>
                                        <Card.Title>{achievement.name}</Card.Title>
                                        <Card.Text>
                                            {achievement.description}
                                        </Card.Text>
                                    </Col>
                                    <Col lg={1}>
                                        {achievement.completed ?
                                            <Figure>
                                                <Figure.Image
                                                    src={'/images/'+achievement.badgeImagePath}
                                                />
                                            </Figure>
                                            :
                                            <Figure>
                                                <Figure.Image
                                                    src='/images/placeholder_achievement_uncompleted.png'
                                                />
                                            </Figure>}

                                    </Col>
                                </Row>
                            </Container>
                            {achievement.completed ?
                                <></>
                                :
                                <ProgressBar now={achievement.completitionPercentage} label={`${achievement.completitionPercentage}%`} />
                            }

                        </Card.Body>
                    </Card>
                    :
                    <Card style={{ backgroundColor: '#FFE0B2' }}>
                        <Card.Body>
                            <Container fluid>
                                <Row>
                                    <Col lg={11}>
                                        <Card.Title>{achievement.name}</Card.Title>
                                        <Card.Text>
                                            {achievement.description}
                                        </Card.Text>
                                    </Col>
                                    <Col lg={1}>
                                        {achievement.completed ?
                                            <Figure>
                                                <Figure.Image
                                                    src={achievement.badgeImagePath}
                                                />
                                            </Figure>
                                            :
                                            <Figure>
                                                <Figure.Image
                                                    src='/images/placeholder_achievement_uncompleted.png'
                                                />
                                            </Figure>}

                                    </Col>
                                </Row>
                            </Container>
                            {achievement.completed ?
                                <></>
                                :
                                <ProgressBar now={achievement.completitionPercentage} label={`${achievement.completitionPercentage}%`} />
                            }

                        </Card.Body>
                    </Card>
            }
        </>
    )

}

export default ProfileSectionAchievements;
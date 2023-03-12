import { useEffect, useState } from "react";
import Leaderboard from "../common/Leaderboard";
import API from "../../API";
import { Container, Row, Col } from "react-bootstrap";

function LeaderboardSection() {

    const [resultList, setResultList] = useState([]);
    const [regionLeaderboard, setRegionLeaderboard] = useState([]);

    useEffect(() => {
        API.getGlobalLeaderboard()
            .then(list => setResultList(list))
            .catch(err => handleError(err));
        API.getGlobalRegionLeaderboard()
            .then(list => {
                setRegionLeaderboard(list)
            })
            .catch(err => handleError(err))
    }, []);

    function handleError(err) {
        //TODO handle errors
        console.log(err)
    }

    return (
        <Container>
            {
                regionLeaderboard.length != 0 ?
                    <>
                        <Row>
                            <Col>
                                <h2>Your rank</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Leaderboard resultList={regionLeaderboard} />
                            </Col>
                        </Row>
                    </>
                    : ''
            }
            <Row>
                <Col>
                    <h2>Global leaderboard</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Leaderboard resultList={resultList} />
                </Col>
            </Row>
        </Container>
    )

}

export default LeaderboardSection;
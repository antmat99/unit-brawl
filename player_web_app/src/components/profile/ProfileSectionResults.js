import { useEffect, useState } from 'react';
import { Accordion, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import API from '../../API';


function ProfileSectionResults() {
    const [results, setResults] = useState([]) 
    const [accordionItems, setAccordionItems] = useState([]) 
    const [resultsChanged, setResultsChanged] = useState(false) 

    useEffect(() => {
        API.getUserResults()
            .then(list => {
                setResults(list)
                setResultsChanged(true)
            })
            .catch(err => handleError(err))
    }, [])

    useEffect(() => {
        if (resultsChanged) {
            setAccordionItems(createAccordionItems())
            setResultsChanged(false)
        }
    }, [results, resultsChanged])

    function handleError(err) {
        //TODO handle errors
        console.log(err)
    }

    const createAccordionItems = () => {
        const ret = [];
        results.forEach((result, index) => {
            ret.push(
                <Accordion.Item eventKey={index} key={index} className='margin-top margin-bottom-row'>
                    <Accordion.Header>
                        <Container fluid>
                            <Row>
                                <Col lg='auto' className='p-0'>
                                    {(result.position != 0) ? //if position is 0 lab is active
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                        </svg>
                                    }
                                </Col>
                                <Col lg={1} className='center-vertically-row'>
                                    <h6>{result.labName}</h6>
                                </Col>
                                
                            </Row>
                        </Container>

                    </Accordion.Header>
                    {
                        (result.position != 0) ?
                            <Accordion.Body>
                                <h6> Obtained points: {result.points} </h6>
                                <h6> Position in leaderboard: {result.position} </h6>
                            </Accordion.Body>
                            :
                            ''
                    }
                </Accordion.Item>
            )
        })
        return ret;
    }

    //alphabetical order if true. reverse if false
    const sortResultsByOrderAscending = (results, isOrderAscending) => {
        const sortBy = (field) => {
            return function (a, b) {
                return (a[field] > b[field]) - (a[field] < b[field])
            };
        }
        isOrderAscending ?
            results.sort(sortBy('labName'))
            :
            results.reverse(sortBy('labName'))
        console.log(results)
        setResultsChanged(true);
    }

    return (
        <Container fluid>
            <Row>
                <Col lg={11}>
                    <Accordion flush>
                        {accordionItems}
                    </Accordion>
                </Col>
                <Col lg={1}>
                    <DropdownButton id="dropdown-basic-button" title="Sort by">
                        <Dropdown.Item onClick={() => sortResultsByOrderAscending(results, true)}>Name (ascending)</Dropdown.Item>
                        <Dropdown.Item onClick={() => sortResultsByOrderAscending(results, false)}>Name (descending)</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>

        </Container>
    )
}

export default ProfileSectionResults;
import { ListGroup } from 'react-bootstrap';

function ProfileNavigation(props) {

    return (
        <ListGroup variant='flush'>
            <ListGroup.Item
                onClick={() => props.changeSection(props.Sections.Results)}
                type='button'
                className='list-group-item list-group-item-action'
                action
            >
                Results
            </ListGroup.Item>
            <ListGroup.Item
                onClick={() => props.changeSection(props.Sections.Avatars)}
                type='button'
                className='list-group-item list-group-item-action'
                action
            >
                Avatars
            </ListGroup.Item>
            <ListGroup.Item onClick={() => props.changeSection(props.Sections.Achievements)}
                type='button'
                className='list-group-item list-group-item-action'
                action
            >
                Achievements
            </ListGroup.Item>
        </ListGroup>
    )

}

export default ProfileNavigation;
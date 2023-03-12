import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileNavigation from './ProfileNavigation';
import ProfileSectionResults from './ProfileSectionResults';
import ProfileSectionAvatars from './ProfileSectionAvatars';
import ProfileSectionAchievements from './ProfileSectionAchievements';

function Profile() {

    /* enum */

    const Sections = {
        Results: 0,
        Avatars: 1,
        Achievements: 2
    }


    /* const */

    const leftColDimension = 2;
    const rightColDimension = 10; //12-2

    /* useState */

    const [section, setSection] = useState(Sections.Results);
    const [dirtyPropic,setDirtyPropic] = useState(true);

    /* functions */

    const changeSection = (s) => {
        setSection(s)
    }

    const changeDirtyPropic = (boolean) => {
        setDirtyPropic(boolean)
    }

    const selectProfileSectionComponent = () => {
        switch (section) {
            case Sections.Labs: return <ProfileSectionResults />
            case Sections.Avatars: return <ProfileSectionAvatars changeDirtyPropic={changeDirtyPropic}/>
            case Sections.Achievements: return <ProfileSectionAchievements />
            default: return <ProfileSectionResults />
        }
    }

    return (
        <Container fluid>
            <Row>
                <ProfileHeader
                    leftColDimension={leftColDimension}
                    rightColDimension={rightColDimension}
                    dirtyPropic={dirtyPropic}
                    changeDirtyPropic={changeDirtyPropic}
                />
            </Row>
            <Row>
                <Col lg={leftColDimension}>
                    <ProfileNavigation changeSection={changeSection} Sections={Sections} />
                </Col>
                <Col lg={rightColDimension}>
                    {selectProfileSectionComponent()}
                </Col>
            </Row>
        </Container>
    );

}

export default Profile;
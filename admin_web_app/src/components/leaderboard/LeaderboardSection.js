import { useEffect, useState } from "react";
import Leaderboard from "../common/Leaderboard";
import API from "../../API";

function LeaderboardSection(){

    const [resultList,setResultList] = useState([]);

    useEffect(() => {
        API.getGlobalLeaderboard()
        .then(list => setResultList(list))
        .catch(err => handleError(err));
    },[]);

    function handleError(err){
        //TODO handle errors correctly
        console.log(err)
    }

return(
    <Leaderboard resultList={resultList}/>
)

}

export default LeaderboardSection;
import {useParams} from "react-router-dom";

function Checkin(){
    let params = useParams();
    return(<>
        <h1>Checkin Page</h1>
        <h1>SlotId: {params.slotId}</h1>;
    </>)
}
export default Checkin
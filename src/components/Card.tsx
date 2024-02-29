import res from "../types";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography } from "@mui/material";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';


type CardType = {
    id: number,
    props: res,
    Modelopen: (i:number) => void 
}

const Card: React.FC<CardType> = ({props,id,Modelopen}) => {
    return (
        <Box className="card">
            <Box className="card_header">
                <img className="card_image" src={props.picture.thumbnail} alt="Profile picture" />
                <Box>{`${props.name.title} ${props.name.first} ${props.name.last}`}</Box>
                <Divider><Box style={{fontSize:'small'}}>{props.email}</Box></Divider>
                <button onClick={() => Modelopen(id)}><HighlightOffOutlinedIcon/></button>

            </Box>
            <Box className="card_info">
            <Typography variant="body2">
                Gender: {props.gender} <br/>
                Age: {props.dob.age} <br/>
                Address:
                    {
                        ` ${props.location.street.number} ${props.location.street.name} ,
                    ${props.location.city} , ${props.location.state} , ${props.location.country}   `
                    } <br/>
            </Typography>        
            </Box>
        </Box>
    );
}

export default Card;
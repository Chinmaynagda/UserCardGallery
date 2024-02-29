import { useState } from "react";
import res from "../types";
import { InputLabel, Input, Radio } from '@mui/material';
import axios from "axios";


//types----------------------------------------
type FormType = {
    getUser: (usr: res) => void
    setOpen: (bool: boolean) => void
}

type Address = {
    Name: string,
    Description: null,
    BranchType: string,
    DeliveryStatus: string,
    Circle: string,
    District: string,
    Division: string,
    Region: string,
    Block: string,
    State: string,
    Country: string,
    Pincode: string
};

type postRes =
    {
        Message: string,
        Status: string,
        PostOffice: Array<Address>
    }

type myloc = {
    city: string,
    state: string,
    country: string
}
//---------------------------------------------------------------------------------


// initial state of the variable that stores the Data from the api
let obj: Array<postRes> = [{
    Message: "",
    Status: "",
    PostOffice: [
        {
            Name: '',
            Description: null,
            BranchType: '',
            DeliveryStatus: '',
            Circle: '',
            District: '',
            Division: '',
            Region: ' ',
            Block: '',
            State: '',
            Country: '',
            Pincode: ''
        }

    ]
}]
//---------------------------------------------------------------------------------------------

//initial state of data( child to parent )
let temp: res = {
    gender: "",
    name: {
        title: "",
        first: "",
        last: ""
    },
    location: {
        street: {
            number: 0,
            name: ""
        },
        city: "",
        state: "",
        country: "",
    },
    email: "",
    dob: {
        date: "",
        age: 0
    },
    picture: {
        thumbnail: "https://picsum.photos/id/1/200/300",
    }
}
//----------------------------------------------------------------------------------------------

//function returns a form Component---------------------------------------------------------

const Form: React.FC<FormType> = ({ getUser, setOpen }) => {

    // const [childData, setChildData] = useState<res>(temp); //data to send
    const [loc, setLoc] = useState<myloc>({ city: '', state: '', country: '' });  //data to display in input field

    //function that fetches the API and returns a object (is being called inside handleChange when pin's length = 6)
    async function getAddress(str: string) {
        try {
            await axios.get(`https://api.postalpincode.in/pincode/${str}`).then((response) => obj = response.data);
        } catch (e) {
            console.log("Error encountered while fetching data: ", e, str);
        }
        return obj;
    }
    //----------------------------------------------------------------------------------------------------------------   

    //function gets called on onChange in input field
    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let prop = e.target.name;
        switch (prop) {
            case 'title': { temp.name.title = e.target.value; break }
            case 'first': { temp.name.first = e.target.value; break }
            case 'last': { temp.name.last = e.target.value; break }
            case 'gender': { temp.gender = e.target.id; break }
            case 'email': { temp.email = e.target.value; break }
            case 'dob': {
                temp.dob.date = e.target.value;
                const current = new Date();
                const dob = new Date(e.target.value);
                if (dob.getMonth() >= current.getMonth()) {
                    temp.dob.age = current.getFullYear() - dob.getFullYear();
                } else {
                    temp.dob.age = current.getFullYear() - dob.getFullYear() - 1;
                }
                break
            }

            case 'pin': {
                if (e.target.value.length === 6) {
                    const myobj = await getAddress(e.target.value);
                    // location................................................................                   
                    if (myobj[0].PostOffice !== null) {
                        temp.location.city = myobj[0].PostOffice[0].District;
                        temp.location.state = myobj[0].PostOffice[0].State;
                        temp.location.country = myobj[0].PostOffice[0].Country;
                        setLoc({ city: myobj[0].PostOffice[0].District, state: myobj[0].PostOffice[0].State, country: myobj[0].PostOffice[0].Country });
                        console.log(temp);
                    }
                }else{
                    setLoc({ city: '', state: '', country:'' });
                }
                break;
            }

            // case 'city': {
            //     console.log('Handle Change called') ;
            //     temp.location.city = e.target.value; 
            //     break; }
            // case 'state': { temp.location.state = e.target.value; break; }
            // case 'country': { temp.location.country = e.target.value; break; }
            case 'number': { temp.location.street.number = parseInt(e.target.value); break }
            case 'name': { temp.location.street.name = e.target.value; break }
            case 'picture': { temp.picture.thumbnail = e.target.value; break }
        }

    }

    //called when onSubmit
    const saveData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setChildData(temp);
        getUser(temp);
        setLoc({ city: '', state: '', country: '' });
        setOpen(false);

    }

    return (
        <>
            <form onSubmit={saveData}>
                <InputLabel>Title</InputLabel>
                <Input type="text" id="title" name="title" onChange={handleChange} />
                <InputLabel>First Name</InputLabel>
                <Input type="text" id="fname" name="first" onChange={handleChange} />
                <InputLabel>Last Name</InputLabel>
                <Input type="text" id="lname" name="last" onChange={handleChange} />

                <InputLabel>Email</InputLabel>
                <Input type="email" id="email" name="email" onChange={handleChange} />
                <InputLabel>Gender</InputLabel>
                <div className="gender">
                    <InputLabel>Male</InputLabel>
                    <Input type="radio" id="male" name="gender" onChange={handleChange} />
                    <InputLabel>Female</InputLabel>
                    <Input type="radio" name="gender" onChange={handleChange} />
                </div>

                <InputLabel>Date of Birth</InputLabel>
                <Input type="date" id="date" name="dob" onChange={handleChange} />
                <InputLabel>Pincode</InputLabel>
                <Input type="number" id="pin" name="pin" onChange={handleChange} />
                <InputLabel>Street No.</InputLabel>
                <Input type="text" id="stno" name="number" onChange={handleChange} />
                <InputLabel>Street Name</InputLabel>
                <Input type="text" id="stnm" name="name" onChange={handleChange} />
                <InputLabel>City</InputLabel>
                <Input type="text" id="city" name="city" readOnly={true} value={loc.city} />
                <InputLabel>State</InputLabel>
                <Input type="text" id="state" name="state" readOnly={true} value={loc.state} />
                <InputLabel>Country</InputLabel>
                <Input type="text" id="country" name="country" readOnly={true} value={loc.country} />
                <InputLabel>Picture</InputLabel>
                <Input type="text" id="picture" name="picture" onChange={handleChange} />
                <Input type="submit" />
            </form>
        </>
    );
}

export default Form;
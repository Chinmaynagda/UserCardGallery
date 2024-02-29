import React, { useState } from 'react';
import './App.css';
import res from './types';
import axios from 'axios';
import Card from './components/Card';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Form from './components/Form';
import { Button,FormGroup,Icon, Tooltip, Typography } from '@mui/material';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { FormControl ,InputLabel, Input} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const loading = (a: boolean) => {
  if (a) return <Typography variant='h5'>Your data is loading...</Typography>
}
function App() {
  const [arr, setArr] = useState<Array<res>>([]);
  const [isDisabled,setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [d_id,setD_id] = useState(-1);
  const [drawer,setDrawer] = useState(false);
  const [min,setMin] = useState(0);
  const [max, setMax] = useState(1000);
  const [gender,setGender] = useState(['male','female']);

  async function getData() {
    setIsLoading(true);
    try {
      await axios.get("https://randomuser.me/api/?results=50").then((response) => setArr(response.data.results));
    } catch (e) {
      console.log("Can't Fetch Data: ", e);
    }
    setIsLoading(false);
    setIsDisabled(true);
    
  }
  function handleAge(e:React.ChangeEvent<HTMLInputElement>) {
    if(e.target.name === 'min')
    {
      console.log('inside min')
      setMin(parseInt(e.target.value));
    }else{
      setMax(parseInt(e.target.value));
      // console.log(max)
    }
  }
  function handleGender(e:SelectChangeEvent) {
     if(e.target.value === 'male'){
      setGender(['male']);
     }else if(e.target.value === 'female') {
      setGender(['female']);
     }else {
      setGender(['male','female']);
     }
  }

  function delData(){
    setArr([]);
    setIsDisabled(false);
  }
      
  const filterfunc = (item:res)=>{
         if(item.dob.age>=min && item.dob.age<=max &&  gender.includes(item.gender))
          return true;
          else 
          return false;
  }
  const filterAll = () => {
    console.log(`Min: ${min} and Max: ${max} and Gender: ${gender}`);
    setArr(arr.filter((item)=>filterfunc(item)));
  }


  const delusr = () =>{
    if(d_id!==-1) setArr(arr.filter((item,idx)=>idx!==d_id)); 
    setDel(false);
   }
  

  const Modelopen = (i:number) =>{
    setD_id(i);
    setDel(true);
  }
   const handleUser = (usr:res) =>{
    setArr([usr,...arr]);
   }

  return (
    <div >
      <div className='main_bar'> 
      <Typography variant='h4'>Sample Profiles</Typography>
      <div className='main_btn'>
      <Button className='btn'  disabled={isDisabled} onClick={getData}> Get Profile </Button>
      <Tooltip title='Filter'><Button className='btn'  onClick={()=>setDrawer(true)}> <Icon fontSize='small'><FilterListIcon/></Icon> </Button></Tooltip>
      <SwipeableDrawer
            anchor='right'
            open={drawer}
            onClose={() => {
              setDrawer(false);
              setMin(0);
              setMax(1000);
              setGender(['male','female']);
            }
            }
            onOpen={() =>setDrawer(true)}
          >
            <Typography variant='h5' align='center' m={2} fontStyle='italic' fontWeight='bold'> Filters </Typography>
            <Box  
              my={2}
              mx={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={4}
              p={4}
              sx={{ border: '2px solid grey' }} >
              {/* 
              <Checkbox name='checkA' aria-label='Male'/>
              <Checkbox name='checkB' aria-label='Female'/>

              <Button onClick={() => setArr(arr.filter((item) => item.gender === 'male' ))}>  </Button>
              <Button onClick={() => setArr(arr.filter((item) => item.gender === 'female' ))}> Female </Button>
              <InputLabel>Min</InputLabel>
                <Input type="number" id="min" name="min" onChange={handleAge} />
              <InputLabel>Max</InputLabel>
                <Input type="number" id="max" name="max" onChange={handleAge} />
              <Button onClick={filterAge}> Filter Age</Button> */}
                <InputLabel>Minimun Age</InputLabel>
                <Input type='number' name='min' onChange={handleAge}/>
                <InputLabel>Maximun Age</InputLabel>
                <Input type='number' name='max' onChange={handleAge}/>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
        <Select
          label="Gender"
          value={gender.toString()}
          onChange={handleGender}
        >
          <MenuItem value='both'> Both</MenuItem>
          <MenuItem value='male'>Male</MenuItem>
          <MenuItem value='female'>Female</MenuItem>
        </Select>

                <Button onClick={filterAll}>Filter</Button>
  
            </Box>
      </SwipeableDrawer>
      <Tooltip title='Delete All'><Button className='btn'  onClick={delData}> <Icon fontSize='small'><DeleteIcon/></Icon> </Button></Tooltip>
      </div>
      </div>
      
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
         <Form getUser={handleUser} setOpen ={setOpen}/>
        </Box>
      </Modal>

      <Modal
        open={del}
        onClose={() => setDel(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
         <h3> Do you Want to delete this Profile</h3>
         <button onClick={()=>delusr()}>Confirm</button>
         <button onClick={() => setDel(false)}>Cancel</button>
         
        </Box>
      </Modal>

      {loading(isLoading)}
      <div className='grid'>
      {arr.map((item,index) =>{
       return  <Card props = {item} id={index} Modelopen={Modelopen} key={index}/>
      })}
      </div>
      <Tooltip title='Add Profile'><button className='btn1' onClick={() => setOpen(true)}> <Icon fontSize='large'><AddIcon/></Icon> </button></Tooltip> 
      <Tooltip title='Reset'><button className='btn2' onClick={getData}> <Icon fontSize='large'><RestartAltOutlinedIcon/></Icon> </button></Tooltip> 
    </div>
  );
}

export default App;
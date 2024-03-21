import {useEffect,useState} from 'react'
import { Form, useParams } from "react-router-dom";
import axios from '../../helpers/axios'
import {Container,Card,Typography,Box,Button,Dialog,DialogActions,
    DialogContent,DialogContentText,TextField, Modal
} from '@mui/material'
import { FaFolder } from "react-icons/fa6";
import AllImagesContainer from './all-images-container/all-images-container';
import toast from 'react-hot-toast';

const ImageCategory = ({setCategroyId,setOpenImagesCorousalModal,setSelectedImage}) => {
    const [data,setData] = useState([])
    const [imagesData,setImagesData] = useState([])
    const [isOpenToCrate,setIsOpenToCreate] = useState(false)
    const [newCollectionName,setNewCollectionName] = useState('')
    const {eventId } = useParams();
    const [pageNo, setPageNo] = useState(1);

    const token = localStorage.getItem("token");

    const getData = async ()=>{
        try {
          const resp = await axios.get(`/get-all-collections/${eventId}`,
          {
            headers: {
              authorization: token,
            },
          }
          );
          console.log("data", resp.data.arr
          );
          setData(resp.data.arr);
        } catch (error) {
          console.error("Error fetching event details:", error);
        }
      }

   useEffect(()=>{
    getData()
   },[])   

   const addIMageCategory = async (e) => {
    e.preventDefault()
    await axios
      .post(
        `/add-images`,
       {
        name:newCollectionName,
        imagesArray: [],
        eventId,
       },
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        if(res.status===200){
            getData()
            setIsOpenToCreate(false)
            setNewCollectionName('')
            toast.success('Successfully Save Image Category')
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

   console.log(imagesData)
  return (
    <Container sx={{display:imagesData.length?'':'grid',gridAutoRows:`${imagesData.length?'':'60px'}`,gap:'2px',background:'#e9e9e9',padding:'20px',borderRadius:'15px',
     gridTemplateColumns:`${imagesData.length?'1fr 1fr 1fr 1fr':'1fr'}`
    }}>
        
      <Dialog
        open={isOpenToCrate}
        onClose={()=>{setIsOpenToCreate(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{padding:'10px'}}
      >
        <form onSubmit={addIMageCategory}>
        <DialogContent sx={{
            width:'500px'
            
        }}>
          <DialogContentText id="alert-dialog-description">
           <TextField required type='text' sx={{width:'100%'}} label={'Enter Collection Name'}
           value={newCollectionName}
           onChange={(e)=>setNewCollectionName(e.target.value)}
           />
          </DialogContentText>
        </DialogContent>
        <DialogActions          sx={{padding:'10px 20px'}}
>
        <Button variant='contained' type='submit' >Add</Button>
          <Button onClick={()=>{setIsOpenToCreate(false)}} color={'error'} variant='outlined'>Close</Button>
    
        </DialogActions>
        </form>
      </Dialog>

           {!imagesData&&<Box  >
              <Button sx={{marginLeft:'auto',display:'block'}} variant='contained'
              onClick={()=>{setIsOpenToCreate(true)}}
              >+ Craete New Collection</Button> 
           </Box>}
    
        {
            imagesData.length?
           <>
           <Button variant='contained' onClick={()=>setImagesData([])}>Go Back</Button>
           {<AllImagesContainer
         eventData={imagesData[0]==='Not Found'?[]:imagesData}
           setCategroyId={setCategroyId}
           setSelectedImage={setSelectedImage}
           setOpenImagesCorousalModal={setOpenImagesCorousalModal}
           
           />}
            </>
          
            :data.map((el,i)=>
              <Card onClick={()=>{
                setImagesData(el.imageArr?.[0]?[...el.imageArr]:['Not Found'])
                setCategroyId(el._id)
                }} key={i} style={{marginTop:'5px',display:'flex',alignItems:'center',padding:'0px 10px',cursor:'pointer'}}>
                <FaFolder style={{marginRight:'15px'}}/>
                <Typography sx={{fontWeight:'500',fontSize:'15px'}} >{el.name}</Typography> 
                </Card>
            )
        }
      

 

    </Container>
  )
}

export default ImageCategory

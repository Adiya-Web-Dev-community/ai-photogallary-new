import Button from '@mui/material/Button';

import { Slider, Typography,Box, Card, Input } from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import { convertImageToBase64 } from '../../function/function';
import { IoMdArrowDropup } from "react-icons/io";
import { GoDotFill } from "react-icons/go";

export default function WaterMarkController({watermarkInfo,steWaterMarkInfo}) {

    const [buttonPosition, setButtonPosition] = useState({ x: watermarkInfo.x||0, y: watermarkInfo.y||0 });
    const [elemntSize,setElementSize] = useState({
        width:20,
    })
    const [imageUrl,setImageUrl] = useState(watermarkInfo.imgUrl)
    const [moved, setMoved] = useState(true);
    const inputRef = useRef(null)

    
  const handleMouseMove = (e) => {
    if (moved &&e.target.id==='parent') {
      const parentRect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - parentRect.left  ;
      const offsetY = e.clientY - parentRect.top ;
      const offsetXPercentage = (offsetX / parentRect.width) * 100;
      const offsetYPercentage = (offsetY / parentRect.height) * 100;
      setButtonPosition({ x: offsetXPercentage, y: offsetYPercentage });
    }
  };

//     const handleMouseMove = (e) => {
//         if(e.target.id!=='parent'){
//                return
//         }
//         // // console.log(e)
//         // // setButtonPosition({ x: e.clientX, y: e.clientY });

//         const parentRect = e.currentTarget.getBoundingClientRect();
//         // const offsetX = e.clientX - parentRect.left;
//         // const offsetY = e.clientY - parentRect.top;
//         // setButtonPosition({ x: offsetX, y:  offsetY -70});

//         const offsetX = e.clientX - parentRect.left  ;
// const offsetY = e.clientY - parentRect.top ;
// const offsetXPercentage = (offsetX / parentRect.width) * 100;
// const offsetYPercentage = (offsetY / parentRect.height) * 100;
// setButtonPosition({ x: offsetXPercentage, y: offsetYPercentage });
//       };

      console.log( buttonPosition.x,buttonPosition.y)
useEffect(()=>{
    steWaterMarkInfo(prev=>({...prev,
        x:buttonPosition.x,
        y:buttonPosition.y,
        size:elemntSize.width,
        imgUrl:imageUrl
    }))
},[buttonPosition.x,buttonPosition.y,
    elemntSize.width,imageUrl])



const handaleChange = (e)=>{
    convertImageToBase64(e.target.files[0],setImageUrl)
}


const handalePosition = (name,value)=>{
  const obj = {
    top:{bottom:'auto'},
    left:{right:'auto'},
    bottom:{top:'auto'},
    right:{left:'auto'},
  }
  console.log(obj[name])
  steWaterMarkInfo(prev=>({...prev,[name]:value,...obj[name]}))
}

    

console.log(watermarkInfo)

  return ( <div style={
            {
            display:'flex',
            justifyContent:'space-between',
            alignItems:'end',
            padding:'4px',

        }
          }>
            <div style={{ background: `url(${'https://cdn.firstcry.com/education/2022/04/29104308/555551179.jpg'})`,
            height:'100%',width:'600px',position:'relative',overflow:'hidden',
        }}>
                 <img
                 style={{
                    left:`${watermarkInfo?.isManually?buttonPosition.x+"%":watermarkInfo?.left}`,
                    top:`${watermarkInfo?.isManually?buttonPosition.y+"%":watermarkInfo?.top}`,
                    right:`${watermarkInfo?.isManually?'auto':watermarkInfo?.right}`,
                    bottom:`${watermarkInfo?.isManually?'auto':watermarkInfo?.bottom}`,
                    position:'absolute',
                    width:`${elemntSize.width}%`,
                    transform:watermarkInfo?.isManually?`translate(-50%, -50%)`:`translate(0%,0%)` ,
                    transition: 'top 0.2s, left 0.2s'
                 }}
                 src={imageUrl}
                 />
                  
            </div>
            <Card sx={{height:'100%',padding:'15px',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            flexDirection:'column',
            width:'300px'
        }}>
            <div style={{ width: '100%' }}>

            <Typography id="range-slider" gutterBottom>
        Watermark Size
        <span style={{color:'blue',margin:'0px 4px'}}>{Math.round(elemntSize.width) +""}%</span>
        
             
      </Typography>

      <Slider
        aria-labelledby="range-slider"
        valueLabelDisplay="auto"
        min={0}
        max={100}
        sx={{width:'100%'}}
        value={elemntSize.width}
        onChange={(e)=>setElementSize(prev=>({...prev,width:e.target.value}))}
      />
        
    </div>
  
           

            

<div style={{height:'200px',width:'100%',overflow:'hidden'}}>
      <div style={{height:'200px',width:'200%',display:'grid',
          gridTemplateColumns:'50% 50%',position:'relative',
          left:`${watermarkInfo?.isManually?'-100%':'0%'}`,
          transition: 'left 0.5s ease-in-out' ,
          placeContent:'center'
      }}>


<div style={{
   display:'flex',
   alignItems:'center',
   justifyContent:'space-between',
   flexDirection:'column',
}}>
<div style={{display:'grid',
gridTemplateColumns:`1fr 1fr 1fr`,
gridTemplateRows:`1fr 1fr 1fr`,
width:'150px',height:'150px',
cursor:'pointer',
}}
>
<Box onClick={()=>{handalePosition('top',0)}} sx={{background:'black',gridArea:'1/2/2/3',borderRadius:'5px 5px 0px 0px',display:'grid',placeContent:'center'}}>
  <IoMdArrowDropup size='25px' style={{
  color:'white',
}}/>
</Box>
   <Box sx={{background:'black',gridArea:'2/2/3/3',display:'grid',placeContent:'center'}}>
    <GoDotFill size='50px' style={{color:'white'}} />
   </Box>
  <Box onClick={()=>{handalePosition('left',0)}} sx={{background:'black',gridArea:'2/1/3/2',borderRadius:'5px 0px 0px 5px',display:'grid',placeContent:'center'}}>
  <IoMdArrowDropup size='25px' style={{
  color:'white',
  transform:'rotate(-90deg)'

}}/>
  </Box>
  <Box onClick={()=>{handalePosition('right',0)}} sx={{background:'black',gridArea:'2/3/3/4',borderRadius:'0px 5px 5px 0px',display:'grid',placeContent:'center'}}>
  <IoMdArrowDropup size='25px' style={{
  color:'white',
  transform:'rotate(90deg)'

}}/>
  </Box>
  <Box onClick={()=>{handalePosition('bottom',0)}} sx={{background:'black',gridArea:'3/2/4/3',borderRadius:'0px 0px 5px 5px',display:'grid',placeContent:'center'}}>
  <IoMdArrowDropup size='25px' style={{
  color:'white',
  transform:'rotate(180deg)'

}}/>  
  </Box>   
  
   
</div>
<Button variant='contained' onClick={()=>steWaterMarkInfo(prev=>({...prev,isManually:true}))}>Set Menually </Button>
</div>


<div
style={{
  display:'flex',
  alignItems:'center',
  justifyContent:'space-between',
  flexDirection:'column',
}}
>
<p style={{display:'flex'}}>
<sapn style={{width:'50px'}}><b>Y</b> {Math.round(buttonPosition.y)}</sapn>
<span style={{width:'50px'}}><b>X </b>{Math.round(buttonPosition.x)}</span>
</p>
<div onMouseMove={handleMouseMove}     onClick={()=>setMoved(prev=>!prev)}
 id='parent' style={{background:'black',
  padding:'8px',display:'flex',alignItems:'center', height:'100px',width:'100px',
        position:'relative',
  top:'0px', border:'10px solid black',
  borderRadius:'10px',
  cursor:'pointer',
  boxSizing:'content-box',
  justifyContent:'space-between'

 
//   clipPath: `polygon(0% 40%,30% 40%,30% 0%, 40% 0%,50% 40%, 100% 40% ,100% 50%, 50% 50%,
//       50% 100% , 40% 100% , 30% 50%, 0% 60%
//     )`
// clipPath:`polygon(0% 40%, 40% 40%, 40% 0%, 60% 0%, 60% 40%, 100% 40%,
//      100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%)`


}}
>


     <button style={{height:'20px',width:'20px',borderRadius:'100px',
     background:`${moved?'blue':'white'}`,
      left:`${buttonPosition.x}%`,
      top:`${buttonPosition.y}%`,
      position:'absolute',
      transform:`translate(-5px, -5px)`,
    //   transition: 'top 0.1s, left 0.1s', 
    }}
    >

     </button>

</div> 

 <Button variant='contained' style={{marginTop:'10px'}}
onClick={()=>{
    setButtonPosition({x:50,y:50})
    setElementSize({width:100})
    setMoved(false)
}}
>FULL SCREEN</Button>
</div>


</div>
</div>





             <input type='file' onChange={handaleChange} accept='.png' hidden ref={inputRef}/>
            <Button variant='contained' onClick={()=>inputRef.current.click()}>Upload Water Mark IMAGE</Button>

           <div>
           <Button
               variant='contained'
               onClick={()=>{
                steWaterMarkInfo(prev=>({...prev,isActiveWaterMark:true}))
               }}
              style={{  
                marginRight:'10px'              
              }}>Save</Button>
  
            <Button
               variant='outlined'
               onClick={()=>{
                steWaterMarkInfo(prev=>({...prev,skip:true}))
               }}
              style={{                
              }}>Skip</Button>
           </div>
            </Card>

        </div>
  );
}



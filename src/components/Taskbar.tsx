import  React, { useState, useEffect } from 'react';
import './App.css'

interface Window{
    id:number;
    name:string;
    icon: string;
}

interface TaskbarProps{
    windows:Window[];
    onSelectWindow: (id:number)=> void;
    activeWindowId:number;
    toggleStartMenu:()=>void;
}

const Taskbar: React.FC<TaskbarProps> = ({windows, onSelectWindow, activeWindowId, toggleStartMenu}) =>{
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
      return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    

    return (
        <div className="win95-border bottomBar" style={{display:'flex', height:'4vh'}}>
            <div onClick={toggleStartMenu} className="win95-border win95-button" style={{display:'flex', margin:'auto', marginLeft:'5px', marginTop:'0.12vh', marginBottom:'0.1vh', width:'15vh'}}>
                <span style={{padding:'1px', display:'flex', alignItems:'center'}}><img src="../../assets/Starticon.png" style={{height:'3vh', marginRight:'8px', paddingLeft:'4px'}}/><span><strong>Start</strong></span></span>
            </div>
            <div style={{width:'100%', display:'flex', flexDirection:'row', overflow:'hidden', alignItems:'center'}}>
                {windows.map((window)=>(
                    <div key={window.id} onClick={()=>onSelectWindow(window.id)} className={`win95-border win95-button taskbar-tab ${window.id===activeWindowId?'active':''}`} style={{display:'flex', flex:1, alignItems:'left', height:'3.2vh', margin:'2px',  maxWidth:'20%', minWidth:'0vh', overflow:'hidden', whiteSpace:'nowrap'}}>
                        <span style={{display:'flex', alignItems:'center', marginRight:'auto'}}><img src={window.icon} style={{height:"32px", marginLeft:'-4px'}}/><span style={{textOverflow:'ellipsis', paddingRight:'16px', fontSize:'14px', marginLeft:'-4px'}}>{window.name}</span></span>
                    </div>
                ))}
            </div>
           
          
    
            <div className="win95-inset" style={{marginTop:"0.1vh", marginBottom:'0.1vh', width:'14vh', display: 'flex', alignItems:'center'}}>
                <div className="time text-center" style={{display:'flex', alignContent:'center'}}>
                    <span style={{fontSize:'14px'}} className="time text-uppercase">{formatTime(time)}</span>
                </div>
            </div>  
            
        
      </div>
      );
}

export default Taskbar;
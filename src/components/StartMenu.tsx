import React from 'react';
import './StartMenu.css';

interface StartMenuProps {
  isOpen:boolean;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen }) => {
  return (
    <div className={`win95-border start-menu ${isOpen ? 'open' : 'closed'}`}>
    <div className="start-menu-sidebar">
      <span className="sidebar-text">Windows 95</span>
    </div>
    <div className="start-menu-content">
      <ul>
        <li><span style={{display:'flex', alignItems:'center', marginRight:'auto'}}><img src="../../assets/Programs.ico" style={{height:"32px", marginLeft:'0px'}}/><span style={{textOverflow:'ellipsis', paddingRight:'0px', fontSize:'12px', marginLeft:'8px'}}>Programs</span></span></li>
        <li><span style={{display:'flex', alignItems:'center', marginRight:'auto'}}><img src="../../assets/Documents.ico" style={{height:"32px", marginLeft:'0px'}}/><span style={{textOverflow:'ellipsis', paddingRight:'0px', fontSize:'12px', marginLeft:'8px'}}>Documents</span></span></li>
        <li><span style={{display:'flex', alignItems:'center', marginRight:'auto'}}><img src="../../assets/Settings.ico" style={{height:"32px", marginLeft:'0px'}}/><span style={{textOverflow:'ellipsis', paddingRight:'0px', fontSize:'12px', marginLeft:'8px'}}>Settings</span></span></li>
        <li><span style={{display:'flex', alignItems:'center', marginRight:'auto'}}><img src="../../assets/Search.ico" style={{height:"32px", marginLeft:'0px'}}/><span style={{textOverflow:'ellipsis', paddingRight:'0px', fontSize:'12px', marginLeft:'8px'}}>Find</span></span></li>
        <li><span style={{display:'flex', alignItems:'center', marginRight:'auto'}}><img src="../../assets/Help.ico" style={{height:"32px", marginLeft:'0px'}}/><span style={{textOverflow:'ellipsis', paddingRight:'0px', fontSize:'12px', marginLeft:'8px'}}>Help</span></span></li>
        <li><span style={{display:'flex', alignItems:'center', marginRight:'auto'}}><img src="../../assets/Run.ico" style={{height:"32px", marginLeft:'0px'}}/><span style={{textOverflow:'ellipsis', paddingRight:'0px', fontSize:'12px', marginLeft:'8px'}}>Run...</span></span></li>
        <li><span style={{display:'flex', alignItems:'center', marginRight:'auto'}}><img src="../../assets/Shutdown.ico" style={{height:"32px", marginLeft:'0px'}}/><span style={{textOverflow:'ellipsis', paddingRight:'0px', fontSize:'12px', marginLeft:'8px'}}>Shut Down</span></span></li>
      </ul>
    </div>
  </div>
  );
};

export default StartMenu;
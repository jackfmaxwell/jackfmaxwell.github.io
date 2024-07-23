import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import Taskbar from "./Taskbar";
import ApplicationIcon from "./ApplicationIcon";
import StartMenu from "./StartMenu";
import ApplicationWindow from "./ApplicationWindow";

interface WindowProperties {
  id: number;
  name: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isActive: boolean;
  minimized: boolean;
}

const App: React.FC = () => {
  const [applications, setApplications] =  useState([
    {id:3, name:'Rad Planet', imgSrc:"../../assets/Internet.png", position:{x:600, y:0}},
    {id:4, name:'The Math Guru', imgSrc:"../../assets/Internet.png", position:{x:75, y:450}},
    {id:5, name:'Alpha Coding', imgSrc:"../../assets/Internet.png", position:{x:75, y:375}},
    {id:6, name:'Drone Game', imgSrc:"../../assets/Internet.png", position:{x:450, y:225}},
    {id:7, name:'GTA Mods', imgSrc:"../../assets/Internet.png", position:{x:525, y:225}},
    {id:8, name:'Dungeon RPG Game', imgSrc:"../../assets/Internet.png", position:{x:450, y:300}},
  ]);
  const [dragging, setDragging] = useState<{ id: number | null, offsetX: number, offsetY: number } | null>(null);
  const draggingRef = useRef<{ id: number | null, offsetX: number, offsetY: number } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const gridSize = 75; // Define the size of the grid to snap to

  const handleToggleStartMenu  = () => {
    setIsStartMenuOpen(prevState=>!prevState)
  };

  const [windows, setWindows] = useState<WindowProperties[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<number>(0);
  const handleDoubleClick = useCallback((appName:string, appIcon:string) => {
    const windowsWithSameApp = windows.filter(window => window.name === appName); // Find last window
    const lastSameAppWindow = windowsWithSameApp.length > 0 ? windowsWithSameApp[windowsWithSameApp.length - 1] : null;
    let newPos  = {
      x:50,
      y:50
    }
    if(lastSameAppWindow){
      newPos.x=lastSameAppWindow.position.x + 20;
      newPos.y= lastSameAppWindow.position.y + 20;
    }
   
    
    const newWindow:WindowProperties = {
        id:Date.now(),
        name:appName,
        icon:appIcon,
        position:newPos,
        size:{width:400,height:300},
        isActive:false,
        minimized:false,
    };
    setActiveWindowId(newWindow.id); // Set the new window as active
    setWindows((prevWindows)=>[...prevWindows, newWindow])
  }, [windows, setWindows]);

  const closeWindow = useCallback((id:number) =>{
    setActiveWindowId(0); // Clear the active window if it is closed
    setWindows((prevWindows)=>prevWindows.filter(window=>window.id!==id));
  }, []);

  const maximizeWindow = (id:number) => {
    const desktopElement = desktopRef.current;
    if (!desktopElement) return;

    // Get desktop bounds
    const desktopRect = desktopElement.getBoundingClientRect();
    const desktopBounds = {
      left: desktopRect.left,
      top: desktopRect.top,
      right: desktopRect.right-75,
      bottom: desktopRect.bottom-150,
    };
    setWindows(prevWindows =>
      prevWindows.map(window =>
        window.id === id
          ? { ...window, size: { width: desktopBounds.right+45, height: desktopBounds.bottom+85}, position: { x: 10, y: 10 } }
          : window
      )
    );
    setActiveWindowId(id); // Clear the active window if it is closed
  };

  const handleWindowClick = (id:number) =>{
    console.log("window click")
    setIsStartMenuOpen(false);
    setActiveWindowId(id);
    setWindows(prevWindows =>
      prevWindows.map(window =>
        window.id === id
          ? { ...window, minimized: false }
          : window
      )
    );
    setActiveWindowId(id);
  };

  const minimizeWindow = useCallback((id:number) =>{
    setWindows(prevWindows =>
      prevWindows.map(window =>
        window.id === id
          ? { ...window, minimized: true }
          : window
      )
    );
    setActiveWindowId(0); // Clear the active window if it is closed
  }, [windows]);

  //This is all mainly for draggin
  const handleMouseDown = (e:React.MouseEvent<HTMLDivElement>, id: number) => {
    setIsStartMenuOpen(false);
    const application = applications.find(application => application.id === id);
    if (!application) return;

    const offsetX = e.clientX - application.position.x;
    const offsetY = e.clientY - application.position.y;
    setDragging({id, offsetX, offsetY });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  useEffect(() => {
    draggingRef.current = dragging;
  }, [dragging]);
  const handleMouseMove = (e: MouseEvent) => {
    const currentDragging = draggingRef.current;
    if (!currentDragging || currentDragging.id===null) return;
    const { id, offsetX, offsetY } = currentDragging;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;



    const desktopElement = desktopRef.current;
    if (!desktopElement) return;

    // Get desktop bounds
    const desktopRect = desktopElement.getBoundingClientRect();
    const desktopBounds = {
      left: desktopRect.left,
      top: desktopRect.top,
      right: desktopRect.right-75,
      bottom: desktopRect.bottom-150,
    };
  

    // Snap to grid
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    const constraintX = Math.max(desktopBounds.left, Math.min(snappedX, Math.round((desktopBounds.right-75) / gridSize) * gridSize));
    const constraintY = Math.max(desktopBounds.top, Math.min(snappedY, Math.round((desktopBounds.bottom-75) / gridSize) * gridSize));

    console.log(snappedX, " ", snappedY);
    const updatedApplications = applications.map(application => {
      if (application.id===id){
        return { ...application, position: { x: constraintX, y: constraintY } } 
      }
      else{
        let newX = application.position.x;
        let newY = application.position.y;

        if (constraintX === application.position.x && constraintY === application.position.y) {

          if(constraintX<desktopBounds.right-gridSize){
            newX+=gridSize;
          }
          else{
            newX-=gridSize;
          }
        }
        //constraints
        newX = Math.max(desktopBounds.left, Math.min(newX, Math.round((desktopBounds.right-75) / gridSize) * gridSize));
        newY = Math.max(desktopBounds.top, Math.min(newY, Math.round((desktopBounds.bottom-75) / gridSize) * gridSize));
        

        return { ...application, position: { x: newX, y: newY } } 
      }
    });
    setApplications(updatedApplications);
    
  };
  const handleMouseUp = () => {
    setDragging(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="nui-wrapper">
      <div style={{overflow:'hidden'}} className="computerbackground" ref={desktopRef}>
        {windows.map(window=>(
           <ApplicationWindow
            key={window.id}
            id={window.id}
            name={window.name}
            icon={window.icon}
            position={window.position}
            size={window.size}
            isActive={window.id===activeWindowId}
            isMinimized={window.minimized}
            onClose={closeWindow}
            onMaximize={maximizeWindow}
            onMinimize={minimizeWindow}
            onWindowSelect={handleWindowClick}
           ></ApplicationWindow>
        ))}
        <StartMenu isOpen={isStartMenuOpen} />
        <Taskbar toggleStartMenu={handleToggleStartMenu} windows={windows} onSelectWindow={handleWindowClick} activeWindowId={activeWindowId}></Taskbar>
        {applications.map((application)=>(
          <ApplicationIcon
            style={{left:`${application.position.x}px`, top:`${application.position.y}px`}} 
            key={application.id} name={application.name} imgSrc={application.imgSrc}
            onMouseDown={(e) => handleMouseDown(e, application.id)}
            onDoubleClick={()=>handleDoubleClick(application.name, application.imgSrc)}
          ></ApplicationIcon>
        ))}
       
      </div>
    </div>
  );
};

export default App;

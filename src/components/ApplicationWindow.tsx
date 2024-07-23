import React, { useEffect, useState, useRef } from 'react';
import './App.css'
import './ApplicationWindow.css'

interface Position {
  x: number;
  y: number;
}
interface Size {
  width: number;
  height: number;
}
interface ApplicationWindowProps {
  id:number;
  isActive:boolean;
  isMinimized:boolean;
  name:string;
  icon:string;
  position:Position;
  size:Size;
  onClose: (id: number) => void;
  onMaximize: (id: number) => void;
  onMinimize: (id: number) => void;
  onWindowSelect: (id: number) => void;
}

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({id, isActive, isMinimized, name, icon, position, size, onClose, onMaximize, onMinimize, onWindowSelect}) =>{
    const [windowPosition, setWindowPosition] = useState(position);
    const [windowSize, setWindowSize] = useState(size);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const windowRef = useRef<HTMLElement>(null);
    const outlineRef = useRef<HTMLElement>(null);
    const [outlinePosition, setOutlinePosition] = useState(position);
    const [outlineSize, setOutlineSize] = useState(size);

    useEffect(() => {
        if (isActive) {
          if (windowRef.current){
            windowRef.current.classList.add('active');
          }
         
        } else {
          if (windowRef.current){
            windowRef.current.classList.remove('active');
          }
        }
      }, [isActive]);

    useEffect(() => {
        if (isMinimized) {
          if (windowRef.current){
            windowRef.current.classList.add('hidden');
          }
        } else {
          if (windowRef.current){
            windowRef.current.classList.remove('hidden');
          }
        }
      }, [isMinimized]);

    useEffect(() => {
        setWindowPosition(position);
      }, [position]);

      useEffect(() => {
        setWindowSize(size);
      }, [size]);
    

    useEffect(() => {
        const handleMouseMove = (e:MouseEvent) => {
          if (isDragging && !isResizing) {
            setOutlinePosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
              });
          }
    
          if (isResizing) {
            setOutlineSize({
                width: Math.max(167,e.clientX - windowPosition.x),
                height: Math.max(167, e.clientY - windowPosition.y),
              });
          }
        };
    
        const handleMouseUp = () => {
            setWindowPosition({
                x: outlinePosition.x,
                y: outlinePosition.y
            });
  
            setWindowSize({
                width: outlineSize.width,
                height: outlineSize.height
            });
          setIsDragging(false);
          setIsResizing(false);
        };
    
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }, [isDragging, isResizing, dragOffset, windowPosition, windowSize, outlineSize, outlinePosition]);
    
      const onMouseDown = (e:React.MouseEvent<HTMLDivElement>, type:'drag'|'resize') => {
        e.preventDefault();
        e.stopPropagation();
        onWindowSelect(id);
        if (type === 'drag') {
          setDragOffset({
            x: e.clientX - windowPosition.x,
            y: e.clientY - windowPosition.y,
          });
          setIsDragging(true);

        } else if (type === 'resize') {
            setOutlineSize({
                width: Math.max(167,e.clientX - windowPosition.x),
                height: Math.max(167, e.clientY - windowPosition.y),
            });
            setIsResizing(true);
        }
      };

      const handleWindowClick = (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onWindowSelect(id);
      };


      return (
        <>
        <div
          ref={windowRef as React.RefObject<HTMLDivElement>}
          className={`win95-border application-window`}
          style={{ left: windowPosition.x, top: windowPosition.y, width: windowSize.width, height: windowSize.height }}
          onMouseDown={handleWindowClick}
          >
            <div className={`window-title-bar ${isActive?'active':''}`}
                onMouseDown={(e) => onMouseDown(e, 'drag')}
                >
                <img style={{imageRendering:'pixelated', pointerEvents:'none', height:'5.5vh', marginRight:'', marginLeft:'-6px'}} src={icon} />
                <span style={{marginRight:'auto'}} className="window-title">{name}</span> 
                <div style={{height:'3vh', marginLeft:'auto', cursor:'auto'}} onMouseDown={(e)=> {e.stopPropagation(); onMinimize(id)}}><img style={{height:'3vh',imageRendering:'pixelated', pointerEvents:'none'}} src={"../../assets/minimize.gif"} /></div>
                <div style={{height:'3vh', marginRight:'', cursor:'auto'}} onMouseDown={(e)=> {e.stopPropagation(); onMaximize(id)}}><img style={{height:'3vh',imageRendering:'pixelated', pointerEvents:'none'}} src={"../../assets/maximize.gif"} /></div>
                <div style={{height:'3vh', marginRight:'3px', cursor:'auto'}} onMouseDown={(e)=> {e.stopPropagation(); onClose(id)}}><img style={{height:'3vh',imageRendering:'pixelated', pointerEvents:'none'}} src={"../../assets/close.gif"} /></div>
            </div>
            <div className="win95-scrollarea window-content">
                {/* Application content goes here */}
                <p>Some scrollable content...aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                <p>More content...</p>
                <p>Even more content...</p>
                <p>Some scrollable content...</p>
                <p>More content...</p>
                <p>Even more content...</p>
                <p>Some scrollable content...</p>
                <p>More content...</p>
                <p>Even more content...</p>
                    
            </div>
            <div className="resize-handle bottom-right"
                onMouseDown={(e) => onMouseDown(e, 'resize')}>
            </div>
        </div>
        {(isDragging || isResizing) && (
            <div
            ref={outlineRef as React.RefObject<HTMLDivElement>}
            className="application-window-outline"
            style={{
              top: outlinePosition.y,
              left: outlinePosition.x,
              width: outlineSize.width,
              height: outlineSize.height,
            }}></div>
        )}
        </>
      );
    };

    export default ApplicationWindow;
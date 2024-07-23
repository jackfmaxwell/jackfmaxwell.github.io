import React, {CSSProperties, MouseEventHandler} from 'react';
import './App.css'
import PropTypes from 'prop-types';

interface ApplicationIconProps {
  name:string;
  imgSrc:string;
  style?:CSSProperties;
  onMouseDown?:MouseEventHandler<HTMLDivElement>;
  onDoubleClick?:MouseEventHandler<HTMLDivElement>;
}

const ApplicationIcon:React.FC<ApplicationIconProps> = ({name, imgSrc, style, onMouseDown, onDoubleClick}) => {
  ApplicationIcon.propTypes = {
    name: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
    style: PropTypes.object,
    onMouseDown: PropTypes.func,
};
  
ApplicationIcon.defaultProps = {
    style: {},
    onMouseDown: () => {},
};

  return (
    <div id="draggable" onDoubleClick={onDoubleClick} onMouseDown={onMouseDown} style={style} className="win95-icon">
        <div className='drag-handle'>
            <img style={{pointerEvents:'none'}} src={imgSrc} alt="App Icon"/>
            <span>{name}</span> 
        </div>
    </div>
  );
}

export default ApplicationIcon;
import React from 'react';
import './about.css';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  data: Array<{
    title: string;
    link: string;
    image: string;
  }>;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, data }) => {
  return (
    <div className={`overlay ${isOpen ? "open" : ""}`}>
      <a href="javascript:void(0)" className="closebtn" onClick={onClose}>
        &times;
      </a>
      <div className="overlay-content">
        {data.map((item, index) => (
          <div key={index}>
            <h2>{item.title}</h2>
            <a href={item.link}>{item.link}</a>
            <img src={item.image} alt={item.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overlay;

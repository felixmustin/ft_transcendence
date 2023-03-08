import React from 'react';
import { Link } from 'react-router-dom';

interface BannerButton {
  text: string;
  link: string;
}

interface BannerProps {
  title: string;
  buttons: BannerButton[];
}

const Banner: React.FC<BannerProps> = ({ title, buttons }) => {
  return (
    <div className="banner">
      <h1>{title}</h1>
      {buttons.map((button, index) => (
        <Link key={index} to={button.link}>
          <button>{button.text}</button>
        </Link>
      ))}
    </div>
  );
};

export default Banner;

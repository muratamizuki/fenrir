import React from "react";
import styles from './RestaurantItem.module.css';

const RestaurantItem = ({ name, logoImage, address, catchPhrase }) => {
  return (
    <div className="restaurant-item">
      <img src={logoImage} alt={name} className="restaurant-logo" />
      <div className="restaurant-details">
        <h3>{name}</h3>
        <p>{address}</p>
        <p>{catchPhrase}</p>
      </div>
    </div>
  );
};

export default RestaurantItem;

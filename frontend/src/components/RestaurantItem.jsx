import React from "react";
import styles from './RestaurantItem.module.css';

const RestaurantItem = ({ name, logoImage, address, catchPhrase }) => {
  return (
    <div className="styles.restaurant-item">
      <img src={logoImage} alt={name} className="styles.restaurant-logo" />
      <div className="styles.restaurant-details">
        <h3>{name}</h3>
        <p>{address}</p>
        <p>{catchPhrase}</p>
      </div>
    </div>
  );
};

export default RestaurantItem;

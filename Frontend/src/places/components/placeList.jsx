import React from "react";

import PlaceItem from "./placeItem";
// import Card from "../../shared/components/UIElements/card";
// import Button from "../../shared/components/FormElements/button";

import styles from "./placeList.module.css";

const PlaceList = ({ items, onDelete }) => {
  // if (items.length === 0) {
  //   return (
  //     <div className={`${styles.list} center`}>
  //       <Card>
  //         <h2>No places found. Maybe create one?</h2>
  //         <Button to="/places/new">Share Place</Button>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <PlaceItem
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          imageUrl={item.image}
          address={item.address}
          location={item.location}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default PlaceList;

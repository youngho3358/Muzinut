// GenreTabs.tsx

import React from "react";
import styles from "./css/Genre.module.css";
type GenreTabProps = {
  activeTab: string;
  onTabClick: (genreId: string) => void;
};

const GenreTabs: React.FC<GenreTabProps> = ({ activeTab, onTabClick }) => {
  const genreTabs = [
    { id: "kpop", name: "K-POP" },
    { id: "ballade", name: "발라드" },
    { id: "pop-song", name: "POP" },
    { id: "hip-hop", name: "힙합" },
    { id: "R&B", name: "R&B" },
    { id: "indi", name: "인디" },
    { id: "trot", name: "트로트" },
    { id: "virtual", name: "버튜버" },
    { id: "etc", name: "기타" },
  ];

  console.log("ACTIVETAB=", activeTab);
  
  return (
    <div className={styles.genreTab__container}>
      
      {genreTabs.map((genre) => (
        <div
          key={genre.id}
          className={`${styles.genre__title} ${
            activeTab === genre.id ? styles.selected__genre : ""
          }`}
          onClick={() => onTabClick(genre.id)}
        >
          {genre.name} {/* TAB 이름 나열 */}
        </div>
      ))}
    </div>
  );
};

export default GenreTabs;

import styles from "./css/MusicList.module.css";
import Image from "next/image";
import search from "../../../../public/images/favicon.png";

const MusicTableRow = () => (
  <tr className={styles.tr__wrap}>
    <td className={styles.td1__select}>
      <input type="checkbox" />
    </td>
    <td className={styles.td2__picture}>
      <div>
        <Image src={search} alt="search" width={50} height={50} />
        <a href="#"></a>
      </div>
    </td>
    <td className={styles.td3__ranking}>
      <span>1</span>
    </td>
    <td className={styles.td4__title}>
      <span>음악 이름</span>
    </td>
    <td className={styles.td5__artist}>
      <span>가수 이름</span>
    </td>
    <td className={styles.td6__play__btn}>
      <button className={styles.btn}>
        <Image src={search} alt="search" width={30} height={30} />
      </button>
    </td>
    <td className={styles.td7__option}>
      <button className={styles.btn}>
        <Image src={search} alt="search" width={30} height={30} />
      </button>
    </td>
  </tr>
);

export default MusicTableRow;

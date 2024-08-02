// "use client";
// import styles from "../main/css/BestMusic.module.css";
// import Image from "next/image";
// import search from "../../../../public/images/favicon.png";
// import { useMusicDataFetchData } from "../useHook";
// import { useContext } from "react";
// import { TabContext } from "../chart/TabProvider";

// export type MusicDataItem = {
//   albumImg: string;
//   musicName: string;
//   artistName: string;
//   musicData: string;
//   id: number;
// };

// const TableRow: React.FC<{
//   item: MusicDataItem;
//   index: number;
//   showCheckbox?: boolean;
// }> = ({
//   item,
//   index,
//   showCheckbox = true, // 기본값으로 checkbox를 보이도록 설정
// }) => (
//   <tr className={styles.tr__styles}>
//     {showCheckbox && (
//       <td className={styles.td1__select}>
//         <input type="checkbox" />
//       </td>
//     )}
//     <td className={styles.thumb__picture}>
//       <a href="#">
//         <Image src={search} alt="album" width={50} height={50} />
//       </a>
//     </td>
//     <td className={styles.ranking}>
//       <span>{index + 1}</span>
//     </td>
//     <td className={styles.song}>
//       <span>{item.musicName}</span>
//     </td>
//     <td className={styles.artist}>
//       <span>{item.artistName}</span>
//     </td>
//     <td className={styles.play__btn}>
//       <button className={styles.btn}>
//         <Image src={search} alt="play" width={30} height={30} />
//       </button>
//     </td>
//     <td className={styles.option}>
//       <button className={styles.btn}>
//         <Image src={search} alt="option" width={30} height={30} />
//       </button>
//     </td>
//   </tr>
// );

// // ++++++++++ URL 부분++++++++++++++++++
// // props로 url 받을 때 -> main 페이지의 인기차트 Top10
// // TabProvider 로 부터 url을 전달받는 경우(뮤직 차트 디테일 부분)
// const BestMusic: React.FC<{ url?: string }> = (props) => {
//   //url props 전달 or 전달X
//   const { url: contextUrl } = useContext(TabContext); //TabProvider에서 제공하는 url 상태 가져오기
//   /* url props 값 사용 OR 
//   TabProvider에서 제공하는 contextUrl을 사용하여 데이터를 가져오기
//   */
//   const fetchUrl = props.url || contextUrl;

//   console.log("콘텍스트URL", contextUrl);
//   console.log("프롭스URL", props.url);
//   const { data: listItems, loading, error } = useMusicDataFetchData(fetchUrl);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   // props.url이 존재하면 checkbox를 숨김
//   // props.url이 없으면 checkbox를 보이게 함
//   const showCheckbox = !props.url; 

//   return (
//     <div className={styles.container}>
//       <table className={styles.table__container}>
//         <thead>
//           <tr className={styles.tr__name}>
//             <th>체크박스</th>
//             <th>썸네일</th>
//             <th>랭킹</th>
//             <th>음악이름</th>
//             <th>가수 이름</th>
//             <th>재생</th>
//             <th>옵션</th>
//           </tr>
//         </thead>
//         <tbody>
//           {listItems.map((item, index) => (
//             <TableRow
//               key={item.id}
//               item={item}
//               index={index}
//               showCheckbox={showCheckbox}
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export { TableRow, BestMusic };

// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import { redirect } from "next/navigation";
// import { MiniViewIcon } from "@/app/components/icon/icon";

// const DetailComments = () => {
//   const [comment, setComment] = useState(""); //사용자가 작성하는 댓글
//   const [comments, setComments] = useState([]); //서버로 부터 받아온 댓글들 (대댓글 포함)

//   return (
//     <>
//       <h4>hello comments</h4>
//       <ProfileContainer>
//         <ProfileImage src={"/test"} alt="프로필 이미지" />
//         <ProfileInfo>
//           <ProfileName>writer</ProfileName>
//           <TimeViewsContainer>
//             <Time>createdDt</Time>
//           </TimeViewsContainer>
//         </ProfileInfo>
//       </ProfileContainer>
//     </>
//   );
// };

// export default DetailComments;

// // 프로필 컨테이너
// const ProfileContainer = styled.div`
//   display: flex;
//   align-items: center;
//   padding-bottom: 10px;
//   border-bottom: 1px solid #ddd;
//   font-family: "esamanru Medium";
// `;

// // 프로필 이미지
// const ProfileImage = styled.img`
//   width: 34px;
//   height: 34px;
//   border-radius: 50%;
//   margin-right: 10px;
// `;

// // 프로필 정보
// const ProfileInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 5px;
// `;

// // 프로필 이름
// const ProfileName = styled.div`
//   font-size: 14px;
//   font-weight: bold;
// `;

// // 시간과 조회수 컨테이너
// const TimeViewsContainer = styled.div`
//   display: flex;
//   gap: 10px;
// `;

// // 업로드 시간
// const Time = styled.div`
//   font-size: 12px;
//   color: #888;
// `;

// // 조회수
// const Views = styled.div`
//   display: flex;
//   font-size: 12px;
//   color: #888;

//   img {
//     width: 24px;
//     height: 24px;
//   }
// `;

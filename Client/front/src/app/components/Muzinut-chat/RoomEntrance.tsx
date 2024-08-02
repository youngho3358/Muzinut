"use client";
import styles from "../../(_Front)/friends-list/chat/chatList.module.css";
import Image from "next/image";
import userImg from "../../../../public/svgs/addalbum.svg";
import { useRouter } from "next/navigation";

export default function RoomEntrance() {
  const router = useRouter();

  const my = {
    name: '지원'
  }
  const user = {
    id: "kwon11",
    nickname: "지원",
    Message: [
      { roomId: 123, content: "안녕하세요", createdAt: new Date() },
      { roomId: 456, content: "히히", createdAt: new Date() },
    ],
  };
  // function onClickRoom(): void {
  //   router.push("/friends-list/chat/${user.Message.at(-1)?.roomId}");
  // }

  const openChatPage = () => {
    
    const width = 400; // 원하는 너비
    const height = 600; // 원하는 높이
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    window.open(
      `/friends-list/chat/room=?${my.name}&friend=${user.nickname}`,
         "_blank",
    "noopener,noreferrer,width=800,height=600"
  );
 
};
  return (
    <div className={styles.room} onClick={openChatPage}>
      <div className={styles.user__img}>
        <Image
          src={userImg}
          alt={`${user.nickname}의 프로필 이미지`}
          width={20}
          height={20}
        ></Image>
      </div>
      <div className={styles.room__chat__info}>
        {/* 유저 정보들 */}
        <div className={styles.room__user__info}>
          <b>{user.nickname}</b>
          &nbsp;
          <span>@{user.id}</span>
          &nbsp; | &nbsp;
          <span>몇 초전</span>
        </div>

        {/* 메시지 미리 보기 부분 */}
        <div className={styles.room__last__chat}>
          {/* 마지막 메시지 가져오기 */}
          {user.Message?.at(-1)?.content};
        </div>
      </div>
    </div>
  );
}

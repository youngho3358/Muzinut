"use client";
import { useRouter } from "next/navigation";
import styles from "../../(_Front)/friends-list/page.module.css";
import Image from "next/image";
import userImg from "@/../../public/images/artist2.png";
import Link from "next/link";
import goChat from "@/../../public/svgs/chat.svg";

interface FriendProps {
  name: string;
  image: string;
}

const Friend: React.FC<FriendProps> = ({ name, image }) => {
  const router = useRouter();
  const user = {
    name: "지원",
  };

  function onClickChatBtn(): void {
    router.push(`/friends-list/chat/${user.name}&friend=${name}`);
  }


  const onClickBlockBtn = () => {
    const alertMsg = confirm(`${name} 님을 차단하시겠습니까?`);
    if (alertMsg) {
      alert(`${name} 님을 차단했습니다.`);
    } else {
    }
  };
  /*
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 이벤트 전파 방지
  };
*/
  return (
    <div className={styles.friend__list}>
      {/* 이미지 부분 */}
      <div className={styles.user__img}>
        <Link href="/profile/lounge">
          <Image
            src={userImg}
            alt={`${name}의 프로필 이미지`}
            width={60}
            height={60}
          />
        </Link>
      </div>
      {/* 사용자 정보 */}
      <div className={styles.friend__info}>
        <Link href="/profile/lounge">
          <span className={styles.name}>{name}</span>
        </Link>
        <button className={styles.block__btn} onClick={onClickBlockBtn}>
          차단하기
        </button>
      </div>
      {/* 채팅하기 버튼 */}
      <button className={styles.chat__btn} onClick={onClickChatBtn}>
        <Image src={goChat} alt="go-chat" width={40} height={40} />
      </button>
    </div>
  );
};

export default Friend;

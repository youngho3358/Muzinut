"use client";
import Friend from "@/app/components/friend-list/Friend";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const user = { name: "지원" };

const friends = [
  { name: "지원", image: "@/../../../../../public/svgs/chart.svg" },
  { name: "지윤", image: "@/../../../../../public/svgs/chart.svg" },
  { name: "선희", image: "@/../../../../../public/svgs/chart.svg" },
  { name: "혁경", image: "@/../../../../../public/svgs/chart.svg" },
  { name: "지원", image: "@/../../../../../public/svgs/chart.svg" },
];

const FriendList = () => {
  const router = useRouter();

  const isAuthenticated = true;

  if (!isAuthenticated) {
    return null; // 인증되지 않은 경우 아무것도 렌더링하지 않음
  }

  // const startChat = (friend: string) => {
  //   router.push(`/friends-list/chat/${user.name}&friend=${friend}`);
  // };

  return (
    <main className={styles.main}>
      <div className={styles.main__wrapper}>
      <div className={styles.header}>
        <h3>친구 목록</h3>
      </div>

      <div className={styles.contents}>
        <ul>
          {friends.map((friend) => (
            <li key={friend.name}>
              <Friend name={friend.name} image={friend.image} />
            </li>
          ))}
        </ul>
        </div>

      </div>
    </main>
  );
};

export default FriendList;

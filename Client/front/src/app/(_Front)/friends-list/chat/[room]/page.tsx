import styles from "./chatRoom.module.css";
import Link from "next/link";
import Image from "next/image";
import userImg from "../../../../../../public/svgs/addalbum.svg";
import MessageInputForm from "@/app/components/Muzinut-chat/MessagInputForm";


export default function ChatRoom() {
  const user = {
    id: "kwon11",
    nickname: "지원",
    image: userImg,
  };

  const messgaes = [
    {
      messageId: 1,
      roomId: 123,
      id: "kwon11",
      content: "안녕하세요",
      createdAt: new Date(),
    },
    {
      messageId: 2,
      roomId: 456,
      id: "jiwon46",
      content: "히히",
      createdAt: new Date(),
    },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <button>뒤로 가기버튼(컴포넌트화하기)</button>
        <div>
          <h2>{user.nickname} 님 과의 채팅</h2>
        </div>
      </div>
      <Link href={user.nickname} className={styles.userInfo}>
        <Image src={user.image} alt={user.id} width={20} height={20}></Image>

        <div>
          <b>{user.nickname}</b>
        </div>
        <div>
          <b>@{user.id}</b>
        </div>
      </Link>

      <div className={styles.list}>
        {messgaes.map((m) => {
          if (m.id === "kwon11") {
            //내 메시지라면
            return (
              <div key={m.messageId} className={styles.myMessage}>
                <div className={styles.content}>{m.content}</div>
                <div className={styles.date}>
                  {/* {m.createdAt.toLocaleDateString()} */}
                  {/* <br /> */}
                  {m.createdAt.toLocaleTimeString()}
                  {/* <br /> */}
                  {/* {m.createdAt.getDate()}일{m.createdAt.getHours()}시 */}
                  {/* {m.createdAt.getMinutes()}분 */}
                </div>
              </div>
            );
          }
          return (
            <div key={m.messageId} className={styles.yourMessage}>
              <div className={styles.content}>{m.content}</div>
              <div className={styles.date}>
                {m.createdAt.toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.list}>
        <MessageInputForm />
      </div>
    </main>
  );
}

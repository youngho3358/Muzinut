import styles from "./../chat/chatList.module.css";
import RoomEntrance from "@/app/components/Muzinut-chat/RoomEntrance";

const ChatList = () => {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h3>채팅 목록</h3>
      </div>
      <RoomEntrance />
      <RoomEntrance />
      <RoomEntrance />
      <RoomEntrance />
      <RoomEntrance />
    </main>
  );
};

export default ChatList;

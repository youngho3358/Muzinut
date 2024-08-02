import { useEffect, useState } from "react";
import styles from "../css/loginBtn.module.css";
import Image from "next/image";
import profile from "@/../../public/svgs/profile.svg";
import profileBtn from "@/../../public/svgs/profile.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserInfo, useUser } from "../../UserContext";

// export type UserInfo = {
//   avatar: string;
//   username: string;
//   useremail: string;
// };

const LoginBtn = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  console.log("useProvider에서 가져온 user 정보..아마 undefined임", user);

  const login = () => {
    router.push("/member/login");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("user 정보가 삭제됨. 아마 undefined임", user);
    router.push("/");
  };

  return (
    <div>
      {/* 로그인 전 */}
      {!user && (
        <div className={styles.login__btn__container}>
          <div onClick={login} className={styles.login__btn__wrap}>
            <div className={styles.user__img}>
              <Image src={profile} alt="addalbum" width={30} height={30} />
            </div>
            <div>로그인</div>
          </div>
        </div>
      )}

      {/* 로그인 후 */}
      {user && <UserProfile userInfo={user} onLogout={logout} />}
    </div>
  );
};

export default LoginBtn;

type UserProfileProps = {
  userInfo: UserInfo;
  onLogout: () => void;
};

const UserProfile = ({ userInfo, onLogout }: UserProfileProps) => {
  //사용자 정보가 들어오면 디테일 박스 열리게
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // const router = useRouter();

  // 사용자 정보 상자 열기/닫기 토글로
  const toggleUserDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  // Link 클릭 시 isDetailsOpen을 닫음
  const handleLinkClick = () => {
    setIsDetailsOpen(false);
  };

  console.log("로그인 후 사용자 정보", userInfo);

  const userNickName = userInfo.nickname;
  return (
    <div>
      <div className={styles.login__btn__container}>
        <div onClick={toggleUserDetails} className={styles.login__btn__wrap}>
          <div className={styles.user__img}>
            <Image
              src={`data:image/png;base64, ${userInfo.avatar}`}
              alt="addalbum"
              width={30}
              height={30}
            />
          </div>
          <div className={styles.user__name}> {userInfo.nickname}</div>
        </div>
      </div>

      {isDetailsOpen && (
        <div className={styles.user__detail__box}>
          <div className={styles.my__and__book}>
            <Link
              href={`/profile?nickname=${userNickName}`}
              className={styles.my__page}
              onClick={() => {window.location.href = `/profile?nickname=${userNickName}`}}
            >
              <Image src={profileBtn} alt="addalbum" width={30} height={30} />
              <span>마이페이지</span>
            </Link>
            <div className={styles.divider__right}></div> {/* 구분 선 */}
            <Link
              href="/details/album"
              className={styles.book__mark}
              onClick={handleLinkClick}
            >
              <Image src={profileBtn} alt="addalbum" width={30} height={30} />
              <span>북마크</span>
            </Link>
          </div>
          <div className={styles.chat__and__nuts}>
            <Link
              href="/friends-list/chat"
              className={styles.chat}
              onClick={handleLinkClick}
            >
              <Image src={profileBtn} alt="addalbum" width={30} height={30} />
              <span>채팅</span>
            </Link>
            <div className={styles.divider}></div> {/* 구분 선 */}
            <Link
              href="/friends-list"
              className={styles.friend__list}
              onClick={handleLinkClick}
            >
              <Image src={profileBtn} alt="addalbum" width={30} height={30} />
              <span>친구 목록</span>
            </Link>
            <div className={styles.divider}></div> {/* 구분 선 */}
            <Link href="/" className={styles.nuts} onClick={handleLinkClick}>
              <Image src={profileBtn} alt="addalbum" width={30} height={30} />
              <span>너츠</span>
            </Link>
          </div>
          <div className={styles.divider}></div> {/* 구분 선 */}
          <div className={styles.logout__btn} onClick={onLogout}>
            <Image src={profileBtn} alt="addalbum" width={30} height={30} />
            <span>로그아웃</span>
          </div>
        </div>
      )}
    </div>
  );
};

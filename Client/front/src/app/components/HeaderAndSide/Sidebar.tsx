import Link from "next/link";
import styles from "../HeaderAndSide/css/Sidebar.module.css";
import Image from "next/image";
interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen }: SidebarProps) {
  return (
    <div>
      <div
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.container__section}>
          <ul className={styles.service__container}>
            {/* 홈 부분  */}
            <li>
              <div className={styles.service__btn}>
                <Link href="/" className={styles.wrap__icon}>
                  <Image
                    src="/svgs/home.svg"
                    alt="Services"
                    width={30}
                    height={30}
                  />
                  <span className={styles.close__text}>홈</span>
                </Link>
                {isSidebarOpen && (
                  <ul>
                    <li>
                      <Link href="/">
                        <span>홈</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* 차트 부분 */}
            <li>
              <div className={styles.service__btn}>
                <Link href="/chart/music" className={styles.wrap__icon}>
                  <Image
                    src="/svgs/chart.svg"
                    alt="Services"
                    width={30}
                    height={30}
                  />
                  <span className={styles.close__text}>차트</span>
                </Link>
                {isSidebarOpen && (
                  <ul>
                    <li>
                      <span>차트</span>
                    </li>
                    <li>
                      <Link href="/chart/music">
                        <span>음원</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/chart/artist">
                        <span>아티스트</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* 커뮤니티 부분 */}
            <li>
              <div className={styles.service__btn}>
                <Link
                  href="/community/free-boards"
                  className={styles.wrap__icon}
                >
                  <Image
                    src="/svgs/community.svg"
                    alt="Services"
                    width={30}
                    height={30}
                  />
                  <span className={styles.close__text}>커뮤니티</span>
                </Link>
                {isSidebarOpen && (
                  <ul>
                    <li>
                      <Link href="/community/free-boards">
                        <span>커뮤니티</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/community/free-boards">
                        <span>자유 게시판</span>
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link href="/community/recruit-boards">
                        <span>모집</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/community/request-boards">
                        <span>게시판 요청</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* 마이픽 부분 */}
            <li>
              <div className={styles.service__btn}>
                <Link href="/mypick/bestpick" className={styles.wrap__icon}>
                  <Image
                    src="/svgs/mypick.svg"
                    alt="Services"
                    width={30}
                    height={30}
                  />
                  <span className={styles.close__text}>마이픽</span>
                </Link>
                {isSidebarOpen && (
                  <ul>
                    <li>
                      <span>마이픽</span>
                    </li>
                    <li>
                      <Link href="/mypick/bestpick">
                        <span>랭킹</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/mypick/vote">
                        <span>투표하기</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* 구역 나누기 */}

            <div className={styles.divided__line}></div>

            {/* 고객 센터 부분 */}
            <li>
              <div className={styles.service__btn}>
                <Link href="#" className={styles.wrap__icon}>
                  <Image
                    src="/svgs/customer_service.svg"
                    alt="Services"
                    width={30}
                    height={30}
                  />
                  <span className={styles.close__text}>고객센터</span>
                </Link>
                {isSidebarOpen && (
                  <ul>
                    <li>
                      <Link href="#">
                        <span>고객센터</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* 이벤트 */}
            <li>
              <div className={styles.service__btn}>
                <Link href="/notice" className={styles.wrap__icon}>
                  <Image
                    src="/svgs/event.svg"
                    alt="Services"
                    width={30}
                    height={30}
                  />
                  <span className={styles.close__text}>뮤지넛 소식</span>
                </Link>
                {isSidebarOpen && (
                  <ul>
                    <li>
                      <Link href="/notice">
                        <span>뮤지넛 소식</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/notice">
                        <span>공지사항</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/event">
                        <span>이벤트</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

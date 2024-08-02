"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import styles from "./css/layout.module.css";
import HeaderAndSide from "./components/HeaderAndSide/HeaderAndSide";
import { usePathname } from "next/navigation";
import { UserProvider } from "./components/UserContext";

// Header랑 Sidebar 안 나오게 하는 페이지들
const HIDDEN_HEADERS = [
  "/member/login",
  "/member/signup",
  "/member/reset-password",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Sidebar의 상태를 변경하는 함수
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Header랑 Sidebar 안 나오게 하는 페이지들
  const pathname = usePathname();
  const [isHiddenHeader, setIsHiddenHeader] = useState(false);
  //pathname이랑 HIDDEN_HEADERS랑 같을 경우에는 true를 리턴
  useEffect(() => {
    if (pathname !== null) {
      setIsHiddenHeader(HIDDEN_HEADERS.includes(pathname));
    }
  }, [pathname]);
  // console.log("현재 페이지는", isHiddenHeader);

  return (
    <UserProvider>
      <html lang="ko">
        <head>
          <link rel="icon" href="/images/Muzinut.png" />
        </head>
        <body>
          <div className={styles.container}>
            <div
              className={isSidebarOpen ? styles.side__open : styles.side__close}
            >
              {!isHiddenHeader && (
                <div className={styles.header__side}>
                  <HeaderAndSide
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                </div>
              )}
              <main className={styles.main__page}>{children}</main>
            </div>
          </div>
        </body>
      </html>
    </UserProvider>
  );
}

// 추가

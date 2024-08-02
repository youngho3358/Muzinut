declare global {
  interface Window {
    Naver: any;
  }
}

import React, { useEffect } from "react";

const NaverPayButton = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://nsp.pay.naver.com/sdk/js/naverpay.min.js";
    script.onload = () => {
      if (window.Naver && window.Naver.Pay) {
        const oPay = window.Naver.Pay.create({
          mode: "development",
          clientId: "HN3GGCMDdTgGUfl0kFCo",
          chainId: "RXpIMWIzTnJIZVd",
        });

        const elNaverPayBtn = document.getElementById("naverPayBtn");
        if (elNaverPayBtn) {
          elNaverPayBtn.addEventListener("click", () => {
            oPay.open({
              merchantUserKey: "user_123456",
              merchantPayKey: "pay_123456",
              productName: "테스트 상품",
              totalPayAmount: 10000,
              taxScopeAmount: 9000,
              taxExScopeAmount: 1000,
              returnUrl: "https://example.com/return",
            });
          });
        }
      } else {
        console.error("Naver Pay SDK 로드 실패");
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

export default NaverPayButton;

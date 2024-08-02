import React, { useState } from "react";
import axios from "axios";

const KakaoPayButton = () => {
  const [paymentUrl, setPaymentUrl] = useState("");

  const handlePaymentRequest = async () => {
    try {
      const response = await axios.post(
        "https://kapi.kakao.com/v1/payment/ready",
        {
          cid: "TC0ONETIME", // 가맹점 코드
          partner_order_id: "partner_order_id", // 가맹점 주문번호
          partner_user_id: "partner_user_id", // 가맹점 회원 id
          item_name: "넛츠 충전", // 상품 이름
          quantity: "1", // 상품 수량
          total_amount: "1100", // 총 결제 금액
          vat_amount: "100", // 부가세
          tax_free_amount: "0", // 비과세 금액
          approval_url: "https://example.com/success", // 결제 성공 시 이동할 URL
          fail_url: "https://example.com/fail", // 결제 실패 시 이동할 URL
          cancel_url: "https://example.com/cancel", // 결제 취소 시 이동할 URL
        },
        {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_ADMIN_KEY}`, // KakaoPay Admin 키
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      const { next_redirect_pc_url } = response.data; // PC URL 사용 가능
      setPaymentUrl(next_redirect_pc_url); // 상태 업데이트: 결제 URL 설정

      // 결제 URL을 사용하여 리다이렉트하거나, 버튼을 렌더링하여 사용자가 클릭할 수 있도록 구성할 수 있습니다.
    } catch (error) {
      console.error("Failed to request KakaoPay payment:", error);
    }
  };

  return (
    <div>
      <button onClick={handlePaymentRequest}>카카오페이 결제하기</button>
      {paymentUrl && (
        <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
          결제 페이지로 이동
        </a>
      )}
    </div>
  );
};

export default KakaoPayButton;

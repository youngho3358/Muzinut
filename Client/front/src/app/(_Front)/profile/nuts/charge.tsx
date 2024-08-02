import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import nut from "../../../../../public/images/Nuts.png";
import { DownArrow, UpArrow } from "@/app/components/icon/icon";
import NaverPayButton from "./naverpay";

interface ChargeProps {
  onClose: () => void;
}

interface NutAmountProps {
  nutAmount: number;
}

const NutAmountData = (): NutAmountProps => {
  return {
    nutAmount: 10,
  };
};

const Charge: React.FC<ChargeProps> = ({ onClose }) => {
  const nutAmountData = NutAmountData();
  const [inputData, setInputData] = useState(10);

  const handleInputChange = (value: number) => {
    setInputData(value);
  };

  // 넛츠 1개당 금액
  const nutPrice = 110;

  // 최종 결제금액 계산
  const totalPrice = inputData * nutPrice;

  const [Payment, setPayment] = useState(false); // 상세 내용 보임 여부 상태
  const [isAgreed, setIsAgreed] = useState(false); // 약관 동의 상태

  const handleAgreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(event.target.checked);
  };

  // 최종 결제 버튼 핸들러
  const handleChargeClick = () => {
    if (!isAgreed) {
      alert("약관에 동의해야 충전할 수 있습니다.");
    } else {
      if (totalPrice < 1099) {
        alert("넛츠는 10개 이상 충전할 수 있습니다.");
      } else {
        // 네이버페이 결제 로직 추가
        if (window.Naver && window.Naver.Pay) {
          const oPay = window.Naver.Pay.create({
            mode: "development", // 개발용 설정
            clientId: "HN3GGCMDdTgGUfl0kFCo",
            chainId: "RXpIMWIzTnJIZVd",
          });

          oPay.open({
            merchantUserKey: "user_123456",
            merchantPayKey: "pay_123456",
            productName: "테스트 상품",
            totalPayAmount: totalPrice, // 최종 결제 금액을 넣어줘야 함
            taxScopeAmount: totalPrice * 0.9, // 세금 포함 금액
            taxExScopeAmount: totalPrice * 0.1, // 비과세 금액
            returnUrl: "https://example.com/return",
          });
        } else {
          console.error("Naver Pay SDK 로드 실패");
        }
      }
    }
  };

  // 넛츠 결제 페이지 상세내역 화살표
  const togglePaymentDetail = () => {
    setPayment(!Payment);
  };

  return (
    <ChargeBackground>
      <ChargeContainer>
        <ChargePopupHeader>
          <HeaderText>넛츠 충전하기</HeaderText>
          <HeaderButton onClick={onClose}>X</HeaderButton>
        </ChargePopupHeader>
        <ChargePopupBody>
          <OwnNutBox>
            <OwnNutText>현재 보유 넛츠</OwnNutText>
            <OwnNutImage>
              <Image src={nut} alt="Nuts"></Image>
              {nutAmountData.nutAmount}
            </OwnNutImage>
          </OwnNutBox>
          <ChargeNutBox>
            <ChargeNutTextInputBox>
              <ChargeNutText>충전할 넛츠</ChargeNutText>
              <ChargeNutInputBox>
                <ChargeNutInputWrapper>
                  <Image src={nut} alt="Nuts" />
                  <input
                    type="text"
                    pattern="[0-9]*"
                    value={inputData === 0 ? "" : inputData.toString()}
                    placeholder="최소 10 ~  최대 5000"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        const numberValue = value === "" ? 0 : Number(value);
                        if (numberValue >= 0 && numberValue <= 5000) {
                          handleInputChange(numberValue);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === "") {
                        handleInputChange(0); // 값이 비어 있을 경우 0으로 초기화
                      }
                    }}
                    min={10}
                    max={5000}
                  />
                </ChargeNutInputWrapper>
              </ChargeNutInputBox>
            </ChargeNutTextInputBox>
            <ChargeNutAmount>
              <ul>
                {[10, 50, 100, 500].map((amount) => (
                  <li key={amount} onClick={() => handleInputChange(amount)}>
                    {amount}
                  </li>
                ))}
              </ul>
            </ChargeNutAmount>
          </ChargeNutBox>
        </ChargePopupBody>
        <ChargePopupFooter>
          <ChargePayment>
            <ul>
              <li>최종 결제금액</li>
              <li>{totalPrice.toLocaleString()}원</li>
            </ul>
          </ChargePayment>
          <ChargePaymentAgree>
            <AgreeCheckboxContainer>
              <AgreeCheckbox
                type="checkbox"
                id="agree"
                checked={isAgreed}
                onChange={handleAgreeChange}
              />
              <AgreeText>
                넛츠 이용 안내를 확인하고 충전에 동의합니다.
              </AgreeText>
              <AgreeArrow onClick={togglePaymentDetail}>
                {Payment ? <UpArrow /> : <DownArrow />}
              </AgreeArrow>
            </AgreeCheckboxContainer>
            <AgreeContent show={Payment ? 1 : 0}>
              <ul>
                <li>충전한 넛츠를 사용하여 아티스트에게 후원할 수 있습니다.</li>
                <li>넛츠 구매 시 10%의 부가가치세가 부과됩니다.</li>
                <li>
                  넛츠 충전 및 사용내역, 결제내역은 마이페이지에서 확인
                  가능합니다.
                </li>
                <li>
                  후원에 이미 사용한 넛츠는 구매 취소 및 환불이 불가합니다.
                </li>
                <li>
                  웹을 통해 결제한 넛츠는 구매 후 7일 이내에 전액을 사용하지
                  않은 경우 1:1문의를 통해 취소 및 환불이 가능합니다(단, 잔여
                  수량이 100개 이하이거나 서비스에서 탈퇴한 경우, 환불은
                  불가합니다.)
                </li>
                <li>
                  미성년자가 법정대리인 동의 없이 계약을 체결한 경우, 미성년자
                  또는 법정대리인이 이를 취소할 수 있습니다.
                </li>
                <li>
                  유료서비스 구매에 따른 자세한 내용은 뮤지넛 유료서비스
                  이용약관을 따릅니다.
                </li>
              </ul>
            </AgreeContent>
          </ChargePaymentAgree>
        </ChargePopupFooter>
        <FinallyAgree isAgreed={isAgreed} totalPrice={totalPrice}>
          <ul>
            <li onClick={onClose}>취소</li>
            <li onClick={handleChargeClick}>충전하기</li>
          </ul>
          <NaverPayButton />
        </FinallyAgree>
      </ChargeContainer>
    </ChargeBackground>
  );
};

export default Charge;

// 충전 팝업의 바깥 배경
const ChargeBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
`;

// 충전 팝업 전체 컨테이너
const ChargeContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 화면의 정중앙 정렬을 위한 변형 */
  z-index: 200;
  background-color: white;
  color: black;
  width: 400px; /* 적절한 너비 설정 */
  max-width: 90%; /* 최대 너비 설정 */
  border-radius: 8px;
`;

// 충전 팝업 헤더 ----------------------------
const ChargePopupHeader = styled.div`
  border-bottom: 1px solid #ebedf3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

// 충전 팝업 헤더 텍스트
const HeaderText = styled.div`
  font-size: 16px;
  margin-left: 133px;
`;

// 충전 팝업 헤더 버튼
const HeaderButton = styled.button`
  font-family: "esamanru Bold";
  font-size: 14px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
// 충전 팝업 헤더 ----------------------------

// 충전 팝업 바디 ----------------------------
const ChargePopupBody = styled.div`
  padding: 25px 20px 12px 20px;
  border-bottom: 1px solid #ebedf3;
`;

// 충전 팝업 바디 박스
const OwnNutBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ebedf3;
  border-radius: 12px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.1),
    0 15px 10px 0 rgba(0, 0, 0, 0.03);
  padding: 15px 20px;
  margin-bottom: 15px;
`;

// 충전 팝업 바디 박스 내부 텍스트
const OwnNutText = styled.div`
  color: #525662;
  font-family: "esamanru Medium";
`;

// 충전 팝업 바디 박스 내부 이미지 + 보유중인 수량 데이터 값
const OwnNutImage = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
`;

// 충전 팝업 바디부분 충전 금액 박스
const ChargeNutBox = styled.div`
  display: flex;
  flex-direction: column; // 추가: 수직 정렬을 위해 flex-direction을 column으로 설정
  border: 1px solid #ebedf3;
  border-radius: 12px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.1),
    0 15px 10px 0 rgba(0, 0, 0, 0.03);
  padding: 15px 20px 5px 20px;
  margin-bottom: 15px;
`;

// 충전 팝업 바디부분 텍스트 + 인풋 박스 컨테이너
const ChargeNutTextInputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

// 충전 팝업 바디부분 텍스트
const ChargeNutText = styled.div`
  color: #525662;
  font-family: "esamanru Medium";
  margin-right: 20px;
`;

// 충전 팝업 바디부분 충전 금액 인풋 박스 및 설정
const ChargeNutInputBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 충전 팝업 인풋 박스를 감싸는 랩퍼
const ChargeNutInputWrapper = styled.div`
  position: relative;

  img {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
  }
  input {
    width: 150px;
    height: 39px;
    padding-left: 50px; // 좌측 여백을 이미지 너비에 맞춰서 설정
    padding-right: 10px; // 우측 여백 설정
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 17px;
    margin-left: auto;
    border: 1px solid #ebedf3;
    border-radius: 8px;
    background-color: #ebedf3;
    font-family: "esamanru Bold";

    &::placeholder {
      font-size: 12px;
      color: #aeb4c2; // placeholder 색상 추가 가능
      font-family: "esamanru Light";
    }
  }
`;

// 충전 팝업 바디부분 충전 넛츠 갯수 설정
const ChargeNutAmount = styled.div`
  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 0;
    list-style-type: none;
    margin-top: 10px;
    li {
      flex: 1 1 auto;
      margin: 5px;
      padding: 5px 0;
      border: 1px solid #ebedf3;
      border-radius: 30px;
      background-color: #ebedf3;
      text-align: center;
      cursor: pointer;
      font-family: "esamanru Medium";
    }
  }
`;
// 충전 팝업 바디 ----------------------------

// 충전 팝업 푸터 ----------------------------
const ChargePopupFooter = styled.div`
  padding: 0px 20px 10px 20px;
`;

// 충전 팝업 결제
const ChargePayment = styled.div`
  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 0 10px;
  }

  li:nth-child(1) {
    font-family: "esamanru Medium";
    color: #525662;
  }
`;

// 충전 팝업 결제 동의
const ChargePaymentAgree = styled.div`
  border: 1px solid #ebedf3;
  border-radius: 12px;
  padding: 10px 0;
  background-color: #ebedf3;
`;

// 충전 팝업 결제 동의 체크박스 + 텍스트 + 화살표
const AgreeCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;

// 결제 동의 체크박스
const AgreeCheckbox = styled.input`
  appearance: none; // 기본 체크박스 스타일 제거
  width: 20px;
  height: 20px;
  margin-right: 6px;
  background-color: #fff;
  border: 2px solid #aeb4c2;
  border-radius: 6px;
  position: relative; // 상대적 위치 설정

  &:checked {
    background-color: #16be78; // 체크되었을 때 배경색 변경
    border-color: #16be78; // 체크되었을 때 테두리 색 변경
  }

  &:checked::after {
    content: "✔️";
    position: absolute;
    top: -1px;
    left: 0.5px;
    font-size: 12px;
  }
`;

// 결제 동의 내부 텍스트
const AgreeText = styled.label`
  font-family: "esamanru Medium";
  font-size: 14px;
`;

// 결제 동의 내부 화살표
const AgreeArrow = styled.div`
  margin-top: 5px;
`;

// 결제 동의 상세 내역
const AgreeContent = styled.div<{ show: number }>`
  display: ${(props) => (props.show ? "block" : "none")};

  ul {
    overflow-y: auto;
    max-height: 250px;
    padding: 0 15px;
    margin: 5px 20px 0px 20px;
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: -0.3px;
    color: #525662;
    font-family: "esamanru Medium";
  }

  li {
    position: relative;
    padding-left: 9px;
  }
`;

// 결제 최종 동의
const FinallyAgree = styled.div<{ isAgreed: boolean; totalPrice: number }>`
  margin: 0 5px;
  padding: 7px 0 20px 0;

  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    list-style-type: none;
    padding: 0;
    margin: 0 15px;
  }

  li {
    flex: 1;
    text-align: center;
    font-size: 14px;
    background-color: #43eca684;
    color: rgb(0, 112, 71);
    line-height: 22px;
    vertical-align: top;
    padding: 12px;
    border-radius: 7px;
    width: calc(50% - 5px); /* 버튼 너비를 동일하게 설정 */
    cursor: pointer;

    &:nth-child(2) {
      ${({ isAgreed, totalPrice }) =>
        isAgreed &&
        totalPrice >= 1099 &&
        `
          background-color: #16be78;
          outline: #16be78;
        `}

      &:hover, &:focus {
        ${({ isAgreed, totalPrice }) =>
          isAgreed &&
          totalPrice >= 1099 &&
          `
            background-color: #16be78;
            outline: #16be78;
          `}
      }
    }
  }
`;

// 충전 팝업 푸터 ----------------------------

export { Charge };

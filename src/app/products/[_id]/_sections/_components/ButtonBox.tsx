"use client";

import Button from "@/components/Button";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useClientSession } from "@/hooks/_index";

export default function ButtonBox({
  id,
  amount,
  wishListStatus,
}: {
  id: string;
  amount: number[];
  wishListStatus: boolean;
}) {
  // 사이즈 드롭다운박스 제목 상태 관리
  const [selectedSize, setSelectedSize] = useState("사이즈를 선택해주세요");
  // 사이즈 드롭다운박스 리스트 상태 관리
  const [amountView, setAmountView] = useState(false);
  // useRef를 이용하여 외부 클릭 감지
  const wrapperRef = useRef<HTMLDivElement>(null);
  // 외부 클릭 시 드롭다운박스 닫기
  useOutsideClick(wrapperRef, () => setAmountView(false));
  // 사이즈 선택 시 드롭다운박스 제목 변경 함수
  const handleSizeSelection = (size: number) => {
    setSelectedSize(size + "ml");
    setAmountView(false);
  };

  /* 라우터 설정을 위한 useRouter 사용 */
  const router = useRouter();

  /* 구매 선택 페이지로 이동시키는 함수 */
  const navigateToBuyPage = () => {
    if (selectedSize === "사이즈를 선택해주세요") {
      alert("사이즈를 선택해주세요.");
    } else {
      // ml 문자열 제거
      const sizeWithoutUnit = selectedSize.replace("ml", "").trim();
      router.push(`/products/${id}/buy/?&amount=${sizeWithoutUnit}`);
    }
  };

  /* 판매 페이지로 이동시키는 함수 */
  // brand, name, amount, id를 쿼리스트링으로 넘겨줌
  const navigateToSellPage = () => {
    if (selectedSize === "사이즈를 선택해주세요") {
      alert("사이즈를 선택해주세요.");
    } else {
      // ml 문자열 제거
      const sizeWithoutUnit = selectedSize.replace("ml", "").trim();
      router.push(`/products/${id}/sell/?&amount=${sizeWithoutUnit}`);
    }
  };

  /* 위시리스트 추가+제거 함수 */
  const { getAccessToken, getUserSession } = useClientSession();
  const accessToken = getAccessToken();
  const userSession = getUserSession();
  const userId = userSession._id;

  const addWishList = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}bookmarks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            product_id: parseInt(id),
            user_id: userId,
            memo: "test",
          }),
          cache: "no-cache",
        }
      );
      if (!res.ok) {
        throw new Error("위시리스트 통신 실패");
      }
    } catch (error) {
      console.error("위시리스트 추가 중 오류:", error);
      throw error;
    }
  };

  const deleteWishList = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}bookmarks/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-cache",
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error("위시리스트 삭제 실패다 임마");
      }
    } catch (error) {
      console.error("위시리스트 삭제 중 오류:", error);
      throw error;
    }
  };

  const checkWishList = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}bookmarks/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-cache",
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error("위시리스트 조회 실패다 임마");
      }
    } catch (error) {
      console.error("위시리스트 조회 중 오류:", error);
      throw error;
    }
  };

  return (
    <>
      {/* 드롭다운 박스 */}
      <div ref={wrapperRef} className="mb-[16px] h-[46px] w-[560px]">
        <div>
          <button
            onClick={() => {
              setAmountView(!amountView);
            }}
            className="h-[46px] w-[560px] border border-primary bg-white pl-[20px] text-left font-medium text-primary hover:bg-secondary"
          >
            {selectedSize}
          </button>
        </div>
        {amountView && (
          <ul className="relative w-[560px] border-primary">
            {amount.map((amount) => (
              <li
                className="relative mt-[-1px] h-[46px] w-[560px] cursor-pointer border border-primary bg-white  text-primary hover:bg-secondary"
                key={amount}
                onClick={() => handleSizeSelection(amount)}
              >
                <p className="pl-[20px] text-left leading-[46px]">{amount}ml</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* 구매 판매 버튼 박스 */}
      <div className="mb-[16px] flex w-[560px]">
        <Button
          className="mr-[10px] h-[46px] w-[275px] border border-primary bg-white text-primary"
          label="바로 구매하기"
          type="button"
          onClick={navigateToBuyPage}
        ></Button>
        <Button
          className="h-[46px] w-[275px]"
          label="판매하기"
          type="button"
          onClick={navigateToSellPage}
        ></Button>
      </div>
      {/* 위시 리스트 버튼 */}
      <Button
        className="h-[46px] w-[560px] border border-primary bg-white text-primary"
        label={
          wishListStatus ? "위시 리스트에서 제거하기" : "위시 리스트에 추가하기"
        }
        type="button"
        onClick={() => (wishListStatus ? deleteWishList(id) : addWishList(id))}
      ></Button>
      <Button
        className="h-[46px] w-[560px] border border-primary bg-white text-primary"
        label="위시리스트 목록 체크"
        type="button"
        onClick={() => checkWishList()}
      ></Button>
    </>
  );
}

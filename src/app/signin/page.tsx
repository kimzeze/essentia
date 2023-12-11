"use client";

// 노드 모듈 / 외부 라이브러리 임포트
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postUserSignin } from "./_functions/_index";
import { useUserStore } from "@/stores/useUserStore";

// 프로젝트 내부 임포트
import { cn } from "@/utils/_index";

export default function SignIn() {
  /* 상태 */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);

  /* 전역상태 */
  const setUser = useUserStore((state) => state.setUser);

  /* 훅 */
  const router = useRouter();

  /* 이벤트 핸들러 */
  const handleInputValue = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = await postUserSignin({ email, password });

    if (data) {
      setUser(data);
      setMessage(false);
      alert("로그인에 성공했습니다!");
      router.push("/");
    } else {
      setMessage(true);
      alert("로그인에 실패했습니다!");
    }
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {/* 1.제목 */}
      <h2 className="mb-[57px] text-[36px] font-bold">로그인</h2>

      {/* 2.이메일과 비밀번호 */}
      <form className="flex w-[400px] flex-col" onSubmit={handleFormSubmit}>
        {/* 이메일 */}
        <div className="mb-[6px] flex flex-col">
          <label htmlFor="email" className="h-[32px] text-[14px] font-bold">
            이메일 주소
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleInputValue(setEmail)}
          />
          <div
            aria-live="polite"
            className={cn("hidden text-[12px] text-red-500", {
                block: message,
            })}
          >
            아이디를 확인해주세요
          </div>
        </div>

        {/* 비밀번호 */}
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleInputValue(setPassword)}
          />
          <div
            aria-live="polite"
            className={cn("hidden text-[12px] text-red-500", {
                block: message,
            })}
          >
            비밀번호를 확인해주세요
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="mb-[20px] h-[50px] bg-black text-[18px] font-bold text-white"
        >
          이메일로 로그인
        </button>
      </form>

      {/* 3. 회원가입 */}
      <div className="mb-[20px] flex w-[400px] items-center justify-around">
        <Link
          href="/signup"
          className="flex h-[32px] w-[100px] items-center justify-center text-[14px] font-medium"
        >
          이메일 회원가입
        </Link>
        <button
          type="button"
          className="h-[32px] w-[100px] text-[14px] font-medium"
        >
          이메일 찾기
        </button>
        <button
          type="button"
          className="h-[32px] w-[100px] text-[14px] font-medium"
        >
          비밀번호 찾기
        </button>
      </div>

      {/* 4. 라이브러리 회원가입 */}
      <div className="flex w-[400px] items-center justify-around">
        <button
          type="button"
          className="h-[50px] w-[190px] bg-[#FEE500] text-[14px] font-semibold"
        >
          카카오로 로그인
        </button>
        <button
          type="button"
          className="h-[50px] w-[190px] bg-[#03C75A] text-[14px] font-semibold text-white"
        >
          네이버로 로그인
        </button>
      </div>
    </main>
  );
}

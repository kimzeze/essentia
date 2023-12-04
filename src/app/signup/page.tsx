"use client";
import axios from "axios";
import React, { useState } from "react";
import Header from "@/components/Header";
import { AddressModal } from "@/components/_index";

export default function SignUp() {
  type AddressData = {
    address: string;
  };

  // Input 상태관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [address, setAddress] = useState("");

  // 유효성 상태 관리
  const [isEmailValid, setEmailValid] = useState(true);
  const [isEmailUnique, setEmailUnique] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);
  const [isPasswordCheckValid, setPasswordCheckValid] = useState(true);
  const [isNameValid, setNameValid] = useState(true);
  const [isPhoneValid, setPhoneValid] = useState(true);
  const [isBirthValid, setBirthValid] = useState(true);

  // 오류메세지 상태 관리
  const [showNameError, setShowNameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showPhoneError, setShowPhoneError] = useState(false);
  const [showPasswordCheckError, setShowPasswordCheckError] = useState(false);
  const [showBirthError, setShowBirthError] = useState(false);

  // 중복확인 했는지 유무 상태 관리
  const [hasCheckedDuplication, setHasCheckedDuplication] = useState(false);

  // 주소 API 관련 상태 관리
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  // 회원가입 제출 통신
  const sendPostRequest = async () => {
    const type = "seller";
    try {
      const response = await axios.post("https://localhost/api/users/", {
        email,
        password,
        name,
        type,
        phone,
        address,
      });
      console.log(response.data);
    } catch (error) {
      console.error("회원가입 제출 통신 에러 발생", error);
    }
  };

  // 이메일 중복확인 통신
  const checkEmailDuplication = async () => {
    try {
      const res = await axios.get(
        `https://localhost/api/users/email?email=${email}`
      );
      setEmailUnique(true);
      setShowEmailError(false);
      setHasCheckedDuplication(true);
      console.log(res);
      console.log("사용가능한 이메일입니다");
    } catch (error) {
      if (error instanceof Error) {
        if (error.response && error.response.status === 409) {
          // Handle duplicate email case
          setEmailUnique(false);
          setShowEmailError(true);
          console.log("중복된 이메일입니다.");
        } else {
          // Handle other errors
          console.error("이메일 중복확인 에러 ", error.message);
        }
      } else {
        console.error("알 수 없는 오류 발생", error);
      }
    }
  };

  // 이름 유효성 검사 (한글만 허용)
  const validateName = (name: string) => {
    return /^[가-힣]+$/.test(name);
  };

  // 생년월일 유효성 검사 (1900 ~2023년생까지 가능)
  const validateBirth = (birth: string) => {
    return (
      /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(birth) &&
      parseInt(birth.substring(0, 4)) >= 1900 &&
      parseInt(birth.substring(0, 4)) <= 2023
    );
  };

  // 이메일 유효성 검사
  // 조건 1. 올바른 이메일 형식
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  //  비밀번호 유효성 검사
  // 조건 1. 10글자 이상 16글자 이하
  // 조건 2. 영문자와 숫자 또는 특수문자가 포함되어야 한다
  const validatePassword = (password: string) => {
    const isValidLength = password.length >= 10 && password.length <= 16;
    const isValidComplexity = /^(?=.*[a-zA-Z])(?=.*[\d\W])/.test(password);
    return isValidLength && isValidComplexity;
  };

  // 휴대폰번호 유효성
  // 조건 1. 010으로 시작하는 11자리 숫자
  const validatePhone = (phone: string) => {
    return /^010\d{8}$/.test(phone);
  };

  // 핸들러 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    const isValid = validateEmail(emailValue);
    setEmailValid(isValid);
    setShowEmailError(!isValid);
    setEmail(emailValue);
    setEmailUnique(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    const isValid = validatePassword(passwordValue);
    setPasswordValid(isValid);
    setShowPasswordError(!isValid);
    setPassword(passwordValue);
  };

  const handlePasswordCheckChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const passwordCheckValue = e.target.value;
    const isValid = password === passwordCheckValue;
    setPasswordCheck(passwordCheckValue);
    setPasswordCheckValid(isValid);
    setShowPasswordCheckError(!isValid);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value;
    const isValid = validateName(nameValue);
    setNameValid(isValid);
    setShowNameError(!isValid);
    setName(nameValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    const isValid = validatePhone(phoneValue);
    setPhoneValid(isValid);
    setShowPhoneError(!isValid);
    setPhone(phoneValue);
  };

  const handleBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const birthValue = e.target.value;
    const isValid = validateBirth(birthValue);
    setBirthValid(isValid);
    setShowBirthError(!isValid);
    setBirth(birthValue);
  };

  const handleAddressChange = (data: AddressData) => {
    setAddress(data.address);
    setAddressModalOpen(false);
  };

  // 회원가입 폼 제출 함수
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 각 입력 필드가 비어 있는지 검사
    const isEmailEmpty = !email.trim();
    const isPasswordEmpty = !password.trim();
    const isPasswordCheckEmpty = !passwordCheck.trim();
    const isNameEmpty = !name.trim();
    const isPhoneEmpty = !phone.trim();
    const isBirthEmpty = !birth.trim();
    const isAddressEmpty = !address.trim();

    // 유효성 상태와 오류 메시지 상태 업데이트
    setEmailValid(!isEmailEmpty);
    setPasswordValid(!isPasswordEmpty);
    setNameValid(!isNameEmpty);
    setPhoneValid(!isPhoneEmpty);
    setBirthValid(!isBirthEmpty);

    // 오류 메시지 표시
    setShowEmailError(isEmailEmpty);
    setShowPasswordError(isPasswordEmpty);
    setShowNameError(isNameEmpty);
    setShowPhoneError(isPhoneEmpty);
    setShowBirthError(isBirthEmpty);
    setShowPasswordCheckError(isPasswordCheckEmpty);

    // 모든 인풋이 유효한 경우에만 요청 보내기
    if (
      !isEmailEmpty &&
      isEmailUnique &&
      !isPasswordEmpty &&
      !isNameEmpty &&
      !isPhoneEmpty &&
      !isBirthEmpty &&
      !isAddressEmpty
    ) {
      sendPostRequest();
    }
  };

  return (
    <div>
      <Header />
      <main className="flex flex-col items-center pt-[120px]">
        <h2 className="mb-[66px] text-36 font-bold">회원가입</h2>

        <form onSubmit={handleSubmit} className="flex w-[400px] flex-col">
          {/* 이메일 주소 */}
          <label htmlFor="email">
            로그인에 사용할 이메일 주소를 입력해주세요
          </label>
          <input
            id="email"
            type="email"
            aria-errormessage="emailError"
            aria-invalid={!isEmailValid}
            onChange={handleEmailChange}
            placeholder="example@essentia.co.kr"
          />
          <button type="button" onClick={checkEmailDuplication}>
            중복 확인
          </button>
          {showEmailError && !isEmailUnique && (
            <div id="emailError" aria-live="polite" className="text-red-500">
              중복된 이메일입니다.
            </div>
          )}
          {isEmailValid && isEmailUnique && hasCheckedDuplication && (
            <div className="text-green-500">사용 가능한 이메일입니다.</div>
          )}
          {/* 이메일 오류 경고창 */}
          {showEmailError && (
            <div id="emailError" aria-live="polite" className="text-red-500">
              이메일 오류 메세지
            </div>
          )}

          {/* 비밀번호 */}
          <label htmlFor="password">사용할 비밀번호를 입력해주세요</label>
          <input
            id="password"
            type="password"
            aria-errormessage="passwordError"
            aria-invalid={!isPasswordValid}
            onChange={handlePasswordChange}
            placeholder="영문 대/소문자, 숫자 및 특수문자를 포함한 비밀번호"
          />
          {showPasswordError && (
            <div id="passwordError" aria-live="polite" className="text-red-500">
              비밀번호 오류 메세지
            </div>
          )}
          {/* 비밀번호 확인 */}
          <input
            id="passwordCheck"
            type="password"
            aria-errormessage="passwordCheckError"
            aria-invalid={!isPasswordCheckValid}
            onChange={handlePasswordCheckChange}
            placeholder="비밀번호 확인"
          />
          {/* 비밀번호 확인 오류 경고창 */}
          {showPasswordCheckError && (
            <div
              id="passwordCheckError"
              aria-live="polite"
              className="text-red-500"
            >
              비밀번호가 일치하지 않습니다.
            </div>
          )}

          {/* 이름 & 휴대폰번호 */}
          <label htmlFor="name">이름과 휴대폰 번호를 입력해주세요</label>
          <input
            id="name"
            type="text"
            aria-errormessage="nameError"
            aria-invalid={!isNameValid}
            onChange={handleNameChange}
            placeholder="이름 (한글만 입력)"
          />
          {showNameError && (
            <div id="nameError" aria-live="polite" className="text-red-500">
              한글 이름을 입력해주세요.
            </div>
          )}
          <label htmlFor="phone"></label>
          <input
            id="phone"
            type="tel"
            aria-errormessage="phoneError"
            aria-invalid={!isPhoneValid}
            onChange={handlePhoneChange}
            placeholder="휴대폰 번호('_')제외"
          />
          {/* 휴대폰번호 오류 경고창*/}
          {showPhoneError && (
            <div id="phoneError" aria-live="polite" className="text-red-500">
              휴대폰 번호 오류 메세지
            </div>
          )}

          {/* 생년월일 */}
          <input
            id="birth"
            type="text"
            aria-errormessage="birthError"
            aria-invalid={!isBirthValid}
            onChange={handleBirthChange}
            placeholder="예) 19990707"
          />
          {showBirthError && (
            <div id="birthError" aria-live="polite" className="text-red-500">
              올바른 생년월일을 입력해주세요 (1900~2023년도).
            </div>
          )}

          {/* 주소 */}
          <label htmlFor="address">주소를 입력해주세요</label>
          <input
            id="address"
            type="text"
            aria-errormessage="addressError"
            placeholder="도로명 주소를 입력해주세요"
            value={address}
            readOnly
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="button" onClick={() => setAddressModalOpen(true)}>
            주소 검색
          </button>
          <AddressModal
            isOpen={isAddressModalOpen}
            onClose={() => setAddressModalOpen(false)}
            onSelectAddress={handleAddressChange}
          />
          <label htmlFor="addressDetail"></label>
          <input
            id="addressDetail"
            type="text"
            aria-errormessage="addressError"
            placeholder="상세 주소를 입력해주세요"
          />
          {/* 주소 오류 경고창*/}
          <div id="addressError" aria-live="polite">
            주소 오류 메세지
          </div>

          <button type="submit">회원가입 완료</button>
        </form>
      </main>
    </div>
  );
}

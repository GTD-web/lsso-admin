/**
 * API 유틸리티 함수 모음
 */

/**
 * UUID v4 형식의 랜덤 ID를 생성합니다.
 * @returns {string} 랜덤 ID 문자열
 */
export function generateRandomId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 지정된 범위 내의 랜덤 정수를 생성합니다.
 * @param min 최소값 (포함)
 * @param max 최대값 (포함)
 * @returns 랜덤 정수
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 날짜를 한국어 형식으로 포맷팅합니다.
 * @param dateString ISO 형식의 날짜 문자열
 * @param options 포맷 옵션
 * @returns 포맷된 날짜 문자열
 */
export function formatKoreanDate(
  dateString?: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  } catch {
    return dateString;
  }
}

/**
 * 날짜 데이터를 받아서 요일을 출력
 * @param start_time
 */
export function getDayOfWeek(start_time: string) {
  // Parse the date and time
  const [date, time] = start_time.split(' ');
  const [year, month, day] = date.split('-');
  const [hour, minute, second] = time.split(':');

  // Create a Date object (note that months are zero-indexed in JavaScript)
  const dt = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour)),
  );

  // Get the day of week
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return daysOfWeek[dt.getUTCDay()];
}

/**
 * 비밀번호나 아이디 난수 생성
 * @param length
 */
export function generateIdOrPw(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

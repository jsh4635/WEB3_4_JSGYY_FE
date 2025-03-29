export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth =
    (now.getFullYear() - date.getFullYear()) * 12 +
    now.getMonth() -
    date.getMonth();

  if (diffMonth >= 1) {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } else if (diffDay >= 1) {
    return `${diffDay}일 전`;
  } else if (diffHour >= 1) {
    return `${diffHour}시간 전`;
  } else if (diffMin >= 1) {
    return `${diffMin}분 전`;
  } else {
    return "방금 전";
  }
};

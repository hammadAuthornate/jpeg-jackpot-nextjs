export default function formatTimeLeft(timeLeft: number) {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(timeLeft % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

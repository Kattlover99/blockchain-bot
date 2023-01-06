export const asyncSleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export function randomNumber(min: number, max: number) {
  return (Math.round(Math.random() * (max - min)) + min);
}

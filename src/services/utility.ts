// Calculate user quiz percentage
export const calculatePercentage = (number: number) => {
  // Divided by 10 cause ten is the number of questions users answered
  const divide = number / 3;
  const finalPercent = divide * 100;
  const round = Math.floor(finalPercent);

  return round;
};

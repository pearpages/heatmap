import type { ContributionData } from './models';

const getLevel = (count: number): ContributionData['level'] => {
  let level: 0 | 1 | 2 | 3 | 4 = 0;
  if (count === 0) level = 0;
  else if (count <= 2) level = 1;
  else if (count <= 5) level = 2;
  else if (count <= 8) level = 3;
  else level = 4;

  return level;
};

export { getLevel };

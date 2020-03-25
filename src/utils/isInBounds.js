export const isInBounds = (coordinate, bounds) => {
  if (coordinate >= bounds[0] && coordinate <= bounds[1]) {
    return true;
  }
  return false;
};

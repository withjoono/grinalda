export const korCond = value => {
  if (value > 76 || value < 0) {
    return false;
  } else {
    return true;
  }
};

export const comKorCond = value => {
  if (value > 24 || value < 0) {
    return false;
  } else {
    return true;
  }
};

export const matCond = value => {
  if (value > 74 || value < 0) {
    return false;
  } else {
    return true;
  }
};

export const comMatCond = value => {
  if (value > 26 || value < 0) {
    return false;
  } else {
    return true;
  }
};

export const engCond = value => {
  if (value > 100 || value < 0) {
    return false;
  } else {
    return true;
  }
};

export const fiftyNumCond = value => {
  if (value > 50 || value < 0) {
    return false;
  } else {
    return true;
  }
};

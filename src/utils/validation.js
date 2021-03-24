import T from '../i18n';

export const validateEmail = email => {
  let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
};

export const validatePhone = phone => {
  let pattern = /^(\+\d{3})?\d{9}$/;
  return pattern.test(phone);
};

export const validateFloatNumbers = number => {
  let pattern = /^\s*[+]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/;
  return pattern.test(number);
};

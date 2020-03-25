export const getProperError = error => {
  let errorMessage = '';
  switch (error) {
    case 'NotMarked':
      errorMessage = 'NotMarked';
      break;
    case 'IsBan':
      errorMessage = 'IsBan';
      break;
    case 'InRepair':
      errorMessage = 'InRepair';
      break;
    case 'InTransfer':
      errorMessage = 'InTransfer';
      break;
    case 'AccessDenied':
      errorMessage = 'AccessDenied';
      break;
    default:
      break;
  }
  return errorMessage;
};

export const getProperErrorMessage = error => {
  let errorMessage = '';
  switch (error) {
    case 'NotMarked':
      errorMessage = 'ТМЦ не маркирован';
      break;
    case 'IsBan':
      errorMessage = 'ТМЦ уже списан';
      break;
    case 'InRepair':
      errorMessage = 'ТМЦ находится в сервисе';
      break;
    case 'InTransfer':
      errorMessage = 'ТМЦ в активной заявке';
      break;
    case 'AccessDenied':
      errorMessage = 'В доступе отказано';
      break;
    default:
      break;
  }
  return errorMessage;
};

// Global Errors
// LinkIsUnavailable
// RequiredField
// AccessDenied
// NotFound
// LimitExceeded

// Auth Errors
// EmailMustBeUnique
// UserNotFound
// EmailUnApproved
// PasswordIncorrect

// Mark ERRORS
// QRCodeUnavailable
// QRCodeUsed

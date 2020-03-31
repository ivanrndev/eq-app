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
    case 'ValidationError':
      errorMessage = 'ValidationError';
      break;
    case 'QRCodeUnavailable':
      errorMessage = 'QRCodeUnavailable';
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
    case 'ValidationError':
      errorMessage = 'Ошибка валидации';
      break;
    case 'QRCodeUnavailable':
      errorMessage = 'Этот Qr-код сейчас недоступен для вашей компании';
      break;
    default:
      break;
  }
  return errorMessage;
};

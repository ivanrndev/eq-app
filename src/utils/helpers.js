export const getDescription = (tx, role) => {
  switch (+tx.type) {
    case 0:
      return 'Создано ТМЦ';
    case 1:
      return `ТМЦ Маркировано QR-кодом ${tx.data.code}`;
    case 2:
      if (tx.data.sender.role === role) {
        return `${tx.data.sender.firstName} выдал ${tx.item.code} ${
          tx.data.recipient.firstName
        }`;
      } else {
        return `${tx.data.recipient.firstName} принял ${tx.item.code} от ${
          tx.data.sender.firstName
        }`;
      }
    case 3:
      return `ТМЦ ${tx.item.code} отправленно в сервис по причине "${
        tx.data.description
      }", местоположение сервиса "${tx.data.place}"`;
    case 4:
      return `ТМЦ ${tx.item.code} было списано`;
    case 5:
      return `ТМЦ ${tx.item.code} было возвращено из сервиса`;
    default:
      return 'Неизвестная операция';
  }
};

export const getStatus = (item, role) => {
  if (item.is_ban) {
    return 'Списано';
  }
  if (item.repair) {
    return 'Отправлено в сервис';
  }
  if (item.transfer) {
    return 'В процессе передачи';
  }
  if (item.person) {
    if (item.person.role === role) {
      return 'У кладовщика';
    } else {
      return 'Передано МОЛ';
    }
  }
  if (item.is_marked) {
    return 'Маркировано';
  }
  return 'Не распределено';
};

export const getProperError = error => {
  let errorMessage = '';
  switch (error) {
    case 'NotFound':
      errorMessage = 'NotFound';
      break;
    case 'Forbidden':
      errorMessage = 'Forbidden';
      break;
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
    case 'AccessError':
      errorMessage = 'AccessError';
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
    case 'QRCodeUsed':
      errorMessage = 'QRCodeUsed';
      break;
    case 'LinkIsUnavailable':
      errorMessage = 'LinkIsUnavailable';
      break;
    case 'LimitExceeded':
      errorMessage = 'LimitExceeded';
      break;
    case 'EmailMustBeUnique':
      errorMessage = 'EmailMustBeUnique';
      break;
    case 'UserNotFound':
      errorMessage = 'UserNotFound';
      break;
    case 'EmailUnApproved':
      errorMessage = 'EmailUnApproved';
      break;
    case 'PasswordIncorrect':
      errorMessage = 'PasswordIncorrect';
      break;
    default:
      break;
  }
  return errorMessage;
};

export const getProperErrorMessage = (error, id) => {
  let errorMessage = '';
  switch (error) {
    case 'NotFound':
      errorMessage = `Введенный идентификатор "${id}" не найден в базе`;
      break;
    case 'NotMarked':
      errorMessage = 'ТМЦ не промаркировано';
      break;
    case 'IsBan':
      errorMessage = `Данное ТМЦ ${id} уже была списано с производства ранее`;
      break;
    case 'InRepair':
      errorMessage = `Введенный идентификатор ${id} уже отправлен в сервис`;
      break;
    case 'InTransfer':
      errorMessage = `Введенный идентификатор ${id} включен в заявку на передачу ТМЦ `;
      break;
    case 'AccessError':
      errorMessage = 'У Вас нет доступа к этой ТМЦ';
      break;
    case 'AccessDenied':
      errorMessage = `Вы не являетесь Владелецем ТМЦ ${id}. Для осуществления операции вначале получите данное ТМЦ `;
      break;
    case 'ValidationError':
      errorMessage = 'ValidationError текст';
      break;
    case 'QRCodeUnavailable':
      errorMessage = `Введенный идентификатор ${id} использован, или не пренадлежит этой компании`;
      break;
    case 'QRCodeUsed':
      errorMessage = `Введенный идентификатор ${id} уже закреплен за другим ТМЦ`;
      break;
    case 'LinkIsUnavailable':
      errorMessage = 'Ссылка недоступна';
      break;
    case 'LimitExceeded':
      errorMessage = 'Превышен лимит вашего текущего плана';
      break;
    case 'EmailMustBeUnique':
      errorMessage = 'Email должен быть уникальным';
      break;
    case 'UserNotFound':
      errorMessage = 'Пользователь не найден';
      break;
    case 'EmailUnApproved':
      errorMessage = 'Email не подтвержден';
      break;
    case 'PasswordIncorrect':
      errorMessage = 'Неверный пароль';
      break;
    case 'Forbidden':
      errorMessage = `Вы не являетесь Владелецем ${id}. Для осуществления операции вначале получите данное ТМЦ `;
      break;
    default:
      break;
  }
  return errorMessage;
};

export const getProperTransferStatus = error => {
  let errorMessage = '';
  switch (error) {
    case 'true':
      errorMessage = 'Заявка создана';
      break;
    case 'complete':
      errorMessage = 'Завершено';
      break;
    case 'pending':
      errorMessage = 'В ожидании подтверждения';
      break;
    case 'rejected':
      errorMessage = 'Заявка отклонена';
      break;
    case 'error':
      errorMessage = 'Не удалось';
      break;
    default:
      break;
  }
  return errorMessage;
};

export const getProperErrorTransfer = (error, id) => {
  let errorMessage = '';
  switch (error) {
    case 'IsBan':
      errorMessage = `ТМЦ "${id}" уже была списано с производства ранее.`;
      break;
    case 'InRepair':
      errorMessage = `ТМЦ "${id}" находится в сервисе.`;
      break;
    case 'InTransfer':
      errorMessage = `ТМЦ "${id}" включен в другую заявку на передачу ТМЦ.`;
      break;
    case 'AccessDenied':
      errorMessage = `Вы не являетесь Владелецем "${id}". Для осуществления операции вначале получите данное ТМЦ.`;
      break;
    case 'NotFound':
      errorMessage = `Введенный идентификатор "${id}" не найден в базе.`;
      break;
    case 'RecipientIsHolder':
      errorMessage = `ТМЦ "${id}" уже у выбранного МОЛ.`;
      break;
    case 'Copy':
      errorMessage = `Введенный идентификатор "${id}" уже добавлен в лист передачи ТМЦ`;
      break;
    case 'Forbidden':
      errorMessage = `Вы не являетесь Владелецем ${id}. Для осуществления операции вначале получите данное ТМЦ `;
      break;
    default:
      return 'Неизвестная операция';
  }
  return errorMessage;
};

export const actionCheckError = item => {
  // пустая заявка
  // NotFound
  if (item.is_ban) {
    return 'IsBan';
  }
  if (item.repair) {
    return 'InRepair';
  }
  if (item.transfer) {
    return 'InTransfer';
  }
  if (!item.is_marked) {
    return 'NotMarked';
  }
};

export const getInventoryMesageError = (error, id) => {
  if (error === 'IsBan') {
    return `ТМЦ "${id}" уже была списано с производства ранее.`;
  }
  if (error === 'InRepair') {
    return `ТМЦ "${id}" находится в сервисе.`;
  }
  if (error === 'NotFound') {
    return `Введенный идентификатор "${id}" не найден в базе.`;
  }
  if (error === 'Duplicate') {
    return `Введенный идентификатор "${id}" уже был добавлен в инвентаризационную ведомость`;
  }
};

export const ucFirst = str => {
  if (!str) {
    return str;
  }
  return str[0].toLowerCase() + str.slice(1);
};

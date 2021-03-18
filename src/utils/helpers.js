/* eslint-disable prettier/prettier */
import T from '../i18n';

export const getDescription = (tx, role, id, parent) => {
  switch (+tx.type) {
    case 0:
      return T.t('transaction_add');
    case 1:
      return `${T.t('transaction_mark')} ${tx.data.code}`;
    case 2:
      if (tx.data.sender.role === role) {
        return `${tx.data.sender.firstName} ${T.t('transaction_gave')} ${
          tx.item.code
        } ${T.t('transaction_gave_to')} ${tx.data.recipient.firstName}`;
      } else {
        return `${tx.data.recipient.firstName} ${T.t('transaction_accepted')} ${
          tx.item.code
        } ${T.t('transaction_from')} ${tx.data.sender.firstName}`;
      }
    case 3:
      return `${T.t('item')} ${tx.item.code} ${T.t('sent_to_services')} "${
        tx.data.description
      }", ${T.t('service_location')} "${tx.data.place}"`;
    case 4:
      return `${T.t('item')} ${tx.item.code} ${T.t('was_write_off')}`;
    case 5:
      return `${T.t('item')} ${tx.item.code} ${T.t('was_back_services')}`;
    case 6:
      return parent ? `${T.t('eqp_one')}: ${id}` : `${T.t('eqp_three')}: ${id}`;
    case 7:
      return parent ? `${T.t('eqp_two')}: ${id}` : `${T.t('eqp_four')}: ${id}`;
    case 8:
      return `${T.t('status_change_quantity')}`;
    case 9:
      return `${T.t('status_change_price')}`;
    case 10:
      return `${T.t('status_change_price_total')}`;
    case 11:
      return `${T.t('status_separate')}`;
    case 12:
      return `${T.t('status_merge')}`;
    case 13:
      return `${T.t('status_add_to_transfer')}`;
    default:
      return T.t('unknown_operation');
  }
};

export const getStatus = (item, role) => {
  if (item.is_ban) {
    return T.t('ban');
  }
  if (item.repair) {
    return T.t('status_services');
  }
  if (item.transfer) {
    return T.t('during_transfer');
  }
  if (item.person) {
    if (item.person.role === role) {
      return T.t('status_storekeeper');
    } else {
      return T.t('status_person');
    }
  }
  if (item.is_marked) {
    return T.t('status_marked');
  }
  return T.t('status_undefined');
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
      errorMessage = `${T.t('error_code_incorrect')} "${id}" ${T.t(
        'error_not_found',
      )}`;
      break;
    case 'NotMarked':
      errorMessage = T.t('error_not_marked');
      break;
    case 'IsBan':
      errorMessage = `${T.t('item')} ${id} ${T.t('error_write_off')}`;
      break;
    case 'InRepair':
      errorMessage = `${T.t('error_code_incorrect')} ${id} ${T.t(
        'error_services',
      )}`;
      break;
    case 'InTransfer':
      errorMessage = `${T.t('error_code_incorrect')} ${id} ${T.t(
        'error_already_in',
      )}`;
      break;
    case 'AccessError':
      errorMessage = T.t('error_forbidden');
      break;
    case 'AccessDenied':
      errorMessage = `${T.t('error_owner')} ${id}. ${T.t('error_owner_text')} `;
      break;
    case 'ValidationError':
      errorMessage = 'Validation Error';
      break;
    case 'QRCodeUnavailable':
      errorMessage = `${T.t(
        'error_code_incorrect',
      )} ${id} использован, или не пренадлежит этой компании`;
      break;
    case 'QRCodeUsed':
      errorMessage = `${T.t(
        'error_code_incorrect',
      )} ${id} уже закреплен за другим ТМЦ`;
      break;
    case 'LinkIsUnavailable':
      errorMessage = T.t('error_link');
      break;
    case 'LimitExceeded':
      errorMessage = T.t('error_limit_exceeded');
      break;
    case 'EmailMustBeUnique':
      errorMessage = T.t('error_email_must_be_unique');
      break;
    case 'UserNotFound':
      errorMessage = T.t('error_user_not_found');
      break;
    case 'EmailUnApproved':
      errorMessage = T.t('error_email_un_approved');
      break;
    case 'PasswordIncorrect':
      errorMessage = T.t('error_password_incorrect');
      break;
    case 'Forbidden':
      errorMessage = `${T.t('error_owner')} ${id}. ${T.t('error_owner_text')} `;
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
      errorMessage = T.t('title_request_created');
      break;
    case 'complete':
      errorMessage = T.t('status_transfer_complete');
      break;
    case 'pending':
      errorMessage = T.t('status_transfer_pending');
      break;
    case 'rejected':
      errorMessage = T.t('status_application_rejected');
      break;
    case 'error':
      errorMessage = T.t('status_transfer_failed');
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
      errorMessage = `${T.t('item')} "${id}" ${T.t('error_write_off')}`;
      break;
    case 'InRepair':
      errorMessage = `${T.t('item')} "${id}" ${T.t('error_services')}`;
      break;
    case 'InTransfer':
      errorMessage = `${T.t('item')} "${id}" ${T.t('error_another')}.`;
      break;
    case 'AccessDenied':
      errorMessage = `${T.t('error_owner')} "${id}". ${T.t(
        'error_owner_text',
      )}`;
      break;
    case 'NotFound':
      errorMessage = `${T.t('error_code_incorrect')} "${id}" ${T.t(
        'error_not_found',
      )}`;
      break;
    case 'RecipientIsHolder':
      errorMessage = `${T.t('item')} "${id}" ${T.t('error_already_mol')}`;
      break;
    case 'Copy':
      errorMessage = `${T.t('error_code_incorrect')} "${id}" ${T.t(
        'error_already_added',
      )}`;
      break;
    case 'Forbidden':
      errorMessage = `${T.t('error_owner')} ${id}. ${T.t('error_get_item')} `;
      break;
    case 'Duplicate':
      errorMessage = `${T.t('error_code_incorrect')} "${id}" ${T.t(
        'error_was_added',
      )}`;
      break;
    case 'DuplicateMount':
      errorMessage = `${T.t('inList')}`;
      break;
    default:
      // return T.t('unknown_operation');
      return '';
  }
  return errorMessage;
};

export const actionCheckError = item => {
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
    return `${T.t('item')} "${id}" ${T.t('error_write_off')}`;
  }
  if (error === 'InRepair') {
    return `${T.t('item')}  "${id}" ${T.t('error_services')}`;
  }
  if (error === 'NotFound') {
    return `${T.t('error_code_incorrect')} "${id}" ${T.t('error_not_found')}`;
  }
  if (error === 'Duplicate') {
    return `${T.t('error_code_incorrect')} "${id}" ${T.t('error_was_added')}`;
  }
};

export const ucFirst = str => {
  if (!str) {
    return str;
  }
  return str[0].toLowerCase() + str.slice(1);
};

export const fontSizer = screenWidth => {
  if (screenWidth > 400) {
    return 17;
  } else if (screenWidth > 250) {
    return 14;
  } else {
    return 12;
  }
};

export const getForgotEmailMesage = text => {
  if (text === 'NotNow') {
    return `${T.t('not_now')}`;
  }
  if (text === 'NotFound') {
    return `${T.t('not_found')}`;
  }
  if (text === 'SUCESS') {
    return `${T.t('sucess_reset_pass')}`;
  }
};

export const getTotalLotPrice = (quantity, price) => {
  const lotPrice = Number(price * quantity);
  return Number.isInteger(lotPrice) ? lotPrice : lotPrice.toFixed(2);
};

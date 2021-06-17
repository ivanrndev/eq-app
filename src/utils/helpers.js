/* eslint-disable prettier/prettier */
import T from '../i18n';
import {
  currentScan,
  getSearchItem,
  loader,
  saveCurrentMyItem,
} from '../actions/actions';

export const getUserName = (user: any) => {
  let name = '';

  if (user.firstName) {
    name += user.firstName;
  }

  if (user.lastName) {
    name += ' ' + user.lastName;
  }

  if (!user.firstName && !user.lastName && user.email) {
    name += user.email;
  }

  return name;
};
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
      return `${T.t('user')}  ${tx.user.firstName ||
        tx.user.email} изменил количество ТМЦ с ${tx.data.prevQuantity} ${
        tx.data.units
      } на ${tx.data.newQuantity} ${tx.data.units}`;
    case 9:
      return `${T.t('user')} ${tx.user.firstName ||
        tx.user.email} изменил цену за единицу ТМЦ с ${tx.data.prevPrice} на ${
        tx.data.newPrice
      }`;
    case 10:
      return `${T.t('user')} ${tx.user.firstName ||
        tx.user.email} изменил общую стоимость ТМЦ с ${tx.data.prevPrice} на ${
        tx.data.newPrice
      }`;
    case 11:
      return ` ${T.t('user')} ${tx.user.firstName} ${tx.user.lastName} ${T.t(
        'transaction_gave',
      )} ${tx.data.quantity} ${T.t('item')}${T.t('status_separate')} ${
        tx.data.metadata.title
      } ${tx.data.metadata.brand} ${tx.data.metadata.model}`;

    case 12:
      return `${T.t('user')} ${tx.user.firstName ||
        tx.user.email} вернул ранее расформированное ТМЦ ${
        tx.data.batch
          ? `в количестве ${tx.data.batch.quantity} ${tx.data.batch.units}`
          : ''
      }, в текущую родительскую ТМЦ.`;
    case 13:
      return `${T.t('status_add_to_transfer')} ${getUserName(
        tx.data.sender,
      )} к ${getUserName(tx.data.recipient)}`;
    case 14:
      if (tx.data.complete) {
        return `${tx.user.firstName} ${tx.user.lastName} ${T.t(
          'operation_remove_from_transfer_complete',
        )}`;
      } else {
        return `${tx.user.firstName} ${tx.user.lastName} ${T.t(
          'operation_remove_from_transfer',
        )}`;
      }
    case 15:
      return `
          ${T.t('operation_location_from')} ${
        tx.data.from && tx.data.from.object
          ? `с ${tx.data.from.object || ''}`
          : ''
      } ${
        tx.data.from && tx.data.from.location
          ? `(${tx.data.from.location})`
          : ''
      }
          ${T.t('operation_location_to')} ${
        tx.data.to && tx.data.to.location ? tx.data.to.object : ''
      } ${tx.data.to && tx.data.to.location ? `(${tx.data.to.location})` : ''}
        `;
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

export const getProperErrorTransfer = (error, id, isGive = true) => {
  let errorMessage = '';
  switch (error) {
    case 'IsBan':
      errorMessage = `${T.t('item')} "${id}" ${T.t('error_write_off')}`;
      break;
    case 'InRepair':
      errorMessage = `${T.t('item')} "${id}" ${T.t('error_services')}`;
      break;
    case 'InTransfer':
      if (!isGive) {
        errorMessage = `${T.t('item')} "${id}" ${T.t('error_another')}.`;
      }
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

export const actionCheckError = (item, isOwner = false) => {
  if (item.is_ban) {
    return 'IsBan';
  }
  if (item.repair) {
    return 'InRepair';
  }
  if (item.transfer) {
    return 'InTransfer';
  }
  if (isOwner) {
    return 'Forbidden';
  }
};
export const getMountTransferError = item => {
  if (!!item.is_ban) {
    return `${T.t('item')} "${item._id}" ${T.t('error_write_off')}`;
  }
  if (!!item.repair) {
    return `${T.t('item')} "${item._id}" ${T.t('error_services')}`;
  }
  if (!!item.transfer) {
    return `${T.t('item')} "${item._id}" ${T.t('error_another')}.`;
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
export const getGiveMessageError = error => {
  if (error === 'IsBan') {
    return `${T.t('item')}  ${T.t('error_write_off')}`;
  }
  if (error === 'InRepair') {
    return `${T.t('item')}  ${T.t('error_services')}`;
  }
  if (error === 'NotFound') {
    return `${T.t('error_code_incorrect')}  ${T.t('error_not_found')}`;
  }
  if (error === 'InTransfer') {
    return `${T.t('during_transfer')}`;
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

export const handleNavigateToSingleItemPage = (
  code,
  navigation,
  id,
  page,
  dispatch,
) => {
  if (code) {
    dispatch(loader(true));
    dispatch(currentScan(code, navigation, page));
  }
  dispatch(getSearchItem(id, navigation, page));
};

export const handleNavigateToMySingleItem = (
  code,
  navigation,
  id,
  page,
  dispatch,
) => {
  if (code) {
    dispatch(loader(true));
    dispatch(getSearchItem(id, navigation, page));
  }
  dispatch(saveCurrentMyItem(id, code, navigation, page));
};

export const getMNotificationMessage = (type, user) => {
  switch (type) {
    case '0':
      return T.t('transaction_add');
    case '1':
      return `${T.t('notification_give_text')} ${user}`;
    case '3':
      return `${user} ${T.t('notification_cancel_text')}`;
    default:
      return T.t('unknown_operation');
  }
};

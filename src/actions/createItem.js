import {
  SAVE_ACCOUNT_AND_VALUE,
  SAVE_ADDITIONAL_INFO,
  SAVE_AMOUNT_OF_INSTANCES,
  SAVE_BASE_ITEM_INFO,
  SAVE_ITEM_LOCATIONS,
  SAVE_PHOTO,
  SAVE_RESPONSIBLE,
} from './actionsType';

export const saveBaseItemInfo = values => dispatch =>
  dispatch({
    type: SAVE_BASE_ITEM_INFO,
    payload: {baseInfo: values},
  });

export const saveAccountingAndValue = values => dispatch =>
  dispatch({
    type: SAVE_ACCOUNT_AND_VALUE,
    payload: {accountType: values},
  });

export const savePhotos = photos => dispatch =>
  dispatch({
    type: SAVE_PHOTO,
    payload: {photos},
  });

export const saveLocation = location => dispatch =>
  dispatch({
    type: SAVE_ITEM_LOCATIONS,
    payload: {location},
  });

export const saveResponsible = responsible => dispatch =>
  dispatch({
    type: SAVE_RESPONSIBLE,
    payload: {responsible},
  });

export const saveAdditionalInfo = additionalInfo => dispatch =>
  dispatch({
    type: SAVE_ADDITIONAL_INFO,
    payload: {additionalInfo},
  });
export const saveAmountOfInstances = amountOfInstances => dispatch =>
  dispatch({
    type: SAVE_AMOUNT_OF_INSTANCES,
    payload: {amountOfInstances},
  });
export const createItem = item => dispatch => {};

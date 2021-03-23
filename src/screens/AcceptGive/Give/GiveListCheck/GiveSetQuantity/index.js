import React from 'react';
import T from '../../../../../i18n';
import {setGiveItemsQty} from '../../../../../actions/actions';
import SetItemQuantity from '../../../../../components/SetItemQuantity';

const GiveSetQuantity = () => (
  <SetItemQuantity
    actionName={setGiveItemsQty}
    pageToRedirect="GiveListCheck"
    title={T.t('give_title')}
  />
);

export default GiveSetQuantity;

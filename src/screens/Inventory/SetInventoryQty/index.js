import React from 'react';
import T from '../../../i18n';
import {setInventoryItemsQty} from '../../../actions/actions';
import SetItemQuantity from '../../../components/SetItemQuantity';

const SetInventoryQty = () => (
  <SetItemQuantity
    actionName={setInventoryItemsQty}
    pageToRedirect="InventoryChooseMode"
    title={T.t('inventori')}
    mode="title_inventory_quantity"
  />
);

export default SetInventoryQty;

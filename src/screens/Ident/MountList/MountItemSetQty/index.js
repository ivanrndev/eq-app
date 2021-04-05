import SetItemQuantity from '../../../../components/SetItemQuantity';
import T from '../../../../i18n';
import React from 'react';
import {setMountItemQty} from '../../../../actions/mountActions';

const MountItemSetQty = () => (
  <SetItemQuantity
    actionName={setMountItemQty}
    pageToRedirect="MountList"
    title={T.t('give_title')}
    mode="title_give_quantity"
  />
);

export default MountItemSetQty;

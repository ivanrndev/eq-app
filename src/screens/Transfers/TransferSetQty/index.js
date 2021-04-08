import React from 'react';
import T from '../../../i18n';
import SetItemQuantity from '../../../components/SetItemQuantity';
import {useDispatch, useSelector} from 'react-redux';
import {updateTransfer} from '../../../actions/actions';
import {useNavigation} from '@react-navigation/native';

const TransferSetQuantity = () => {
  const navigation = useNavigation();
  const item = useSelector(({scan}) => scan.scanInfo);
  const dispatch = useDispatch();
  const [transfersList, transferId] = useSelector(({transfers}) => [
    transfers.transferList,
    transfers.transferId,
  ]);
  const transferredItems = transfersList.find(item => item._id === transferId);
  const unUpdatedItems = transferredItems.items.filter(
    pc => pc._id !== item._id,
  );
  const updateTransferQty = (id, selectedQuantity) =>
    dispatch(
      updateTransfer(
        navigation,
        transferId,
        [...unUpdatedItems, {_id: id, butch: {quantity: selectedQuantity}}],
        'TransfersEdit',
      ),
    );

  return (
    <SetItemQuantity
      onSave={updateTransferQty}
      pageToRedirect="TransfersEdit"
      title={T.t('give_title')}
      mode="title_give_quantity"
    />
  );
};

export default TransferSetQuantity;

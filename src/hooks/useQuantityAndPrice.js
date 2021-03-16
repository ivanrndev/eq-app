import {useSelector} from 'react-redux';
import T from '../i18n';

export const useQuantityAndPrice = () => {
  const [quantity, units, price, currency] = useSelector(({scan, auth}) => [
    scan.scanInfo.batch ? scan.scanInfo.batch.quantity : 1,
    scan.scanInfo.batch ? scan.scanInfo.batch.units : `${T.t('piece')}`,
    scan.scanInfo.metadata && scan.scanInfo.metadata.price,
    auth.currentCompany.payment.request.currency,
  ]);
  const lotPrice = Number(price * quantity);
  const totalLotPrice = Number.isInteger(lotPrice)
    ? lotPrice
    : lotPrice.toFixed(2);

  return {quantity, units, price, currency, totalLotPrice};
};

import {useSelector} from 'react-redux';
import T from '../i18n';

export const useQuantityUnitsAndCurrency = (key = 'scan') => {
  const [quantity, units, currency] = useSelector(({scan, auth}) => [
    scan.scanInfo.batch ? scan.scanInfo.batch.quantity : 1,
    scan.scanInfo.batch ? scan.scanInfo.batch.units : `${T.t('piece')}`,
    auth.currentCompany.payment.request.currency,
  ]);

  return {quantity, units, currency};
};

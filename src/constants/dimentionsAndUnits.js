import {Dimensions} from 'react-native';
import T from '../i18n';

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;
export const units = [T.t('piece'), T.t('kg'), T.t('litre'), T.t('tons')];

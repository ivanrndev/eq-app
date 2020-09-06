import {Dimensions} from 'react-native';
const marker = {width: 600, height: 600};
export const minY = Dimensions.get('window').height / 2 - marker.height / 2 - 50;
export const maxY = Dimensions.get('window').height / 2 + marker.height / 2 - 50;
export const minX = Dimensions.get('window').width / 2 - marker.width / 2;
export const maxX = Dimensions.get('window').width / 2 + marker.width / 2;

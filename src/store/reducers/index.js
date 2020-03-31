import {combineReducers} from 'redux';
import authReducer from './Auth/auth';
import scanReducer from './Scan/scan';
import servicesReducer from './Services/services';
import writeoffReducer from './WriteOff/writeoff';
import markingReducer from './Marking/marking';

export default combineReducers({
  auth: authReducer,
  scan: scanReducer,
  services: servicesReducer,
  writeoff: writeoffReducer,
  marking: markingReducer,
});

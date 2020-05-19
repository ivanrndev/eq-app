import {combineReducers} from 'redux';
import authReducer from './Auth/auth';
import scanReducer from './Scan/scan';
import servicesReducer from './Services/services';
import writeoffReducer from './WriteOff/writeoff';
import markingReducer from './Marking/marking';
import onMeReducer from './OnMe/onme';
import transactionsReducer from './Transactions/transactions';
import giveReducer from './Give/give';
import transfersReducer from './Transfers/transfers';
import acceptReducer from './Accept/accept';
import inventoryReducer from './Inventory/inventory';
import commentsReducer from './Comments/comments';
import settingsReducer from './Settings/settings.js';

export default combineReducers({
  auth: authReducer,
  scan: scanReducer,
  services: servicesReducer,
  writeoff: writeoffReducer,
  marking: markingReducer,
  onMe: onMeReducer,
  transactions: transactionsReducer,
  give: giveReducer,
  transfers: transfersReducer,
  accept: acceptReducer,
  inventory: inventoryReducer,
  comments: commentsReducer,
  settings: settingsReducer,
});

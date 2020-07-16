import React, {useEffect} from 'react';
import {useDispatch, useMappedState} from 'redux-react-hook';
import AsyncStorage from '@react-native-community/async-storage';
import {currentUser} from '../actions/actions.js';

const useAuth = props => {
  const dispatch = useDispatch();
  const token = AsyncStorage.getItem('token');
  const auth = useMappedState(state => state.auth);

  useEffect(() => {
    if (token && !auth.currentCompany) {
      dispatch(currentUser());
    }
  }, [auth.currentCompany, dispatch, token]);

  return auth;
};

export default useAuth;

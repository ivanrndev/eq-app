import React, {useEffect, useState} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import {authWithGoogleAccount} from '../../../actions/actions';
import {Dimensions, StyleSheet} from 'react-native';

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);
  const [gettingLoginStatus, setGettingLoginStatus] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '1064200412468-8tnqiudluds5bljqp4k0v2c60797keds.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      loginHint: '',
      forceCodeForRefreshToken: true,
      accountName: '',
      iosClientId:
        '1064200412468-ojo80v2sod3kve8r6bul6gvlqss2p9ca.apps.googleusercontent.com',
      googleServicePlistPath: '',
    });
    // Check if user is already signed in
    isSignedIn();
  }, []);

  const isSignedIn = async () => {
    const isSignedIn1 = await GoogleSignin.isSignedIn();
    setGettingLoginStatus(isSignedIn1);
  };
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      await dispatch(authWithGoogleAccount(userInfo.idToken));

      setUserInfo({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('ERR1', error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('ERR2', error);
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('ERR3', error);
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  console.log('LLL', gettingLoginStatus, userInfo);
  return (
    <GoogleSigninButton
      style={styles.btn}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={signIn}
    />
  );
};
const styles = StyleSheet.create({
  btn: {
    height: 50,
    width: Dimensions.get('window').width / 1.7,
    alignSelf: 'center',
    borderRadius: 10,
  },
});

export default GoogleAuth;

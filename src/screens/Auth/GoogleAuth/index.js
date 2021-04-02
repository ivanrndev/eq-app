import React, {useEffect} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import {authWithGoogleAccount} from '../../../actions/actions';
import {Dimensions, StyleSheet} from 'react-native';

const GoogleAuth = () => {
  const dispatch = useDispatch();

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
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      dispatch(authWithGoogleAccount(userInfo.idToken));
    } catch (error) {
      if (error) {
        console.log('ERR1', error);
      }
    }
  };

  return (
    <GoogleSigninButton
      style={styles.btn}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={signIn}
    />
  );
};
const styles = StyleSheet.create({
  btn: {
    height: 50,
    width: Dimensions.get('window').width / 1.3,
    maxWidth: 230,
    alignSelf: 'center',
    borderRadius: 10,
  },
});

export default GoogleAuth;

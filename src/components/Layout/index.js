import React, {useEffect, useState} from 'react';
import useAuth from '../../hooks/useAuth';
import {ActivityIndicator} from 'react-native-paper';
import {Dimensions, StyleSheet, View} from 'react-native';

const Layout = props => {
  const auth = useAuth(props);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentCompany && loading) {
      setLoading(false);
    }
  }, [auth.currentCompany, loading]);

  return (
    <>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator
            style={styles.load}
            size={80}
            animating={true}
            color={'#EDF6FF'}
          />
        </View>
      ) : (
        props.children
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loader: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Layout;

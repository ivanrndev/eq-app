import React from 'react';
import Layout from '../components/Layout';

const withLayout = Wrapped => {
  return class SubscriptionLayout extends React.Component {
    render() {
      return (
        <Layout {...this.props}>
          <Wrapped {...this.props} />
        </Layout>
      );
    }
  };
};

export default withLayout;

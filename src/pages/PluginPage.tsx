
import React from 'react';
import Layout from '@/components/Layout';
import UpiPluginSettings from './UpiPluginSettings';

const PluginPage = () => {
  return (
    <Layout hideNavigation={true}>
      <UpiPluginSettings />
    </Layout>
  );
};

export default PluginPage;

import React, { useState } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, Text } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import RecentJobs from './RecentJobs';
import Proposals from './Proposals';
import Completed from './CompletedJobs';
import ActiveJobs from './ActiveJobs'

const ServiceUserCreateBid = () => {
  
  const [activeTab, setActiveTab] = useState('recent-jobs'); // 'post', 'view', 'myjobs', 'profile'

  const renderContent = () => {
    switch (activeTab) {
      case 'recent-jobs':
        return (
         <RecentJobs />
        );

      case 'proposals':
        return (
         <Proposals />
        );

      case 'Active Jobs':
        return (
        <ActiveJobs />
        );

      case 'completed':
        return (
       <Completed />
        )

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15, marginTop:40 }}>
          <Button
            mode={activeTab === 'recent-jobs' ? "contained" : "outlined"}
            onPress={() => setActiveTab('recent-jobs')}
            compact
          >
            Recent Jobs
          </Button>
          <Button
            mode={activeTab === 'proposals' ? "contained" : "outlined"}
            onPress={() => setActiveTab('proposals')}
            compact
          >
            Proposals
          </Button>
          <Button
            mode={activeTab === 'Active Jobs' ? "contained" : "outlined"}
            onPress={() => setActiveTab('Active Jobs')}
            compact
          >
            Active Jobs
          </Button>
          <Button
            mode={activeTab === 'completed' ? "contained" : "outlined"}
            onPress={() => setActiveTab('completed')}
            compact
          >
           Completed
          </Button>
        </View>

        {/* Dynamic Content */}
        {renderContent()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ServiceUserCreateBid;

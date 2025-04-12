import React, { useState } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, Text } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import PostJob from './postJob';
import ViewBids from './ViewBids';
import MyJobs from './MyJobs';
import Interviewing from './Interviewing';

const ServiceUserCreateBid = () => {
  
  const [activeTab, setActiveTab] = useState('post'); // 'post', 'view', 'myjobs', 'profile'

  const renderContent = () => {
    switch (activeTab) {
      case 'post':
        return (
         <PostJob />
        );

      case 'view':
        return (
          <ViewBids />
        );

      case 'myjobs':
        return (
         <MyJobs />
        );
        
      case 'Interviewing':
        return (
        <Interviewing />
        );

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
            mode={activeTab === 'post' ? "contained" : "outlined"}
            onPress={() => setActiveTab('post')}
            compact
          >
            Post Job
          </Button>
          <Button
            mode={activeTab === 'view' ? "contained" : "outlined"}
            onPress={() => setActiveTab('view')}
            compact
          >
            View Bids
          </Button>
          <Button
            mode={activeTab === 'myjobs' ? "contained" : "outlined"}
            onPress={() => setActiveTab('myjobs')}
            compact
          >
            My Jobs
          </Button>
          <Button
            mode={activeTab === 'Interviewing' ? "contained" : "outlined"}
            onPress={() => setActiveTab('Interviewing')}
            compact
          >
            Interviewing
          </Button>
        </View>

        {/* Dynamic Content */}
        {renderContent()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ServiceUserCreateBid;

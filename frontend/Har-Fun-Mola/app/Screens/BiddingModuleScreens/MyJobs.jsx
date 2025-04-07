import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Card, Title } from 'react-native-paper'

const MyJobs = () => {
  return (
    <View>
       <Card style={{ padding: 20, borderRadius: 10, marginTop: 10 }}>
            <Title style={{ textAlign: 'center' }}>My Jobs</Title>
            <Text>List of jobs you’ve posted will show here.</Text>
          </Card>
    </View>
  )
}

export default MyJobs

const styles = StyleSheet.create({})
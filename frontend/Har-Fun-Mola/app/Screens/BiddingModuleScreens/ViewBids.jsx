import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Card, Title } from 'react-native-paper'

const ViewBids = () => {
  return (
    <View>
      <Card style={{ padding: 20, borderRadius: 10, marginTop: 10 }}>
            <Title style={{ textAlign: 'center' }}>All Bids</Title>
            <Text>Here you can view all bids submitted by users.</Text>
          </Card>
    </View>
  )
}

export default ViewBids

const styles = StyleSheet.create({})
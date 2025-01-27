import { View, Text, StyleSheet } from 'react-native'

export const Heading = ({text,isViewAll=false}) => {
  return (
    <View style={styles.container}>
     <Text style={styles.heading}>{text}</Text>
     {isViewAll && <Text style={{marginBottom:20}}>View All</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
    heading:{
        fontSize:20,
        fontFamily:'outfit-medium',
        marginBottom:20,
    },
    container:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    }
})
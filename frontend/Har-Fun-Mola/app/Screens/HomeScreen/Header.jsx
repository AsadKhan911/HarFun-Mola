import { View, Text, Image, StyleSheet, TextInput } from 'react-native'
import Colors from '../../../constants/Colors.ts'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export const Header = () => {
  //Fetchind user data from redux
  const fullName = useSelector(state => state.auth.user?.fullName); // Get fullName from Redux

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileMainContainer}>
        <View style={styles.profileContainer}>
          {/* <Image source={{uri:user?.imageUrl}} */}
          <Image source={require('../../../assets/images/mypic.png')}
            style={styles.userImage} />

          <View>
            <Text style={{ color: Colors.WHITE, fontFamily: 'outfit' }}>Welcome</Text>
            <Text style={{ color: Colors.WHITE, fontSize: 20, fontFamily: 'outfit-Medium' }} >{fullName}</Text>
          </View>
        </View>
        <FontAwesome name="bookmark-o" size={27} color="white" />
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchBarContainer}>
        <TextInput placeholder='Search for your desired service'
        placeholderTextColor={Colors.GRAY}
          style={styles.textInput} />
        <FontAwesome name="search" style={styles.searchBtn} size={24} color={Colors.PRIMARY} />
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99
  },
  container: {
    padding: 20,
    paddintop: 20,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  profileMainContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchBarContainer: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    gap: 9,
    marginBottom: 10
  },
  textInput: {
    padding: 7,
    paddingHorizontal: 16,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    width: '85%',
    fontSize: 15,
    fontFamily: 'outfit'
  },
  searchBtn: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 8
  }
})
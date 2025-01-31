import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors.ts';
import { useSelector } from 'react-redux';

const Header = () => {
  // Fetching user data from Redux
  const { fullName, profile } = useSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileMainContainer}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: profile?.profilePic }} style={styles.userImage} />
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.userName}>{fullName}</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>120</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>$5,250</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileMainContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  welcomeText: {
    color: Colors.WHITE,
    fontFamily: 'outfit',
  },
  userName: {
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: 'outfit-Medium',
  },
  statsContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'outfit-Bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Header;

import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import useGetUserBooking from '../../../hooks/useGetUserBooking.jsx';
import { useSelector } from 'react-redux';
import BookingListItem from '../BookingScreen/BookingListItem.jsx';

const Booking = () => {
  useGetUserBooking();
  const { allBookings } = useSelector((store) => store.bookings);

  return (
    <View style={{ padding: 20 , backgroundColor:'white' , flex: 1 }}>
      <Text style={{ fontFamily: 'outfit-Medium', fontSize: 26 , marginBottom:30 }}>My Bookings</Text>

      <View style={{ flex: 1 }}>
        <FlatList
          data={allBookings}
          keyExtractor={(item) => item._id} // Use a unique key for each item
          renderItem={({ item }) => (
            <BookingListItem booking={item} /> // Pass the individual booking as a prop
          )}
        />
      </View>
    </View>
  );
};

export default Booking;

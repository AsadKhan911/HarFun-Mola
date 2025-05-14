import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';

const ManageCards = () => {
  // Static card data
  const cards = [
    {
      id: '1',
      type: 'VISA',
      number: '•••• •••• •••• 4242',
      expiry: '09/25',
      image: 'https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png'
    },
    {
      id: '2',
      type: 'Mastercard',
      number: '•••• •••• •••• 5555',
      expiry: '03/24',
      image: 'https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo.png'
    },
    {
      id: '3',
      type: 'AMEX',
      number: '•••• •••• •••• 9012',
      expiry: '12/23',
      image: 'https://logos-world.net/wp-content/uploads/2020/11/American-Express-Logo.png'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Payment Methods</Text>
        <TouchableOpacity>
          <MaterialIcons name="help-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Current Cards Section */}
        <Text style={styles.sectionTitle}>Your Cards</Text>
        
        {cards.map(card => (
          <View key={card.id} style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Image 
                source={{ uri: card.image }} 
                style={styles.cardLogo} 
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.deleteButton}>
                <FontAwesome name="trash-o" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.cardNumber}>{card.number}</Text>
            
            <View style={styles.cardFooter}>
              <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>DEFAULT</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Add New Card Section */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Add New Card</Text>
        
        <TouchableOpacity style={styles.addCardButton}>
          <View style={styles.addCardContent}>
            <AntDesign name="pluscircleo" size={24} color="#6772e5" />
            <Text style={styles.addCardText}>Add Credit/Debit Card</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop:50
  },
  scrollContainer: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 15
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cardLogo: {
    width: 60,
    height: 30
  },
  deleteButton: {
    padding: 5
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
    letterSpacing: 1
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardExpiry: {
    fontSize: 14,
    color: '#666'
  },
  defaultBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  defaultText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '600'
  },
  addCardButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  addCardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addCardText: {
    fontSize: 16,
    color: '#6772e5',
    fontWeight: '500',
    marginLeft: 15
  },
  paymentOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  paymentLogo: {
    width: 80,
    height: 25
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1
  }
});

export default ManageCards;
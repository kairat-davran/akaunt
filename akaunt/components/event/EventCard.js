import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EventCard = ({ item, isRSVPed, onRSVP, onShare, onEdit, onDelete, navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('EventDetail', { event: item })}>
    <View style={styles.card}>
      {item.images?.[0] && (
        <Image
          source={{ uri: item.images[0].url || item.images[0].uri }}
          style={styles.image}
        />
      )}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => onEdit(item)}>
              <MaterialIcons name="edit" size={20} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item)}>
              <MaterialIcons name="delete" size={20} color="crimson" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.info}>📍 {item.location}</Text>
        <Text style={styles.info}>🕒 {new Date(item.date).toLocaleString()}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.rsvpButton, isRSVPed && { backgroundColor: '#28a745' }]}
            onPress={() => onRSVP(item._id)}
          >
            <Text style={styles.rsvpText}>{isRSVPed ? 'RSVPed' : 'RSVP'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={() => onShare(item)}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default EventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardContent: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  rsvpButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  rsvpText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
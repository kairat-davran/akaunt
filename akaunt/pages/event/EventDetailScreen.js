// EventDetailScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const EventDetailScreen = ({ route }) => {
  const { event } = route.params;
  const navigation = useNavigation();

  const imageUri =
    event.image?.uri || event.image?.url || event.images?.[0]?.uri || event.images?.[0]?.url || null;
  const eventDate = event.datetime || event.date;
  const formattedDate = new Date(eventDate).toLocaleString();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: "${event.title}" on ${formattedDate} at ${event.location}.`,
      });
    } catch {
      alert('Failed to share');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerWrapper}>
        <Image
          source={imageUri ? { uri: imageUri } : require('../../assets/images/default-event.jpg')}
          style={styles.headerImage}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{event.category || 'General'}</Text>
        </View>

        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.metaGroup}>
          <MaterialIcons name="location-on" size={18} color="#888" />
          <Text style={styles.metaText}>{event.location}</Text>
        </View>

        <View style={styles.metaGroup}>
          <MaterialIcons name="event" size={18} color="#888" />
          <Text style={styles.metaText}>{formattedDate}</Text>
        </View>

        {event.description && (
          <Text style={styles.description}>{event.description}</Text>
        )}

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <MaterialIcons name="share" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.shareText}>Share Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  headerWrapper: {
    position: 'relative',
    width: '100%',
    height: 260,
    backgroundColor: '#ccc',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f1f1f',
    marginBottom: 16,
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 15,
    marginLeft: 8,
    color: '#555',
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginTop: 20,
    lineHeight: 22,
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
  },
  shareBtn: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
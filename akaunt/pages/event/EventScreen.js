import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../redux/actions/eventAction';
import EventCard from '../../components/event/EventCard';

const categories = ['All', 'Tech', 'Startup', 'Conference'];

const EventScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { events } = useSelector(state => state.events);
  const auth = useSelector(state => state.auth);
  const [rsvpList, setRsvpList] = useState([]);
  const [filter, setFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [form, setForm] = useState({
    id: '',
    title: '',
    location: '',
    datetime: new Date(),
    category: '',
    image: null,
  });

  useEffect(() => {
    dispatch(getEvents(auth.token));
  }, [dispatch, auth.token]);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Permission required to access media library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setForm((prev) => ({ ...prev, image: result.assets[0] }));
    }
  };

  const handleWebImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const uri = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, image: { uri, file } }));
    }
  };

  const handleRSVP = (id) => {
    setRsvpList((prev) => (prev.includes(id) ? prev : [...prev, id]));
    Alert.alert('RSVP Confirmed', 'You are attending this event.');
  };

  const handleShare = async (event) => {
    try {
      await Share.share({
        message: `Join me at "${event.title}" on ${new Date(event.date).toLocaleString()} in ${event.location}!`,
      });
    } catch {
      Alert.alert('Error', 'Failed to share the event.');
    }
  };

  const handleCreateOrUpdate = () => {
    if (!form.title || !form.location || !form.datetime || !form.category) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    const payload = {
      ...form,
      date: form.datetime,
      images: form.image ? [form.image] : [],
    };
    delete payload.datetime;

    if (form.id) {
      dispatch(updateEvent({ id: form.id, data: payload, auth }));
    } else {
      dispatch(createEvent({ data: payload, auth }));
    }

    setModalVisible(false);
    resetForm();
  };

  const openEditForm = (event) => {
    setForm({
      id: event._id,
      title: event.title,
      location: event.location,
      datetime: new Date(event.date),
      category: event.category,
      image: event.images?.[0]
        ? {
            ...event.images[0],
            uri: event.images[0].uri || event.images[0].url || '',
          }
        : null,
    });
    setModalVisible(true);
  };

  const handleDelete = (event) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`Are you sure you want to delete "${event.title}"?`);
      if (confirm) {
        dispatch(deleteEvent({ id: event._id, auth }));
      }
    } else {
      Alert.alert(
        'Delete Event',
        `Are you sure you want to delete "${event.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => dispatch(deleteEvent({ id: event._id, auth })),
          },
        ]
      );
    }
  };

  const resetForm = () => {
    setForm({
      id: '',
      title: '',
      location: '',
      datetime: new Date(),
      category: '',
      image: null,
    });
  };

  const filteredEvents = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.headerContent}>
          <Text style={styles.heading}>🎉 Upcoming Events</Text>
          <Text style={styles.subheading}>Browse, RSVP, and share events in your community</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setFilter(cat)}
              style={[styles.filterChip, filter === cat && styles.activeFilter]}
            >
              <Text style={[styles.filterText, filter === cat && styles.activeFilterText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            isRSVPed={rsvpList.includes(item._id)}
            onRSVP={handleRSVP}
            onShare={handleShare}
            onEdit={openEditForm}
            onDelete={handleDelete}
            navigation={navigation}
          />
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{form.id ? 'Edit Event' : 'Create Event'}</Text>
            {['title', 'location', 'category'].map((field) => (
              <TextInput
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                style={styles.input}
                value={form[field]}
                onChangeText={(text) => setForm((prev) => ({ ...prev, [field]: text }))}
              />
            ))}

            {Platform.OS === 'web' ? (
              <input
                type="datetime-local"
                value={form.datetime.toISOString().slice(0, 16)}
                onChange={(e) => setForm(prev => ({ ...prev, datetime: new Date(e.target.value) }))}
                style={{ marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 14, width: '100%' }}
              />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.input, { justifyContent: 'center' }]}>
                  <Text>{form.datetime.toLocaleString()}</Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={form.datetime}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowPicker(false);
                      if (selectedDate) setForm(prev => ({ ...prev, datetime: selectedDate }));
                    }}
                  />
                )}
              </>
            )}

            {Platform.OS === 'web' ? (
              <input type="file" accept="image/*" onChange={handleWebImageUpload} style={{ marginVertical: 10 }} />
            ) : (
              <TouchableOpacity onPress={handlePickImage} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>{form.image ? 'Change Image' : 'Pick Image'}</Text>
              </TouchableOpacity>
            )}
            {form.image?.uri && (
              <View style={{ position: 'relative', marginVertical: 10 }}>
                <Image
                  source={{ uri: form.image.uri }}
                  style={{ width: '100%', height: 150, borderRadius: 8 }}
                />
                <TouchableOpacity
                  onPress={() => setForm(prev => ({ ...prev, image: null }))}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    backgroundColor: 'crimson',
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    zIndex: 10,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>×</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleCreateOrUpdate}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },

  headerBar: {
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },

  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: 'center',
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1d3557',
    textAlign: 'center',
    marginBottom: 6,
  },

  filterBar: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  subheading: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
    textAlign: 'center',
  },

  filterChip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e5e5e5',
    marginRight: 10,
    elevation: Platform.OS === 'android' ? 1 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    }),
  },

  activeFilter: {
    backgroundColor: '#007AFF',
  },

  filterText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },

  activeFilterText: {
    color: '#fff',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    elevation: Platform.OS === 'android' ? 10 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      },
    }),
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },

  saveBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  cancelBtn: {
    marginTop: 12,
    alignItems: 'center',
  },

  cancelBtnText: {
    color: '#888',
    fontSize: 15,
  },
});
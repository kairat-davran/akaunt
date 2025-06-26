import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, Alert,
  Share, ScrollView, SafeAreaView, Modal, TextInput,
  Platform, StyleSheet
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEvents, createEvent, updateEvent, deleteEvent
} from '../../redux/actions/eventAction';
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
    images: [],
  });

  useEffect(() => {
    dispatch(getEvents(auth.token));
  }, []);

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
      const selected = result.assets[0];
      setForm(prev => ({
        ...prev,
        images: [...(prev.images || []), selected]
      }));
    }
  };

  const handleWebImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const fileWithPreview = { file: [file], uri: previewUrl };

      setForm(prev => ({
        ...prev,
        images: [fileWithPreview]
      }));
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
    };

    if (form.id) {
      dispatch(updateEvent({ data: payload, auth }));
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
      images: event.images || [],
    });
    setModalVisible(true);
  };

  const handleDelete = (event) => {
    const confirm = Platform.OS === 'web'
      ? window.confirm(`Delete "${event.title}"?`)
      : true;
    if (confirm) {
      dispatch(deleteEvent({ id: event._id, auth }));
    }
  };

  const resetForm = () => {
    setForm({
      id: '',
      title: '',
      location: '',
      datetime: new Date(),
      category: '',
      images: [],
    });
  };

  const filteredEvents = filter === 'All'
    ? events
    : events.filter(e => e.category === filter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.heading}>🎉 Upcoming Events</Text>
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
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            isRSVPed={rsvpList.includes(item._id)}
            onRSVP={() => {
              setRsvpList(prev => [...prev, item._id]);
              Alert.alert('RSVP Confirmed', 'You are attending.');
            }}
            onShare={() => {
              Share.share({
                message: `Join me at "${item.title}" on ${new Date(item.date).toLocaleString()} in ${item.location}!`
              });
            }}
            onEdit={() => openEditForm(item)}
            onDelete={() => handleDelete(item)}
            navigation={navigation}
          />
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.fab} onPress={() => {
        resetForm();
        setModalVisible(true);
      }}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{form.id ? 'Edit Event' : 'Create Event'}</Text>
            {['title', 'location', 'category'].map(field => (
              <TextInput
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                style={styles.input}
                value={form[field]}
                onChangeText={text => setForm(prev => ({ ...prev, [field]: text }))}
              />
            ))}

            {Platform.OS === 'web' ? (
              <input
                type="datetime-local"
                value={form.datetime.toISOString().slice(0, 16)}
                onChange={(e) => setForm(prev => ({ ...prev, datetime: new Date(e.target.value) }))}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                  style={[styles.input, { justifyContent: 'center' }]}
                >
                  <Text>{form.datetime.toLocaleString()}</Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={form.datetime}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowPicker(false);
                      if (selectedDate) {
                        setForm(prev => ({ ...prev, datetime: selectedDate }));
                      }
                    }}
                  />
                )}
              </>
            )}

            {Platform.OS === 'web' ? (
              <input type="file" accept="image/*" onChange={handleWebImageUpload} />
            ) : (
              <TouchableOpacity onPress={handlePickImage} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Pick Image</Text>
              </TouchableOpacity>
            )}

            {form.images?.map((img, idx) => (
              <View key={idx} style={{ marginVertical: 5 }}>
                <Image
                  source={{ uri: img.uri || img.url }}
                  style={{ width: '100%', height: 120, borderRadius: 8 }}
                />
              </View>
            ))}

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
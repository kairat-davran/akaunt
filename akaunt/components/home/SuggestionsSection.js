import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import UserCard from '../UserCard';
import FollowBtn from '../FollowBtn';
import LoadIcon from '../../assets/images/loading.gif';
import { getSuggestions } from '../../redux/actions/suggestionsAction';

const SuggestionsSection = () => {
  const auth = useSelector(state => state.auth);
  const suggestions = useSelector(state => state.suggestions);
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(getSuggestions(auth.token));
  };

  const openLink = async () => {
    const url = 'https://kai-davran.github.io/dimensional_portfolio/';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.suggestionText}>Suggestions for you</Text>
        {!suggestions.loading && (
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.redo}>⟳</Text>
          </TouchableOpacity>
        )}
      </View>

      {suggestions.loading ? (
        <Image source={LoadIcon} style={styles.loading} />
      ) : (
        <ScrollView style={styles.suggestions}>
          {suggestions.users.map(user => (
            <View key={user._id} style={styles.userCard}>
              <UserCard user={user}>
                <FollowBtn user={user} />
              </UserCard>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={openLink}>
          <Text style={styles.link}>
            Right now we do not have a link
          </Text>
        </TouchableOpacity>
        <Text style={styles.smallText}>
          Welcome to our social network!
        </Text>
        <Text style={styles.smallText}>
          &copy; 2025 akaunt FROM me Kairat
        </Text>
      </View>
    </View>
  );
};

export default SuggestionsSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
  },
  redo: {
    fontSize: 20,
    color: '#007bff',
  },
  loading: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginVertical: 20,
  },
  suggestions: {
    maxHeight: 300,
  },
  userCard: {
    marginBottom: 10,
  },
  footer: {
    opacity: 0.5,
    marginTop: 20,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  smallText: {
    fontSize: 12,
    color: '#555',
  },
});
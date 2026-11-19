import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAds } from '../context/AdsContext';
import { useTheme } from '../context/ThemeContext';

export default function AdDetailsScreen({ route, navigation }) {
  const { adId } = route.params;
  const { ads, deleteAd } = useAds();
  const { colors } = useTheme();

  const ad = ads.find((item) => item.id === adId);

  if (!ad) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Skelbimas nerastas.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Pašalinti skelbimą?',
      `Ar tikrai norite pašalinti „${ad.title}“?`,
      [
        { text: 'Atšaukti', style: 'cancel' },
        {
          text: 'Šalinti',
          style: 'destructive',
          onPress: () => {
            deleteAd(ad.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Image source={{ uri: ad.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.primary }]}>
          {ad.category}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>{ad.title}</Text>
        <Text style={[styles.price, { color: colors.text }]}>{ad.price} €</Text>

        <View
          style={[
            styles.descBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.descLabel, { color: colors.subtext }]}>
            Aprašymas
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {ad.description}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AdForm', { ad })}
          >
            <Text style={styles.btnText}>Redaguoti</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.danger }]}
            onPress={handleDelete}
          >
            <Text style={styles.btnText}>Šalinti</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 250, backgroundColor: '#CBD5E1' },
  content: { padding: 16 },
  category: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  price: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  descBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  descLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  description: { fontSize: 15, lineHeight: 22 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
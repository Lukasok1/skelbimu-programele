import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAds } from '../context/AdsContext';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../data/ads';

export default function AdsListScreen({ navigation }) {
  const { ads, feedback } = useAds();
  const { currency, toggleCurrency, formatPrice, colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Visi');

  const bannerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!feedback) return;
    bannerAnim.setValue(0);
    Animated.sequence([
      Animated.timing(bannerAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(bannerAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [feedback, bannerAnim]);

  const filteredAds =
    selectedCategory === 'Visi'
      ? ads
      : ads.filter((ad) => ad.category === selectedCategory);

  const bannerTranslateY = bannerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={[styles.currencyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={toggleCurrency}
        >
          <Text style={{ color: colors.text, fontWeight: '600' }}>
            Valiuta: {currency === 'EUR' ? 'EUR (€)' : 'USD ($)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AdForm')}
        >
          <Text style={styles.addBtnText}>+ Naujas skelbimas</Text>
        </TouchableOpacity>
      </View>

      {feedback && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              backgroundColor: colors.success,
              opacity: bannerAnim,
              transform: [{ translateY: bannerTranslateY }],
            },
          ]}
        >
          <Text style={styles.toastText}>{feedback.text}</Text>
        </Animated.View>
      )}

      <View style={styles.filterRow}>
        {['Visi', ...CATEGORIES].map((category) => {
          const active = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.chip,
                { backgroundColor: active ? colors.primary : colors.chipBg },
              ]}
            >
              <Text
                style={{
                  color: active ? '#FFFFFF' : colors.text,
                  fontWeight: active ? '700' : '500',
                  fontSize: 13,
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filteredAds.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            Šioje kategorijoje skelbimų nerasta.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAds}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => navigation.navigate('AdDetails', { adId: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.thumbnail} />
              <View style={styles.cardBody}>
                <Text style={[styles.categoryTag, { color: colors.primary }]}>
                  {item.category}
                </Text>
                <Text
                  style={[styles.title, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text style={[styles.price, { color: colors.text }]}>
                  {formatPrice(item.price)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  currencyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '700' },
  toast: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  toastText: { color: '#FFFFFF', fontWeight: '700', textAlign: 'center' },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '500' },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumbnail: { width: 110, height: 110, backgroundColor: '#CBD5E1' },
  cardBody: { flex: 1, padding: 12, justifyContent: 'space-between' },
  categoryTag: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 15, fontWeight: '600', marginVertical: 4 },
  price: { fontSize: 17, fontWeight: '800' },
});
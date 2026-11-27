import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAds } from '../context/AdsContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AdDetailsScreen({ route, navigation }) {
  const { adId } = route.params;
  const { ads, deleteAd } = useAds();
  const { user } = useAuth();
  const { formatPrice, colors } = useTheme();
  const [deleting, setDeleting] = useState(false);

  const ad = ads.find((item) => item.id === adId);

  if (!ad) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Skelbimas nerastas.</Text>
      </View>
    );
  }

  const isOwner = Boolean(user && ad.authorId === user.uid);
  const photoList = ad.images?.length ? ad.images : [ad.image];

  const handleDelete = () => {
    Alert.alert(
      'Pašalinti skelbimą?',
      `Ar tikrai norite pašalinti „${ad.title}“?`,
      [
        { text: 'Atšaukti', style: 'cancel' },
        {
          text: 'Šalinti',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteAd(ad.id);
              navigation.goBack();
            } catch (err) {
              setDeleting(false);
              Alert.alert('Klaida', 'Nepavyko pašalinti skelbimo: ' + err.message);
            }
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
      {/* Nuotraukų galerija (bent 2 nuotraukos) */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {photoList.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>
      {photoList.length > 1 && (
        <Text style={[styles.photoHint, { color: colors.subtext }]}>
          Braukite į šoną, kad peržiūrėtumėte visas nuotraukas ({photoList.length})
        </Text>
      )}

      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.primary }]}>{ad.category}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{ad.title}</Text>
        <Text style={[styles.price, { color: colors.text }]}>{formatPrice(ad.price)}</Text>

        {/* Autoriaus informacija iš DB */}
        <View style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.boxLabel, { color: colors.subtext }]}>Pardavėjas</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {ad.authorName || 'Nenurodyta'} ({ad.authorEmail || 'el. paštas nepateiktas'})
          </Text>
        </View>

        <View style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.boxLabel, { color: colors.subtext }]}>Aprašymas</Text>
          <Text style={[styles.description, { color: colors.text }]}>{ad.description}</Text>
        </View>

        {/* Redaguoti ir šalinti gali tik autorius */}
        {isOwner && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AdForm', { ad })}
              disabled={deleting}
            >
              <Text style={styles.btnText}>Redaguoti</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.danger, opacity: deleting ? 0.7 : 1 }]}
              onPress={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnText}>Šalinti</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 380, height: 240, backgroundColor: '#CBD5E1' },
  photoHint: { fontSize: 12, textAlign: 'center', marginTop: 6 },
  content: { padding: 16 },
  category: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  price: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  box: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
  boxLabel: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  description: { fontSize: 15, lineHeight: 22 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 6 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
/*14 eil.: iš navigacijos parametrų (route.params) pasiima paspausto skelbimo adId.

16 eil.: nuskaito formatPrice iš ThemeContext (Context API naudojimas 2-ame ekrane – kaina čia irgi keičiasi perjungus valiutą).

18 eil.: suranda konkretų skelbimo objektą sąraše pagal adId.

28–43 eil. (handleDelete): iškviečia sistemos patvirtinimo langą (Alert.alert) su pasirinkimais „Atšaukti“ ir „Šalinti“; patvirtinus iškviečia deleteAd(ad.id) ir grąžina į sąrašą (navigation.goBack()).

75–80 eil.: mygtukas „Redaguoti“, kuris atidaro AdForm ekraną ir perduoda jam esamą ad objektą.*/
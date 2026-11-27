import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAds } from '../context/AdsContext';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../data/ads';

export default function AdFormScreen({ route, navigation }) {
  const existingAd = route.params?.ad;
  const isEditing = Boolean(existingAd);

  const { addAd, updateAd } = useAds();
  const { colors } = useTheme();

  const [title, setTitle] = useState(existingAd ? existingAd.title : '');
  const [price, setPrice] = useState(existingAd ? String(existingAd.price) : '');
  const [category, setCategory] = useState(existingAd ? existingAd.category : CATEGORIES[0]);
  const [image1, setImage1] = useState(
    existingAd?.images?.[0] || existingAd?.image || 'https://picsum.photos/seed/pc1/600/400'
  );
  const [image2, setImage2] = useState(
    existingAd?.images?.[1] || 'https://picsum.photos/seed/pc2/600/400'
  );
  const [description, setDescription] = useState(existingAd ? existingAd.description : '');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!title.trim() || title.trim().length < 3) {
      nextErrors.title = 'Įveskite pavadinimą (bent 3 simboliai).';
    }
    const numericPrice = Number(price);
    if (!price.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      nextErrors.price = 'Įveskite teisingą teigiamą kainą.';
    }
    if (!category) {
      nextErrors.category = 'Pasirinkite kategoriją.';
    }
    if (!image1.trim().startsWith('http')) {
      nextErrors.image1 = 'Įveskite pirmos nuotraukos URL (http/https).';
    }
    if (!image2.trim().startsWith('http')) {
      nextErrors.image2 = 'Įveskite antros nuotraukos URL (http/https).';
    }
    if (!description.trim() || description.trim().length < 10) {
      nextErrors.description = 'Aprašymas turi būti bent 10 simbolių ilgio.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitError('');
    setSaving(true);

    const payload = {
      title: title.trim(),
      price: Number(price),
      category,
      image: image1.trim(),
      images: [image1.trim(), image2.trim()],
      description: description.trim(),
    };

    try {
      if (isEditing) {
        await updateAd(existingAd.id, payload);
      } else {
        await addAd(payload);
      }
      navigation.goBack();
    } catch (err) {
      setSubmitError('Nepavyko išsaugoti duomenų bazėje: ' + err.message);
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {submitError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorBoxText}>{submitError}</Text>
        </View>
      ) : null}

      <Text style={[styles.label, { color: colors.text }]}>Pavadinimas *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Pvz., Monitorius ASUS 24"
        placeholderTextColor={colors.subtext}
      />
      {errors.title && <Text style={styles.error}>{errors.title}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Kaina (€) *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Pvz., 150"
        placeholderTextColor={colors.subtext}
      />
      {errors.price && <Text style={styles.error}>{errors.price}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Kategorija *</Text>
      <View style={styles.catRow}>
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.catChip, { backgroundColor: active ? colors.primary : colors.chipBg }]}
            >
              <Text style={{ color: active ? '#FFF' : colors.text, fontWeight: '600' }}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>1 nuotraukos URL *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={image1}
        onChangeText={setImage1}
        autoCapitalize="none"
        placeholder="https://..."
        placeholderTextColor={colors.subtext}
      />
      {errors.image1 && <Text style={styles.error}>{errors.image1}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>2 nuotraukos URL *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={image2}
        onChangeText={setImage2}
        autoCapitalize="none"
        placeholder="https://..."
        placeholderTextColor={colors.subtext}
      />
      {errors.image2 && <Text style={styles.error}>{errors.image2}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Aprašymas *</Text>
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Išsamus prekės aprašymas..."
        placeholderTextColor={colors.subtext}
      />
      {errors.description && <Text style={styles.error}>{errors.description}</Text>}

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.chipBg }]}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={{ color: colors.text, fontWeight: '700' }}>Atšaukti</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
              {isEditing ? 'Išsaugoti pakeitimus' : 'Sukurti skelbimą'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorBoxText: { color: '#B91C1C', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  error: { color: '#DC2626', fontSize: 12, marginTop: 4, fontWeight: '600' },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
});
/*
15–16 eil.: patikrina, ar į ekraną perduotas route.params?.ad; jei taip – įjungia redagavimo režimą (isEditing = true).

21–32 eil.: užpildo formos laukus esamo skelbimo duomenimis (jei redaguojama) arba tuščiomis/pradinėmis reikšmėmis (jei kuriama).

35–54 eil. (validate): patikrina visus 5 privalomus laukus (pavadinimo ilgį, ar kaina yra teigiamas skaičius, ar pasirinkta kategorija, ar nuotraukos nuoroda prasideda http, ir aprašymo ilgį) bei įrašo klaidų tekstus į errors būseną.

56–74 eil. (handleSave): jei validacija sėkminga, suformuoja skelbimo objektą ir iškviečia updateAd (redaguojant) arba addAd (kuriant), po to grįžta atgal.

87, 100, 121, 134, 148 eil.: po kiekvienu įvesties lauku atvaizduoja raudoną klaidos pranešimą, jei vartotojas įvedė neteisingus duomenis. 
*/
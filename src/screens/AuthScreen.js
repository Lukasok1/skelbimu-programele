import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/Authcontext';
import { useTheme } from '../context/ThemeContext';

export default function AuthScreen({ navigation }) {
  const { login, register } = useAuth();
  const { colors } = useTheme();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (isRegister && name.trim().length < 2) {
      setError('Įveskite savo vardą (bent 2 simboliai).');
      return;
    }
    if (!email.includes('@')) {
      setError('Įveskite teisingą el. pašto adresą.');
      return;
    }
    if (password.length < 6) {
      setError('Slaptažodis turi būti bent 6 simbolių.');
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>
        {isRegister ? 'Sukurti paskyrą' : 'Prisijungti'}
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {isRegister && (
        <>
          <Text style={[styles.label, { color: colors.text }]}>Vardas *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Pvz., Jonas"
            placeholderTextColor={colors.subtext}
          />
        </>
      )}

      <Text style={[styles.label, { color: colors.text }]}>El. paštas *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="vardas@pastas.lt"
        placeholderTextColor={colors.subtext}
      />

      <Text style={[styles.label, { color: colors.text }]}>Slaptažodis *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Mažiausiai 6 simboliai"
        placeholderTextColor={colors.subtext}
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnText}>
            {isRegister ? 'Registruotis' : 'Prisijungti'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchBtn}
        onPress={() => {
          setIsRegister((prev) => !prev);
          setError('');
        }}
        disabled={submitting}
      >
        <Text style={{ color: colors.primary, fontWeight: '600' }}>
          {isRegister
            ? 'Jau turite paskyrą? Prisijunkite'
            : 'Neturite paskyros? Užsiregistruokite'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: { color: '#B91C1C', fontWeight: '600', textAlign: 'center' },
  btn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  switchBtn: { marginTop: 16, alignItems: 'center' },
});
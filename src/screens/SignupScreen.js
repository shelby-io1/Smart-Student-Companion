import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { registerUser } from '../services/firebase';
import { validateEmail, validatePassword } from '../utils/validation';
import { useTheme } from '../utils/ThemeContext';

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignup = async () => {
    const fieldErrors = {};
    if (!email.trim()) fieldErrors.email = 'Email is required';
    else if (!validateEmail(email)) fieldErrors.email = 'Invalid email format';
    if (!password.trim()) fieldErrors.password = 'Password is required';
    else if (!validatePassword(password)) fieldErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) fieldErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) fieldErrors.confirmPassword = 'Passwords do not match';

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      await registerUser(email.trim(), password);
      const parentNav = navigation.getParent();
      if (parentNav) {
        parentNav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
      } else {
        navigation.navigate('Main');
      }
    } catch (error) {
      const fieldErrors = {};
      if (error.code === 'auth/email-already-in-use') {
        fieldErrors.email = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        fieldErrors.password = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        fieldErrors.email = 'Invalid email address';
      }
      setErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.header}>
        <Text style={s.welcomeText}>Create Account</Text>
        <Text style={s.subtitle}>Join the Smart Student community</Text>
      </View>

      <View style={s.form}>
        <View style={s.inputGroup}>
          <Text style={s.label}>Email</Text>
          <View style={[s.inputWrapper, errors.email && s.inputError]}>
            <Ionicons name="mail-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={(text) => { setEmail(text); setErrors((e) => ({ ...e, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email && <Text style={s.errorText}>{errors.email}</Text>}
        </View>

        <View style={s.inputGroup}>
          <Text style={s.label}>Password</Text>
          <View style={[s.inputWrapper, errors.password && s.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="At least 6 characters"
              placeholderTextColor={theme.textMuted}
              value={password}
              onChangeText={(text) => { setPassword(text); setErrors((e) => ({ ...e, password: '' })); }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={s.errorText}>{errors.password}</Text>}
        </View>

        <View style={s.inputGroup}>
          <Text style={s.label}>Confirm Password</Text>
          <View style={[s.inputWrapper, errors.confirmPassword && s.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Re-enter your password"
              placeholderTextColor={theme.textMuted}
              value={confirmPassword}
              onChangeText={(text) => { setConfirmPassword(text); setErrors((e) => ({ ...e, confirmPassword: '' })); }}
              secureTextEntry={!showPassword}
            />
          </View>
          {errors.confirmPassword && <Text style={s.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <TouchableOpacity style={s.signupButton} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={s.signupButtonText}>Create Account</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={s.loginLink} onPress={() => navigation.goBack()}>
          <Text style={s.loginText}>
            Already have an account? <Text style={s.loginHighlight}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.backgroundColor },
  header: { paddingTop: 80, paddingHorizontal: 30, paddingBottom: 30 },
  welcomeText: { fontSize: 32, fontWeight: '800', color: theme.textPrimary },
  subtitle: { fontSize: 16, color: theme.textSecondary, marginTop: 8 },
  form: { flex: 1, paddingHorizontal: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.cardBackground, borderRadius: 12,
    paddingHorizontal: 14, height: 52,
    borderWidth: 1, borderColor: theme.borderLight,
  },
  inputError: { borderColor: '#E17055' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: theme.textPrimary },
  errorText: { color: '#E17055', fontSize: 12, marginTop: 4, marginLeft: 4 },
  signupButton: {
    backgroundColor: theme.accent, borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
    elevation: 3, shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
  signupButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: 24 },
  loginText: { fontSize: 14, color: theme.textSecondary },
  loginHighlight: { color: theme.accent, fontWeight: '700' },
});

export default SignupScreen;

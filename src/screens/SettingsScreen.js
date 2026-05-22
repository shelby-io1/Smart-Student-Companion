import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { auth, logoutUser } from '../services/firebase';
import { useTheme } from '../utils/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { isDarkMode, theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] }));
    } catch (_) {
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] }));
    }
  };

  const s = makeStyles(theme);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Settings</Text>
        <Text style={s.headerSubtitle}>Manage your preferences</Text>
      </View>

      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.section}>
          <Text style={s.sectionTitle}>Appearance</Text>
          <View style={s.settingRow}>
            <View style={s.settingInfo}>
              <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={22} color={theme.accent} />
              <Text style={s.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#DFE6E9', true: '#7BB3E6' }}
              thumbColor={isDarkMode ? theme.accent : '#FFF'}
            />
          </View>
        </View>

        <View style={s.buttonGroup}>
          <TouchableOpacity style={s.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFF" />
            <Text style={s.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.backgroundColor },
    header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: theme.cardBackground, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
    headerTitle: { fontSize: 22, fontWeight: '800', color: theme.textPrimary },
    headerSubtitle: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
    content: { paddingHorizontal: 24, paddingTop: 20 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.textPrimary, marginBottom: 14 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.cardBackground, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: theme.border },
    settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    settingLabel: { fontSize: 15, color: theme.textPrimary, fontWeight: '500' },
    buttonGroup: { gap: 10, marginBottom: 24 },
    logoutButton: { flexDirection: 'row', backgroundColor: '#E17055', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 3, shadowColor: '#E17055', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
    logoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  });

export default SettingsScreen;

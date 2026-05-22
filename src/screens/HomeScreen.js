import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, RefreshControl, Alert, Modal, TextInput, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, getNotes } from '../services/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../utils/ThemeContext';

const QUICK_ACTIONS = [
  { icon: 'book-outline', label: 'Notes', screen: 'Notes', color: '#6C63FF' },
  { icon: 'compass-outline', label: 'Explore', screen: 'Explore', color: '#00B894' },
  { icon: 'settings-outline', label: 'Settings', screen: 'Settings', color: '#FDCB6E' },
];

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'English', 'History', 'Art',
];

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  const [user, setUser] = useState(auth.currentUser);
  const [recentNotes, setRecentNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [favoriteSubject, setFavoriteSubject] = useState('');
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadRecentNotes = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const notes = await getNotes(currentUser.uid);
        setRecentNotes(notes.slice(0, 3));
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    setUser(auth.currentUser);
    const currentUid = auth.currentUser?.uid;
    if (currentUid) {
      AsyncStorage.getItem(`@profile_name_${currentUid}`).then((n) => {
        if (n) setDisplayName(n);
      }).catch(() => {});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentNotes();
    }, [loadRecentNotes])
  );

  const uid = user?.uid;

  const openEditModal = async () => {
    try {
      const savedName = await AsyncStorage.getItem(`@profile_name_${uid}`);
      const savedUsername = await AsyncStorage.getItem(`@profile_username_${uid}`);
      const savedSubject = await AsyncStorage.getItem(`@profile_subject_${uid}`);
      if (savedName) setName(savedName);
      if (savedUsername) setUsername(savedUsername);
      if (savedSubject) setFavoriteSubject(savedSubject);
    } catch (_) {}
    setNewPassword('');
    setCurrentPassword('');
    setModalVisible(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem(`@profile_name_${uid}`, name);
      await AsyncStorage.setItem(`@profile_username_${uid}`, username);
      await AsyncStorage.setItem(`@profile_subject_${uid}`, favoriteSubject);

      if (newPassword && currentPassword && user) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      if (name) setDisplayName(name);
      Alert.alert('Success', 'Profile updated successfully');
      setModalVisible(false);
    } catch (e) {
      if (e.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Current password is incorrect');
      } else if (e.code === 'auth/weak-password') {
        Alert.alert('Error', 'New password must be at least 6 characters');
      } else {
        Alert.alert('Error', e.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecentNotes();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{greeting},</Text>
          <Text style={s.userName}>{displayName || 'Student'}</Text>
          {user && <Text style={s.userEmail}>{user.email}</Text>}
        </View>
        <TouchableOpacity style={s.editBtn} onPress={openEditModal}>
          <Ionicons name="create-outline" size={18} color="#FFF" />
          <Text style={s.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={s.quickActions}>
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.actionGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[s.actionCard, { backgroundColor: action.color + '15' }]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[s.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={24} color="#FFF" />
              </View>
              <Text style={s.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.recentSection}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recent Notes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notes')}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentNotes.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="document-text-outline" size={40} color={theme.textMuted} />
            <Text style={s.emptyText}>No notes yet</Text>
            <Text style={s.emptySubtext}>Start adding notes in the Notes section</Text>
          </View>
        ) : (
          <FlatList
            data={recentNotes}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <View style={s.noteItem}>
                <View style={s.noteDot} />
                <View style={s.noteContent}>
                  <Text style={s.noteTitle}>{item.title}</Text>
                  <Text style={s.noteDesc} numberOfLines={1}>{item.description}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={s.label}>Name</Text>
              <TextInput
                style={s.input}
                placeholder="Enter your name"
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
              />

              <Text style={s.label}>Username</Text>
              <TextInput
                style={s.input}
                placeholder="Enter your username"
                placeholderTextColor={theme.textMuted}
                value={username}
                onChangeText={setUsername}
              />

              <Text style={s.label}>Email</Text>
              <TextInput
                style={[s.input, s.inputDisabled]}
                value={user?.email || ''}
                editable={false}
              />

              <Text style={s.label}>New Password (leave blank to keep current)</Text>
              <TextInput
                style={s.input}
                placeholder="Enter new password"
                placeholderTextColor={theme.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              {newPassword ? (
                <>
                  <Text style={s.label}>Current Password</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Enter current password"
                    placeholderTextColor={theme.textMuted}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                  />
                </>
              ) : null}

              <Text style={s.label}>Favorite Subject</Text>
              <TouchableOpacity
                style={s.pickerButton}
                onPress={() => setShowSubjectPicker(!showSubjectPicker)}
              >
                <Text style={[s.pickerText, !favoriteSubject && s.pickerPlaceholder]}>
                  {favoriteSubject || 'Select a subject'}
                </Text>
                <Ionicons name={showSubjectPicker ? 'chevron-up' : 'chevron-down'} size={20} color={theme.textSecondary} />
              </TouchableOpacity>
              {showSubjectPicker && (
                <View style={s.pickerList}>
                  {SUBJECTS.map((subj) => (
                    <TouchableOpacity
                      key={subj}
                      style={[s.pickerItem, favoriteSubject === subj && s.pickerItemActive]}
                      onPress={() => { setFavoriteSubject(subj); setShowSubjectPicker(false); }}
                    >
                      <Text style={[s.pickerItemText, favoriteSubject === subj && s.pickerItemTextActive]}>{subj}</Text>
                      {favoriteSubject === subj && <Ionicons name="checkmark" size={18} color="#FFF" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={s.saveButton} onPress={handleSaveProfile} disabled={saving}>
                <Text style={s.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.backgroundColor },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: theme.headerBg, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 30,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  greeting: { fontSize: 14, color: theme.headerText, opacity: 0.8 },
  userName: { fontSize: 24, fontWeight: '800', color: theme.headerText, marginTop: 2 },
  userEmail: { fontSize: 12, color: theme.headerText, opacity: 0.7, marginTop: 4 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16,
    paddingVertical: 10, borderRadius: 20,
  },
  editText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  quickActions: { paddingHorizontal: 24, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary, marginBottom: 14 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: { flex: 1, alignItems: 'center', paddingVertical: 20, borderRadius: 16, marginHorizontal: 4 },
  actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  recentSection: { flex: 1, paddingHorizontal: 24, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 14, color: theme.accent, fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: theme.textSecondary, marginTop: 12 },
  emptySubtext: { fontSize: 13, color: theme.textMuted, marginTop: 4 },
  noteItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cardBackground,
    padding: 14, borderRadius: 12, marginBottom: 8, elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  noteDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.accent, marginRight: 12 },
  noteContent: { flex: 1 },
  noteTitle: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  noteDesc: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: theme.cardBackground, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, maxHeight: '85%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: theme.textPrimary },
  label: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: theme.backgroundColor, borderRadius: 12, padding: 14,
    fontSize: 15, color: theme.textPrimary, borderWidth: 1, borderColor: theme.border,
  },
  inputDisabled: { opacity: 0.6 },
  pickerButton: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: theme.backgroundColor, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: theme.border,
  },
  pickerText: { fontSize: 15, color: theme.textPrimary },
  pickerPlaceholder: { color: theme.textMuted },
  pickerList: { backgroundColor: theme.cardBackground, borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  pickerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  pickerItemActive: { backgroundColor: theme.accent },
  pickerItemText: { fontSize: 14, color: theme.textPrimary },
  pickerItemTextActive: { color: '#FFF', fontWeight: '600' },
  saveButton: {
    backgroundColor: theme.accent, borderRadius: 12, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 20,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default HomeScreen;

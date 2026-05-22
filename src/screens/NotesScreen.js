import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  FlatList, TouchableOpacity, Alert, RefreshControl, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, getNotes, addNote, deleteNote } from '../services/firebase';
import { useTheme } from '../utils/ThemeContext';

const NotesScreen = () => {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const loadNotes = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const fetchedNotes = await getNotes(user.uid);
        setNotes(fetchedNotes);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const handleAddNote = async () => {
    const fieldErrors = {};
    if (!title.trim()) fieldErrors.title = 'Title is required';
    if (!description.trim()) fieldErrors.description = 'Description is required';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    try {
      const user = auth.currentUser;
      if (user) {
        await addNote(user.uid, title.trim(), description.trim());
        setTitle('');
        setDescription('');
        setErrors({});
        setModalVisible(false);
        await loadNotes();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add note');
    }
  };

  const handleDeleteNote = (noteId) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const user = auth.currentUser;
            if (user) {
              await deleteNote(user.uid, noteId);
              await loadNotes();
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to delete note');
          }
        },
      },
    ]);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderNote = ({ item }) => (
    <View style={s.noteCard}>
      <View style={s.noteHeader}>
        <Text style={s.noteTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
          <Ionicons name="trash-outline" size={18} color="#E17055" />
        </TouchableOpacity>
      </View>
      <Text style={s.noteDesc}>{item.description}</Text>
      <Text style={s.noteTime}>{formatDate(item.timestamp)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>My Notes</Text>
        <Text style={s.headerCount}>{notes.length} note{notes.length !== 1 ? 's' : ''}</Text>
      </View>

      {loading ? (
        <View style={s.loadingContainer}>
          <Text style={s.loadingText}>Loading notes...</Text>
        </View>
      ) : notes.length === 0 ? (
        <View style={s.emptyState}>
          <Ionicons name="document-text-outline" size={60} color={theme.textMuted} />
          <Text style={s.emptyTitle}>No Notes Yet</Text>
          <Text style={s.emptySubtext}>Tap the + button to add your first note</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={s.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>New Note</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setErrors({}); }}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={s.inputLabel}>Title</Text>
            <TextInput
              style={[s.input, errors.title && s.inputError]}
              placeholder="Note title"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={(text) => { setTitle(text); setErrors((e) => ({ ...e, title: '' })); }}
            />
            {errors.title && <Text style={s.errorText}>{errors.title}</Text>}

            <Text style={s.inputLabel}>Description</Text>
            <TextInput
              style={[s.textArea, errors.description && s.inputError]}
              placeholder="Write your note..."
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={(text) => { setDescription(text); setErrors((e) => ({ ...e, description: '' })); }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && <Text style={s.errorText}>{errors.description}</Text>}

            <TouchableOpacity style={s.saveButton} onPress={handleAddNote}>
              <Text style={s.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24, paddingVertical: 16,
    backgroundColor: theme.cardBackground, borderBottomWidth: 1, borderBottomColor: theme.borderLight,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: theme.textPrimary },
  headerCount: { fontSize: 14, color: theme.textSecondary },
  list: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 14, color: theme.textSecondary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.textSecondary, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: theme.textMuted, marginTop: 8 },
  noteCard: {
    backgroundColor: theme.cardBackground, borderRadius: 14, padding: 16,
    marginBottom: 10, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 6,
  },
  noteHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 6,
  },
  noteTitle: { fontSize: 16, fontWeight: '700', color: theme.textPrimary, flex: 1 },
  noteDesc: { fontSize: 14, color: theme.textSecondary, lineHeight: 20 },
  noteTime: { fontSize: 12, color: theme.textMuted, marginTop: 8 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: theme.accent, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.cardBackground, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: theme.textPrimary },
  inputLabel: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: theme.borderLight, borderRadius: 12, padding: 14,
    fontSize: 15, color: theme.textPrimary, borderWidth: 1, borderColor: theme.borderLight,
  },
  textArea: {
    backgroundColor: theme.borderLight, borderRadius: 12, padding: 14,
    fontSize: 15, color: theme.textPrimary, height: 100,
    borderWidth: 1, borderColor: theme.borderLight,
  },
  inputError: { borderColor: '#E17055' },
  errorText: { color: '#E17055', fontSize: 12, marginTop: 4 },
  saveButton: {
    backgroundColor: theme.accent, borderRadius: 12, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 20,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default NotesScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Input, FilterSection } from '@/shared/ui';
import { useCategories } from '../hooks/useCategories';
import { CategoryQuestion, TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common/enum.type';

interface RouteParams {
  categoryId: string;
  category?: CategoryQuestion;
}

const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, category: initialCategory } = route.params as RouteParams;
  const { categories, loading: categoriesLoading, updateCategory, deleteCategory } = useCategories();
  const [loading, setLoading] = useState(!initialCategory);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<CategoryQuestion | null>(initialCategory || null);
  const [formData, setFormData] = useState({ descriptionCategory: '', level: '' as Level | '', type: '' as TypeQuestionCategory | '', active: true });

  useEffect(() => {
    if (!initialCategory && categoryId) { loadCategory(); }
  }, [categoryId, initialCategory]);

  useEffect(() => {
    if (category) {
      setFormData({ descriptionCategory: category.descriptionCategory, level: category.level, type: category.type, active: category.active });
    }
  }, [category]);

  const loadCategory = () => {
    try {
      setLoading(true);
      const found = categories.find((cat) => cat.id === categoryId);
      if (found) { setCategory(found); }
      else { throw new Error('Categoria no encontrada'); }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la categoria');
    } finally { setLoading(false); }
  };

  const levelOptions = Object.values(Level).map((l) => ({ value: l, label: l }));
  const typeOptions = Object.values(TypeQuestionCategory).map((t) => ({ value: t, label: t }));

  const handleInputChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const validateForm = () => {
    if (!formData.descriptionCategory.trim()) { Alert.alert('Error', 'Descripcion requerida'); return false; }
    if (!formData.level) { Alert.alert('Error', 'Nivel requerido'); return false; }
    if (!formData.type) { Alert.alert('Error', 'Tipo requerido'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      setSaving(true);
      await updateCategory(categoryId, formData);
      Alert.alert('Exito', 'Categoria actualizada', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch { Alert.alert('Error', 'No se pudo actualizar'); }
    finally { setSaving(false); }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try {
          await deleteCategory(categoryId);
          Alert.alert('Exito', 'Eliminada', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch { Alert.alert('Error', 'No se pudo eliminar'); }
      }},
    ]);
  };

  const handleToggleActive = async () => {
    try {
      setSaving(true);
      await updateCategory(categoryId, { active: !formData.active });
      setFormData((prev) => ({ ...prev, active: !prev.active }));
    } catch { Alert.alert('Error', 'No se pudo actualizar el estado'); }
    finally { setSaving(false); }
  };

  if (loading || categoriesLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#000000" /><Text style={styles.loadingText}>Cargando...</Text></View>;
  }

  if (!category) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>No se pudo cargar la categoria</Text><Button title="Volver" variant="primary" onPress={() => navigation.goBack()} style={styles.retryButton} /></View>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Categoria</Text>
        <Text style={styles.subtitle}>ID: {categoryId}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Estado:</Text>
        <TouchableOpacity style={[styles.statusButton, formData.active ? styles.statusActive : styles.statusInactive]} onPress={handleToggleActive} disabled={saving}>
          <Text style={styles.statusText}>{formData.active ? 'Activa' : 'Inactiva'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripcion</Text>
          <Input placeholder="Descripcion..." value={formData.descriptionCategory} onChangeText={(v) => handleInputChange('descriptionCategory', v)} variant="outlined" style={styles.input} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nivel</Text>
          <FilterSection title="" options={levelOptions} selectedValue={formData.level} onValueChange={(v) => handleInputChange('level', v as Level)} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo</Text>
          <FilterSection title="" options={typeOptions} selectedValue={formData.type} onValueChange={(v) => handleInputChange('type', v as TypeQuestionCategory)} />
        </View>
        <View style={styles.actionsContainer}>
          <Button title="Eliminar" variant="outlined" onPress={handleDelete} style={styles.deleteButton} />
          <View style={styles.saveActions}>
            <Button title="Cancelar" variant="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton} />
            <Button title={saving ? 'Guardando...' : 'Guardar'} variant="primary" onPress={handleSave} disabled={saving} style={styles.saveButton} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20, backgroundColor: '#000000', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#FFFFFF', opacity: 0.8 },
  statusContainer: { padding: 15, backgroundColor: '#F8F8F8', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusLabel: { fontSize: 16, fontWeight: 'bold', color: '#000000' },
  statusButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  statusActive: { backgroundColor: '#4CAF50' },
  statusInactive: { backgroundColor: '#FF9800' },
  statusText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  formContainer: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 10 },
  input: { marginBottom: 0 },
  actionsContainer: { marginTop: 20 },
  deleteButton: { marginBottom: 15, backgroundColor: '#ffffffff' },
  saveActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { flex: 1, marginRight: 10 },
  saveButton: { flex: 1, marginLeft: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20 },
  errorText: { fontSize: 18, fontWeight: 'bold', color: '#FF0000', marginBottom: 20, textAlign: 'center' },
  retryButton: { minWidth: 120 },
});

export default CategoryDetailScreen;

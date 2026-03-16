import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Input, FilterSection } from '@/shared/ui';
import { useCategories } from '../hooks/useCategories';
import { TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common/enum.type';

const CreateCategoryScreen = () => {
  const navigation = useNavigation();
  const { createCategory, loading } = useCategories();

  const [formData, setFormData] = useState({
    descriptionCategory: '',
    level: '' as Level | '',
    type: '' as TypeQuestionCategory | '',
    active: true,
  });

  const [errors, setErrors] = useState({ descriptionCategory: '', level: '', type: '' });

  const levelOptions = Object.values(Level).map((l) => ({ value: l, label: l }));
  const typeOptions = Object.values(TypeQuestionCategory).map((t) => ({ value: t, label: t }));

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = { descriptionCategory: '', level: '', type: '' };
    let isValid = true;
    if (!formData.descriptionCategory.trim()) { newErrors.descriptionCategory = 'Description is required'; isValid = false; }
    else if (formData.descriptionCategory.trim().length < 10) { newErrors.descriptionCategory = 'Min 10 characters'; isValid = false; }
    if (!formData.level) { newErrors.level = 'Level is required'; isValid = false; }
    if (!formData.type) { newErrors.type = 'Type is required'; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await createCategory({ ...formData, descriptionCategory: formData.descriptionCategory.trim() });
      Alert.alert('Success', 'Category created successfully', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create category');
    }
  };

  const handleClearForm = () => {
    setFormData({ descriptionCategory: '', level: '' as Level | '', type: '' as TypeQuestionCategory | '', active: true });
    setErrors({ descriptionCategory: '', level: '', type: '' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Category</Text>
        <Text style={styles.subtitle}>Complete the category details</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Description *</Text>
          <Input placeholder="Enter the category description..." value={formData.descriptionCategory} onChangeText={(v) => handleInputChange('descriptionCategory', v)} variant="outlined" multiline numberOfLines={3} style={styles.textArea} />
          {errors.descriptionCategory ? <Text style={styles.errorText}>{errors.descriptionCategory}</Text> : <Text style={styles.helperText}>Minimum 10 characters.</Text>}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level *</Text>
          <FilterSection title="" options={[{ value: '', label: 'Select a level' }, ...levelOptions]} selectedValue={formData.level} onValueChange={(v) => handleInputChange('level', v)} />
          {errors.level && <Text style={styles.errorText}>{errors.level}</Text>}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type *</Text>
          <FilterSection title="" options={[{ value: '', label: 'Select a type' }, ...typeOptions]} selectedValue={formData.type} onValueChange={(v) => handleInputChange('type', v)} />
          {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
        </View>
        <View style={styles.actionsContainer}>
          <Button title="Clear" variant="outlined" onPress={handleClearForm} style={styles.clearButton} disabled={loading} size="medium" />
          <Button title="Cancel" variant="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton} disabled={loading} size="medium" />
          <Button title={loading ? 'Creating...' : 'Create Category'} variant="primary" onPress={handleSubmit} style={styles.submitButton} disabled={loading} size="medium" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20, backgroundColor: '#000000', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#FFFFFF', opacity: 0.9 },
  formContainer: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 10 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  errorText: { color: '#FF0000', fontSize: 14, marginTop: 5, fontWeight: '500' },
  helperText: { color: '#666666', fontSize: 12, marginTop: 5, fontStyle: 'italic' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },
  clearButton: { flex: 1 },
  cancelButton: { flex: 1 },
  submitButton: { flex: 2 },
});

export default CreateCategoryScreen;

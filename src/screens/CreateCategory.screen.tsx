import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LevelCategoryQuestion, TypeQuestionCategory } from '../types/type';
import Button from '../components/Button.component';
import Input from '../components/Input.component';
import FilterSection from '../components/FilterSection.component';
import { useCategories } from '../hooks/useCategories';

const CreateCategoryScreen = () => {
  const navigation = useNavigation();
  const { createCategory, loading } = useCategories();

  const [formData, setFormData] = useState({
    descriptionCategory: '',
    level: '' as LevelCategoryQuestion | '',
    type: '' as TypeQuestionCategory | '',
    active: true
  });

  const [errors, setErrors] = useState({
    descriptionCategory: '',
    level: '',
    type: ''
  });

  const levelOptions = Object.values(LevelCategoryQuestion).map(level => ({
    value: level,
    label: level
  }));

  const typeOptions = Object.values(TypeQuestionCategory).map(type => ({
    value: type,
    label: type
  }));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      descriptionCategory: '',
      level: '',
      type: ''
    };

    let isValid = true;

    if (!formData.descriptionCategory.trim()) {
      newErrors.descriptionCategory = 'Description is required';
      isValid = false;
    } else if (formData.descriptionCategory.trim().length < 10) {
      newErrors.descriptionCategory = 'Description must be at least 10 characters';
      isValid = false;
    }

    if (!formData.level) {
      newErrors.level = 'Level is required';
      isValid = false;
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        descriptionCategory: formData.descriptionCategory.trim()
      };

      await createCategory(submitData);
      
      Alert.alert('Success', 'Category created successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create category');
      console.error('Error creating category:', error);
    }
  };

  const handleClearForm = () => {
    setFormData({
      descriptionCategory: '',
      level: '' as LevelCategoryQuestion | '',
      type: '' as TypeQuestionCategory | '',
      active: true
    });
    setErrors({
      descriptionCategory: '',
      level: '',
      type: ''
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create New Category</Text>
        <Text style={styles.subtitle}>Complete the category details</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Category Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Description *</Text>
          <Input
            placeholder="Enter the category description..."
            value={formData.descriptionCategory}
            onChangeText={(value) => handleInputChange('descriptionCategory', value)}
            variant="outlined"
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
          {errors.descriptionCategory ? (
            <Text style={styles.errorText}>{errors.descriptionCategory}</Text>
          ) : (
            <Text style={styles.helperText}>
              Minimum 10 characters. Describe the content and purpose of this category.
            </Text>
          )}
        </View>

        {/* Category Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level *</Text>
          <FilterSection
            title=""
            options={[{ value: '', label: 'Select a level' }, ...levelOptions]}
            selectedValue={formData.level}
            onValueChange={(value) => handleInputChange('level', value)}
          />
          {errors.level && (
            <Text style={styles.errorText}>{errors.level}</Text>
          )}
        </View>

        {/* Category Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type *</Text>
          <FilterSection
            title=""
            options={[{ value: '', label: 'Select a type' }, ...typeOptions]}
            selectedValue={formData.type}
            onValueChange={(value) => handleInputChange('type', value)}
          />
          {errors.type && (
            <Text style={styles.errorText}>{errors.type}</Text>
          )}
        </View>

        {/* Category Summary */}
        {(formData.descriptionCategory || formData.level || formData.type) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryContainer}>
              {formData.descriptionCategory && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Description:</Text>
                  <Text style={styles.summaryValue}>{formData.descriptionCategory}</Text>
                </View>
              )}
              {formData.level && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Level:</Text>
                  <Text style={styles.summaryValue}>{formData.level}</Text>
                </View>
              )}
              {formData.type && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Type:</Text>
                  <Text style={styles.summaryValue}>{formData.type}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Clear"
            variant="outlined"
            onPress={handleClearForm}
            style={styles.clearButton}
            disabled={loading}
            size="medium"
          />
          <Button
            title="Cancel"
            variant="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={loading}
            size="medium"
          />
          <Button
            title={loading ? "Creating..." : "Create Category"}
            variant="primary"
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
            size="medium"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  helperText: {
    color: '#666666',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  statusContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    overflow: 'hidden',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  statusButtonActive: {
    backgroundColor: '#4CAF50',
  },
  statusButtonInactive: {
    backgroundColor: '#FF9800',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  statusButtonTextInactive: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    width: 100,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  activeStatus: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  inactiveStatus: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  clearButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default CreateCategoryScreen;
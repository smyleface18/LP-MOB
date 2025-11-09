import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CategoryQuestion, LevelCategoryQuestion, TypeQuestionCategory } from '../types/type';
import Button from '../components/Button.component';
import Input from '../components/Input.component';
import FilterSection from '../components/FilterSection.component';
import { useCategories } from '../hooks/useCategories';

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

  const [formData, setFormData] = useState({
    descriptionCategory: '',
    level: '' as LevelCategoryQuestion | '',
    type: '' as TypeQuestionCategory | '',
    active: true
  });

  // Cargar la categoría si no viene en los params
  useEffect(() => {
    if (!initialCategory && categoryId) {
      loadCategory();
    }
  }, [categoryId, initialCategory]);

  // Actualizar formData cuando la categoría se carga
  useEffect(() => {
    if (category) {
      setFormData({
        descriptionCategory: category.descriptionCategory,
        level: category.level,
        type: category.type,
        active: category.active
      });
    }
  }, [category]);

  const loadCategory = () => {
    try {
      setLoading(true);
      // Buscar en las categorías ya cargadas
      const foundCategory = categories.find(cat => cat.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        throw new Error('Categoría no encontrada');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la categoría');
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

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
  };

  const validateForm = () => {
    if (!formData.descriptionCategory.trim()) {
      Alert.alert('Error', 'Debe proporcionar una descripción para la categoría');
      return false;
    }

    if (!formData.level) {
      Alert.alert('Error', 'Debe seleccionar un nivel');
      return false;
    }

    if (!formData.type) {
      Alert.alert('Error', 'Debe seleccionar un tipo');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await updateCategory(categoryId, formData);
      Alert.alert('Éxito', 'Categoría actualizada correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la categoría');
      console.error('Error updating category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Categoría',
      '¿Estás seguro de que quieres eliminar esta categoría?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
              Alert.alert('Éxito', 'Categoría eliminada correctamente', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack()
                }
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la categoría');
            }
          }
        }
      ]
    );
  };

  const handleToggleActive = async () => {
    try {
      setSaving(true);
      await updateCategory(categoryId, { active: !formData.active });
      setFormData(prev => ({ ...prev, active: !prev.active }));
      Alert.alert('Éxito', `Categoría ${!formData.active ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado de la categoría');
    } finally {
      setSaving(false);
    }
  };

  if (loading || categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Cargando categoría...</Text>
      </View>
    );
  }

  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la categoría</Text>
        <Button
          title="Volver"
          variant="primary"
          onPress={() => navigation.goBack()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Editar Categoría</Text>
        <Text style={styles.subtitle}>ID: {categoryId}</Text>
      </View>

      {/* Estado de la Categoría */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Estado:</Text>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.active ? styles.statusActive : styles.statusInactive
            ]}
            onPress={handleToggleActive}
            disabled={saving}
          >
            <Text style={styles.statusText}>
              {formData.active ? 'Activa' : 'Inactiva'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulario */}
      <View style={styles.formContainer}>
        {/* Descripción de la Categoría */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción de la Categoría</Text>
          <Input
            placeholder="Ingrese la descripción de la categoría..."
            value={formData.descriptionCategory}
            onChangeText={(value) => handleInputChange('descriptionCategory', value)}
            variant="outlined"
            style={styles.input}
          />
        </View>

        {/* Nivel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nivel</Text>
          <FilterSection
            title=""
            options={levelOptions}
            selectedValue={formData.level}
            onValueChange={(value) => handleInputChange('level', value as LevelCategoryQuestion)}
          />
        </View>

        {/* Tipo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo</Text>
          <FilterSection
            title=""
            options={typeOptions}
            selectedValue={formData.type}
            onValueChange={(value) => handleInputChange('type', value as TypeQuestionCategory)}
          />
        </View>

        {/* Información de la Categoría */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Información de la Categoría</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Preguntas asociadas:</Text>
            <Text style={styles.infoValue}>{category.questions?.length || 0}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Creada:</Text>
            <Text style={styles.infoValue}>
              {new Date(category.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Actualizada:</Text>
            <Text style={styles.infoValue}>
              {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <Button
            title="Eliminar"
            variant="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
          />
          <View style={styles.saveActions}>
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
            <Button
              title={saving ? "Guardando..." : "Guardar Cambios"}
              variant="primary"
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
            />
          </View>
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
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statusContainer: {
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusInactive: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
  input: {
    marginBottom: 0,
  },
  infoContainer: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#000000',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: 20,
  },
  deleteButton: {
    marginBottom: 15,
    backgroundColor: '#ffffffff',
  },
  saveActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
});

export default CategoryDetailScreen;
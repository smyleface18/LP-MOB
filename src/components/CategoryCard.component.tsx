import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { CategoryQuestion, LevelCategoryQuestion, TypeQuestionCategory } from '../types/type';
import Button from './Button.component';

interface CategoryCardProps {
  category: CategoryQuestion;
  onEdit: (category: CategoryQuestion) => void;
  onDelete: (categoryId: string) => void;
  onToggleActive: (categoryId: string) => void;
  onPress?: (category: CategoryQuestion) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onPress 
}) => {
  
  const getLevelColor = (level: LevelCategoryQuestion) => {
    const colors = {
      [LevelCategoryQuestion.A1]: '#4CAF50',
      [LevelCategoryQuestion.A2]: '#8BC34A',
      [LevelCategoryQuestion.B1]: '#FFC107',
      [LevelCategoryQuestion.B2]: '#FF9800',
      [LevelCategoryQuestion.C1]: '#F44336',
      [LevelCategoryQuestion.C2]: '#D32F2F'
    };
    return colors[level] || '#666666';
  };

  const getTypeColor = (type: TypeQuestionCategory) => {
    const colors = {
      [TypeQuestionCategory.LISTENING]: '#2196F3',
      [TypeQuestionCategory.GRAMMAR]: '#FF5722',
      [TypeQuestionCategory.READING]: '#9C27B0',
      [TypeQuestionCategory.VOCABULARY]: '#4CAF50',
      [TypeQuestionCategory.WRITING]: '#FF9800',
      [TypeQuestionCategory.SPEAKING]: '#E91E63'
    };
    return colors[type] || '#666666';
  };

  const CardContent = () => (
    <View style={styles.cardContent}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.categoryText} numberOfLines={2}>
            {category.descriptionCategory}
          </Text>
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: getLevelColor(category.level) }]}>
              <Text style={styles.tagText}>{category.level}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: getTypeColor(category.type) }]}>
              <Text style={styles.tagText}>{category.type}</Text>
            </View>
          </View>
        </View>
        <Switch
          value={category.active}
          onValueChange={() => onToggleActive(category.id)}
          trackColor={{ false: '#767577', true: '#767577' }}
          thumbColor={category.active ? '#ff0000ff' : '#f4f3f4'}
        />
      </View>
      
      <Text style={styles.questionsCount}>
        Questions: {category.questions?.length || 0}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => onPress(category)}
        activeOpacity={0.7}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#000000',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  questionsCount: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    marginRight: 8,
    minWidth: 80,
  },
  deleteButton: {
    minWidth: 80,
  },
});

export default CategoryCard;
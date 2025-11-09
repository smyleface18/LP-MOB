import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Question, LevelCategoryQuestion, TypeQuestionCategory } from '../types/type';

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
  onToggleActive: (questionId: string) => void;
  onPress?: (question: Question) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onPress 
}) => {
  const category = question.category;
  
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
          <Text style={styles.questionText} numberOfLines={2}>
            {question.questionText || 'Pregunta con imagen'}
          </Text>
          <View style={styles.tagsContainer}>
            {category?.level && (
              <View style={[styles.tag, { backgroundColor: getLevelColor(category.level) }]}>
                <Text style={styles.tagText}>{category.level}</Text>
              </View>
            )}
            {category?.type && (
              <View style={[styles.tag, { backgroundColor: getTypeColor(category.type) }]}>
                <Text style={styles.tagText}>{category.type}</Text>
              </View>
            )}
            {(!category?.level || !category?.type) && (
              <View style={[styles.tag, { backgroundColor: '#666666' }]}>
                <Text style={styles.tagText}>Sin categoría</Text>
              </View>
            )}
          </View>
        </View>
        <Switch
          value={question.active}
          onValueChange={() => onToggleActive(question.id)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={question.active ? '#FF0000' : '#f4f3f4'}
        />
      </View>
      
      {category && (
        <Text style={styles.categoryText}>
          Categoría: {category.descriptionCategory}
        </Text>
      )}
      
      <Text style={styles.optionsText}>
        Opciones: {question.options.join(', ')}
      </Text>
      
      <Text style={styles.correctAnswer}>
        Respuesta correcta: {question.correctAnswer}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => onPress(question)}
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
    borderLeftColor: '#FF0000',
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
  questionText: {
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
  categoryText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  optionsText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
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

export default QuestionCard;
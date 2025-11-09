import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  LevelCategoryQuestion,
  TypeQuestionCategory,
  CategoryQuestion,
} from "../types/type";
import Button from "../components/Button.component";
import Input from "../components/Input.component";
import FilterSection from "../components/FilterSection.component";
import { useCategories } from "../hooks/useCategories";
import { questionService } from "../services/question.service";

const CreateQuestionScreen = () => {
  const navigation = useNavigation();
  const { categories, loading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState({
    questionText: "",
    questionImage: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    categoryId: "",
    active: true,
  });

  const [selectedLevel, setSelectedLevel] = useState<
    LevelCategoryQuestion | ""
  >("");
  const [selectedType, setSelectedType] = useState<TypeQuestionCategory | "">(
    ""
  );

  // Filter categories based on selected level and type
  const filteredCategories = categories.filter((category) => {
    const matchesLevel = !selectedLevel || category.level === selectedLevel;
    const matchesType = !selectedType || category.type === selectedType;
    return matchesLevel && matchesType;
  });

  const categoryOptions = filteredCategories.map((cat) => ({
    value: cat.id,
    label: cat.descriptionCategory,
  }));

  const levelOptions = Object.values(LevelCategoryQuestion).map((level) => ({
    value: level,
    label: level,
  }));

  const typeOptions = Object.values(TypeQuestionCategory).map((type) => ({
    value: type,
    label: type,
  }));

  // Get selected category to display in summary
  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleAddOption = () => {
    if (formData.options.length < 6) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        options: newOptions,
        correctAnswer:
          prev.correctAnswer === prev.options[index] ? "" : prev.correctAnswer,
      }));
    }
  };

  const handleSetCorrectAnswer = (answer: string) => {
    setFormData((prev) => ({
      ...prev,
      correctAnswer: answer,
    }));
  };

  const handleClearForm = () => {
    setFormData({
      questionText: "",
      questionImage: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      categoryId: "",
      active: true,
    });
    setSelectedLevel("");
    setSelectedType("");
  };

  const validateForm = () => {
    if (!formData.questionText && !formData.questionImage) {
      Alert.alert("Error", "You must provide question text or image");
      return false;
    }

    if (formData.options.filter((opt) => opt.trim() !== "").length < 2) {
      Alert.alert("Error", "You must provide at least 2 options");
      return false;
    }

    if (!formData.correctAnswer) {
      Alert.alert("Error", "You must select a correct answer");
      return false;
    }

    if (!formData.categoryId) {
      Alert.alert("Error", "You must select a category");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        options: formData.options.filter((opt) => opt.trim() !== ""),
      };

      await questionService.create(submitData);
      Alert.alert("Success", "Question created successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create question");
      console.error("Error creating question:", error);
    }
  };

  if (categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create New Question</Text>
        <Text style={styles.subtitle}>Complete the question details</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Question Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Question Text</Text>
          <Input
            placeholder="Enter the question text..."
            value={formData.questionText}
            onChangeText={(value) => handleInputChange("questionText", value)}
            variant="outlined"
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </View>

        {/* Question Image (Optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Question Image (Optional)
          </Text>
          <Input
            placeholder="Image URL..."
            value={formData.questionImage}
            onChangeText={(value) => handleInputChange("questionImage", value)}
            variant="outlined"
          />
        </View>

        {/* Category Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter Categories</Text>
          <FilterSection
            title="Level"
            options={[
              { value: "", label: "All levels" },
              ...levelOptions,
            ]}
            selectedValue={selectedLevel}
            onValueChange={(value) =>
              setSelectedLevel(value as LevelCategoryQuestion | "")
            }
          />

          <FilterSection
            title="Type"
            options={[{ value: "", label: "All types" }, ...typeOptions]}
            selectedValue={selectedType}
            onValueChange={(value) =>
              setSelectedType(value as TypeQuestionCategory | "")
            }
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          {categoryOptions.length > 0 ? (
            <FilterSection
              title=""
              options={categoryOptions}
              selectedValue={formData.categoryId}
              onValueChange={(value) => handleInputChange("categoryId", value)}
            />
          ) : (
            <Text style={styles.noCategoriesText}>
              No categories available with the selected filters
            </Text>
          )}
        </View>

        {/* Answer Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Answer Options</Text>
            <Text style={styles.optionCount}>
              {formData.options.filter((opt) => opt.trim() !== "").length}/6
            </Text>
          </View>

          {formData.options.map((option, index) => (
            <View key={index} style={styles.optionRow}>
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChangeText={(value) => handleOptionChange(index, value)}
                variant="outlined"
                style={styles.optionInput}
              />
              <View style={styles.optionActions}>
                <TouchableOpacity
                  style={[
                    styles.correctAnswerButton,
                    formData.correctAnswer === option &&
                      styles.correctAnswerButtonActive,
                  ]}
                  onPress={() =>
                    option.trim() && handleSetCorrectAnswer(option)
                  }
                >
                  <Text
                    style={[
                      styles.correctAnswerText,
                      formData.correctAnswer === option &&
                        styles.correctAnswerTextActive,
                    ]}
                  >
                    ✓
                  </Text>
                </TouchableOpacity>
                {formData.options.length > 2 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveOption(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {formData.options.length < 6 && (
            <Button
              title="+ Add Option"
              variant="outlined"
              size="small"
              onPress={handleAddOption}
              style={styles.addOptionButton}
            />
          )}
        </View>

        {/* Question Summary */}
        {(formData.questionText || formData.questionImage || formData.categoryId || formData.correctAnswer) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Question Summary</Text>
            <View style={styles.summaryContainer}>
              {formData.questionText && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Question:</Text>
                  <Text style={styles.summaryValue}>{formData.questionText}</Text>
                </View>
              )}
              {formData.questionImage && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Image:</Text>
                  <Text style={styles.summaryValue}>{formData.questionImage}</Text>
                </View>
              )}
              {selectedCategory && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Category:</Text>
                  <Text style={styles.summaryValue}>
                    {selectedCategory.descriptionCategory} ({selectedCategory.level} - {selectedCategory.type})
                  </Text>
                </View>
              )}
              {formData.correctAnswer && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Correct Answer:</Text>
                  <Text style={[styles.summaryValue, styles.correctAnswer]}>
                    {formData.correctAnswer}
                  </Text>
                </View>
              )}
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Options:</Text>
                <Text style={styles.summaryValue}>
                  {formData.options.filter(opt => opt.trim() !== '').length} options
                </Text>
              </View>
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
            size="medium"
          />
          <Button
            title="Cancel"
            variant="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            size="medium"
          />
          <Button
            title="Create Question"
            variant="primary"
            onPress={handleSubmit}
            style={styles.submitButton}
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 20,
    backgroundColor: "#000000",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  noCategoriesText: {
    color: "#666666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    marginRight: 10,
  },
  optionActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  correctAnswerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  correctAnswerButtonActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  correctAnswerText: {
    fontSize: 16,
    color: "#666666",
  },
  correctAnswerTextActive: {
    color: "#FFFFFF",
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  addOptionButton: {
    marginTop: 10,
  },
  optionCount: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "bold",
  },
  summaryContainer: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  summaryItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    width: 120,
  },
  summaryValue: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  correctAnswer: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default CreateQuestionScreen;
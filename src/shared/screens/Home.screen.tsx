import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header con Logo */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/LinguaPlay-bg.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>LinguaPlay</Text>
        <Text style={styles.subtitle}>Aprende inglés jugando</Text>
      </View>

      {/* Sección de Noticias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📰 Noticias y Novedades</Text>
        <View style={styles.newsCard}>
          <Text style={styles.newsTitle}>Nueva funcionalidad: Modo Vocabulario</Text>
          <Text style={styles.newsDate}>Publicado el 15 Dic 2024</Text>
          <Text style={styles.newsContent}>
            Hemos añadido un nuevo modo de juego para practicar vocabulario con imágenes interactivas.
          </Text>
        </View>
        <View style={styles.newsCard}>
          <Text style={styles.newsTitle}>Actualización de contenidos</Text>
          <Text style={styles.newsDate}>Publicado el 10 Dic 2024</Text>
          <Text style={styles.newsContent}>
            Más de 100 nuevas palabras añadidas a nuestros cursos básicos e intermedios.
          </Text>
        </View>
      </View>

      {/* Sección de Nuevas Funcionalidades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Nuevas Funcionalidades</Text>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>• Modo Multijugador</Text>
          <Text style={styles.featureDescription}>Reta a tus amigos en tiempo real</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>• Logros y Recompensas</Text>
          <Text style={styles.featureDescription}>Desbloquea insignias por tu progreso</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>• Estadísticas Detalladas</Text>
          <Text style={styles.featureDescription}>Sigue tu evolución de aprendizaje</Text>
        </View>
      </View>

      {/* Sección de Preguntas Frecuentes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❓ Preguntas Frecuentes</Text>
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>¿Cómo cambio mi nivel de inglés?</Text>
          <Text style={styles.faqAnswer}>
            Ve a Configuración → Mi Nivel y selecciona el que mejor se adapte a ti.
          </Text>
        </View>
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>¿Puedo usar la app sin internet?</Text>
          <Text style={styles.faqAnswer}>
            Sí, algunos modos de juego están disponibles offline una vez descargados.
          </Text>
        </View>
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>¿Cómo restablezco mi contraseña?</Text>
          <Text style={styles.faqAnswer}>
            En la pantalla de login, pulsa "¿Olvidaste tu contraseña?" y sigue los pasos.
          </Text>
        </View>
      </View>

      {/* Botón de Siguiente */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 20, // Espacio extra para el botón
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FF0000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  newsCard: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF0000',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  newsContent: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666666',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#FF0000',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
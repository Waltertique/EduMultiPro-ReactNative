import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import NavAulaAlumno from "./NavAulaAlumno";
import colors from "../colors";

export default function PersonasAlumno() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  // ⚠️ En React Native no hay localStorage, toca usar AsyncStorage.
  // Para este ejemplo, simulamos un usuario
  const usuario = { id: 1, rol: "R001" }; // reemplaza luego con AsyncStorage
  const usuarioId = usuario?.id;

  const [compañeros, setCompañeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursoId, setCursoId] = useState(null);

  useEffect(() => {
    const fetchCompañeros = async () => {
      try {
        // Primero obtenemos el aula para saber el curso_id
        const resAula = await fetch(`http://192.168.1.53:3000/api/edumultipro/Aulas/${id}`);
        if (!resAula.ok) {
          throw new Error(`Error HTTP: ${resAula.status}`);
        }
        
        const aula = await resAula.json();
        console.log("Datos del aula:", aula);
        
        // Extraemos el curso_id del aula (ajusta según la estructura real de tu respuesta)
        const cursoId = aula.curso_id || aula.ID; // Ajusta según tu estructura
        
        // Ahora obtenemos los integrantes del curso usando la ruta correcta
        const resCompañeros = await fetch(`http://192.168.1.53:3000/api/edumultipro/Cursos/${cursoId}/integrantes`);
        if (!resCompañeros.ok) {
          throw new Error(`Error HTTP: ${resCompañeros.status}`);
        }
        
        const compañerosData = await resCompañeros.json();
        console.log("Compañeros obtenidos:", compañerosData);
        
        setCompañeros(compañerosData);
        setCursoId(cursoId);
      } catch (err) {
        console.error("Error cargando compañeros:", err);
        Alert.alert("Error", "No se pudieron cargar los compañeros del curso");
      } finally {
        setLoading(false);
      }
    };

    fetchCompañeros();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.azulPrimario} />
        <Text>Cargando compañeros...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.compañeroItem}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {item.Primer_Nombre?.charAt(0)}{item.Primer_Apellido?.charAt(0)}
        </Text>
      </View>
      <View style={styles.compañeroInfo}>
        <Text style={styles.nombre}>
          {item.Primer_Nombre} {item.Segundo_Nombre || ''} {item.Primer_Apellido} {item.Segundo_Apellido || ''}
        </Text>
        <Text style={styles.id}>ID: {item.ID}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Encabezado />
      <NavAulaAlumno navigation={navigation} id={id} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Aula */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Compañeros de Curso</Text>
          <Text style={styles.bannerSubtitle}>
            {compañeros.length} {compañeros.length === 1 ? 'compañero' : 'compañeros'} en total
          </Text>
          {cursoId && <Text style={styles.cursoId}>Curso ID: {cursoId}</Text>}
        </View>

        {/* Lista de compañeros */}
        <FlatList
          data={compañeros}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay compañeros en este curso</Text>
            </View>
          }
        />
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.fondo 
  },
  scrollContent: { 
    padding: 15,
    paddingBottom: 20 
  },
  loading: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  banner: { 
    marginBottom: 20, 
    alignItems: "center" 
  },
  bannerTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: colors.azulPrimario 
  },
  bannerSubtitle: { 
    fontSize: 16, 
    color: colors.grisOscuro,
    marginBottom: 5
  },
  cursoId: {
    fontSize: 14,
    color: colors.gris,
    fontStyle: 'italic'
  },
  compañeroItem: {
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.azulPrimario,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: colors.blanco2,
    fontWeight: "bold",
    fontSize: 16,
  },
  compañeroInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 4,
  },
  id: {
    fontSize: 14,
    color: colors.grisOscuro,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.grisOscuro,
    fontStyle: "italic",
  },
});
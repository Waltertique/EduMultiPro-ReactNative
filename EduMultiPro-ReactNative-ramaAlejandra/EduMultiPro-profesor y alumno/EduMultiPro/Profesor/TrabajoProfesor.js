import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  TextInput
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";
import colors from "../colors";

import { apiFetch } from "../api";
import { STATIC_URL } from "../api"; // 👈 importa aquí

export default function TrabajosProfesor() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [trabajoAEliminar, setTrabajoAEliminar] = useState(null);

  useEffect(() => {
    const obtenerTrabajos = async () => {
      try {
        const res = await apiFetch(`Trabajos/Aula/${id}`);
        const data = await res.json();
        setTrabajos(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener trabajos:", err);
        Alert.alert("Error", "No se pudieron cargar los trabajos");
        setLoading(false);
      }
    };

    if (id) obtenerTrabajos();
  }, [id]);

  const eliminarTrabajo = async (trabajoId) => {
    try {
      const res = await apiFetch(`Trabajo/${trabajoId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        Alert.alert("Éxito", "Trabajo eliminado correctamente");
        setTrabajos(prev => prev.filter(t => t.ID !== trabajoId));
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Error al eliminar el trabajo");
      }
    } catch (err) {
      console.error("Error al eliminar trabajo:", err);
      Alert.alert("Error", "Error al conectar con el servidor");
    }
  };

  const confirmarEliminacion = (trabajoId) => {
    setTrabajoAEliminar(trabajoId);
    setModalVisible(true);
  };

  const navegarAPrincipal = () => {
    navigation.navigate("VerAulaProfesor", { id });
  };

  const navegarANotas = () => {
    navigation.navigate("VerTrabajoProfesor", { id });
  };

  const navegarAPersonas = () => {
    navigation.navigate("PersonaProfesor", { id });
  };

  const navegarACrearTrabajo = () => {
    navigation.navigate("TrabajoProfesor", { id });
  };

  const navegarAVerTrabajo = (trabajoId) => {
    navigation.navigate("VerTrabajoProfesor", { trabajoId, aulaId: id });
  };

  const navegarAActualizarTrabajo = (trabajoId) => {
    navigation.navigate("VerTrabajoProfesor", { trabajoId, aulaId: id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando trabajos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableProfesor />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contenido}>
          {/* Navegación dentro del aula */}
          <View style={styles.navAula}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={navegarAPrincipal}
            >
              <Text style={styles.navButtonText}>Principal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButtonActive}
              onPress={() => {}} // Ya estamos en Trabajos
            >
              <Text style={styles.navButtonTextActive}>Trabajos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={navegarANotas}
            >
              <Text style={styles.navButtonText}>Notas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={navegarAPersonas}
            >
              <Text style={styles.navButtonText}>Personas</Text>
            </TouchableOpacity>
          </View>

          {/* Título + botón */}
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Trabajos</Text>
            <TouchableOpacity 
              style={styles.crearButton}
              onPress={navegarACrearTrabajo}
            >
              <Text style={styles.crearButtonText}>Crear Trabajo</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de trabajos */}
          {trabajos.length === 0 ? (
            <View style={styles.sinTrabajos}>
              <Icon name="file-text" size={50} color={colors.grisMedio} />
              <Text style={styles.sinTrabajosTexto}>No hay trabajos en este aula</Text>
            </View>
          ) : (
            <FlatList
              data={trabajos}
              keyExtractor={(item) => item.ID.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.trabajoItem}>
                  <View style={styles.trabajoInfo}>
                    <Text style={styles.trabajoTitulo}>{item.Titulo_Trabajo}</Text>
                    <Text style={styles.trabajoFecha}>
                      Fecha de entrega: {new Date(item.Fecha_Trabajo).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.trabajoAcciones}>
                    <TouchableOpacity
                      style={styles.accionButton}
                      onPress={() => navegarAVerTrabajo(item.ID)}
                    >
                      <Icon name="info-circle" size={20} color={colors.blanco2} />
                      <Text style={styles.accionButtonText}>Info</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.accionButton, styles.modificarButton]}
                      onPress={() => navegarAActualizarTrabajo(item.ID)}
                    >
                      <Icon name="gear" size={20} color={colors.blanco2} />
                      <Text style={styles.accionButtonText}>Modificar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.accionButton, styles.eliminarButton]}
                      onPress={() => confirmarEliminacion(item.ID)}
                    >
                      <Icon name="trash" size={20} color={colors.blanco2} />
                      <Text style={styles.accionButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          {/* Modal de confirmación de eliminación */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Confirmar eliminación</Text>
                <Text style={styles.modalMessage}>
                  ¿Estás seguro de que quieres eliminar este trabajo?
                </Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => eliminarTrabajo(trabajoAEliminar)}
                  >
                    <Text style={styles.modalButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.fondo,
  },
  contenido: {
    padding: 16,
  },
  navAula: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
  },
  navButtonActive: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.azulPrimario,
  },
  navButtonText: {
    color: colors.grisOscuro,
    fontWeight: "bold",
  },
  navButtonTextActive: {
    color: colors.blanco2,
    fontWeight: "bold",
  },
  tituloContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.azulPrimario,
  },
  crearButton: {
    backgroundColor: colors.azulPrimario,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  crearButtonText: {
    color: colors.blanco2,
    fontWeight: "bold",
  },
  sinTrabajos: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sinTrabajosTexto: {
    marginTop: 16,
    fontSize: 16,
    color: colors.grisOscuro,
    textAlign: "center",
  },
  trabajoItem: {
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  trabajoInfo: {
    marginBottom: 12,
  },
  trabajoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 8,
  },
  trabajoFecha: {
    fontSize: 14,
    color: colors.grisOscuro,
  },
  trabajoAcciones: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  accionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.azulSecundario,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  modificarButton: {
    backgroundColor: colors.azulPrimario,
  },
  eliminarButton: {
    backgroundColor: "#dc3545",
  },
  accionButtonText: {
    color: colors.blanco2,
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.blanco2,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: colors.azulPrimario,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: colors.grisOscuro,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.grisMedio,
  },
  confirmButton: {
    backgroundColor: "#dc3545",
  },
  modalButtonText: {
    color: colors.blanco2,
    fontWeight: "bold",
  },
});
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Linking
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";
import colors from "../colors";

export default function VerAulaProfesor() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [usuario, setUsuario] = useState(null);
  const [aula, setAula] = useState(null);
  const [anuncios, setAnuncios] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [mostrarFormularioAnuncio, setMostrarFormularioAnuncio] = useState(false);
  const [nuevoAnuncio, setNuevoAnuncio] = useState({ titulo: '', descripcion: '' });
  const [anuncioEditandoId, setAnuncioEditandoId] = useState(null);
  const [anuncioEditado, setAnuncioEditado] = useState({ titulo: '', descripcion: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener usuario desde AsyncStorage
        const usuarioString = await AsyncStorage.getItem('usuario');
        if (usuarioString) {
          const usuarioData = JSON.parse(usuarioString);
          setUsuario(usuarioData);
        }

        // Cargar datos del aula
        const resAula = await fetch(`http://localhost:3000/api/edumultipro/Aulas/${id}`);
        const aulaData = await resAula.json();
        setAula(aulaData);

        // Cargar anuncios del aula
        const resAnuncios = await fetch(`http://localhost:3000/api/edumultipro/Anuncios/Aula/${id}`);
        const anunciosData = await resAnuncios.json();
        setAnuncios(anunciosData);

        // Cargar comentarios para cada anuncio
        const comentariosPorAnuncio = {};
        for (const anuncio of anunciosData) {
          const resC = await fetch(`http://localhost:3000/api/edumultipro/Comentarios/Anuncio/${anuncio.ID}`);
          comentariosPorAnuncio[anuncio.ID] = await resC.json();
        }
        setComentarios(comentariosPorAnuncio);
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del aula");
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleCrearAnuncio = async () => {
    try {
      const formData = new FormData();
      formData.append("titulo", nuevoAnuncio.titulo);
      formData.append("descripcion", nuevoAnuncio.descripcion);
      formData.append("aula_id", aula.ID);
      formData.append("usuario_id", usuario.id);

      const res = await fetch("http://localhost:3000/api/edumultipro/Anuncios", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      Alert.alert("Éxito", data.mensaje);
      setMostrarFormularioAnuncio(false);
      setNuevoAnuncio({ titulo: '', descripcion: '' });

      // Recargar anuncios
      const anunciosRes = await fetch(`http://localhost:3000/api/edumultipro/Anuncios/Aula/${id}`);
      setAnuncios(await anunciosRes.json());
    } catch (error) {
      console.error("Error al crear anuncio:", error);
      Alert.alert("Error", "No se pudo crear el anuncio");
    }
  };

  const handleComentarioAnuncio = async (anuncioID, descripcion) => {
    try {
      if (!descripcion.trim()) return;

      const fecha = new Date().toISOString().split("T")[0];

      const res = await fetch("http://localhost:3000/api/edumultipro/Comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion,
          anuncio_id: anuncioID,
          usuario_id: usuario.id,
          fecha
        })
      });

      const data = await res.json();
      Alert.alert("Éxito", data.mensaje);

      // Recargar comentarios
      const resC = await fetch(`http://localhost:3000/api/edumultipro/Comentarios/Anuncio/${anuncioID}`);
      const nuevosComentarios = await resC.json();
      setComentarios(prev => ({ ...prev, [anuncioID]: nuevosComentarios }));
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      Alert.alert("Error", "No se pudo enviar el comentario");
    }
  };

  const handleEliminarAnuncio = async (idAnuncio) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este anuncio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`http://localhost:3000/api/edumultipro/Anuncios/${idAnuncio}`, {
                method: "DELETE",
              });
              const data = await res.json();
              Alert.alert("Éxito", data.mensaje);

              // Recargar anuncios
              const anunciosRes = await fetch(`http://localhost:3000/api/edumultipro/Anuncios/Aula/${id}`);
              setAnuncios(await anunciosRes.json());
            } catch (error) {
              console.error("Error al eliminar anuncio:", error);
              Alert.alert("Error", "No se pudo eliminar el anuncio");
            }
          }
        }
      ]
    );
  };

  const handleModificarAnuncio = async () => {
    try {
      const formData = new FormData();
      formData.append("titulo", anuncioEditado.titulo);
      formData.append("descripcion", anuncioEditado.descripcion);

      const res = await fetch(`http://localhost:3000/api/edumultipro/Anuncios/${anuncioEditandoId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      Alert.alert("Éxito", data.mensaje);
      setAnuncioEditandoId(null);

      // Recargar anuncios
      const anunciosRes = await fetch(`http://localhost:3000/api/edumultipro/Anuncios/Aula/${id}`);
      setAnuncios(await anunciosRes.json());
    } catch (error) {
      console.error("Error al modificar anuncio:", error);
      Alert.alert("Error", "No se pudo modificar el anuncio");
    }
  };

  const navegarATrabajos = () => {
    navigation.navigate("TrabajoProfesor", { id });
  };

  const navegarANotas = () => {
    navigation.navigate("VerTrabajoProfesor", { id });
  };

  const navegarAPersonas = () => {
    navigation.navigate("PersonaProfesor", { id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando aula...</Text>
      </View>
    );
  }

  if (!aula) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se pudo cargar el aula</Text>
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
              style={styles.navButtonActive}
              onPress={() => {}} // Ya estamos en Principal
            >
              <Text style={styles.navButtonTextActive}>Principal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={navegarATrabajos}
            >
              <Text style={styles.navButtonText}>Trabajos</Text>
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

          {/* Banner del aula */}
          <View style={styles.bannerAula}>
            <Text style={styles.aulaNombre}>{aula.Aula_Nombre}</Text>
            <Text style={styles.profesorNombre}>Profesor: {aula.Profesor}</Text>
          </View>

          {/* Novedades */}
          <View style={styles.novedadesHeader}>
            <Text style={styles.novedadesTitulo}>Novedades</Text>
            {usuario?.rol === 'R002' && (
              <TouchableOpacity 
                style={styles.crearAnuncioButton}
                onPress={() => setMostrarFormularioAnuncio(true)}
              >
                <Text style={styles.crearAnuncioButtonText}>Crear Anuncio</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Modal para crear anuncio */}
          <Modal
            visible={mostrarFormularioAnuncio}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setMostrarFormularioAnuncio(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Crear Anuncio</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Título"
                  value={nuevoAnuncio.titulo}
                  onChangeText={(text) => setNuevoAnuncio({ ...nuevoAnuncio, titulo: text })}
                />
                
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Descripción"
                  multiline={true}
                  numberOfLines={4}
                  value={nuevoAnuncio.descripcion}
                  onChangeText={(text) => setNuevoAnuncio({ ...nuevoAnuncio, descripcion: text })}
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setMostrarFormularioAnuncio(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={handleCrearAnuncio}
                  >
                    <Text style={styles.modalButtonText}>Publicar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Lista de anuncios */}
          {anuncios.length === 0 ? (
            <View style={styles.sinAnuncios}>
              <Text>No hay anuncios en este aula</Text>
            </View>
          ) : (
            <FlatList
              data={anuncios}
              keyExtractor={(item) => item.ID.toString()}
              scrollEnabled={false}
              renderItem={({ item: anuncio }) => (
                <View style={styles.anuncioContainer}>
                  <View style={styles.anuncioHeader}>
                    <View style={styles.anuncioUsuario}>
                      <Image
                        source={{
                          uri: `http://localhost:3000/imagenes/${anuncio.RutaFoto || 'usuario.png'}`
                        }}
                        style={styles.usuarioImagen}
                      />
                      <Text style={styles.usuarioNombre}>{anuncio.Profesor}</Text>
                    </View>
                    <Text style={styles.anuncioFecha}>
                      {new Date(anuncio.Fecha_Anuncio).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <Text style={styles.anuncioTitulo}>{anuncio.Titulo_Anuncio}</Text>
                  <Text style={styles.anuncioDescripcion}>{anuncio.Descripcion_Anuncio}</Text>
                  
                  {anuncio.Enlace_Anuncio && anuncio.Enlace_Anuncio.split(";").map((link, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => Linking.openURL(`http://localhost:3000/imagenes/${link}`)}
                    >
                      <Text style={styles.archivoLink}>Ver archivo {i + 1}</Text>
                    </TouchableOpacity>
                  ))}
                  
                  {usuario?.rol === 'R002' && (
                    <View style={styles.anuncioAcciones}>
                      <TouchableOpacity
                        style={styles.accionButton}
                        onPress={() => {
                          setAnuncioEditandoId(anuncio.ID);
                          setAnuncioEditado({
                            titulo: anuncio.Titulo_Anuncio,
                            descripcion: anuncio.Descripcion_Anuncio
                          });
                        }}
                      >
                        <Text style={styles.accionButtonText}>Modificar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.accionButton, styles.eliminarButton]}
                        onPress={() => handleEliminarAnuncio(anuncio.ID)}
                      >
                        <Text style={styles.accionButtonText}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {anuncioEditandoId === anuncio.ID && (
                    <View style={styles.editarAnuncioForm}>
                      <TextInput
                        style={styles.input}
                        value={anuncioEditado.titulo}
                        onChangeText={(text) => setAnuncioEditado({ ...anuncioEditado, titulo: text })}
                      />
                      
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        multiline={true}
                        numberOfLines={4}
                        value={anuncioEditado.descripcion}
                        onChangeText={(text) => setAnuncioEditado({ ...anuncioEditado, descripcion: text })}
                      />
                      
                      <View style={styles.editarAnuncioButtons}>
                        <TouchableOpacity
                          style={[styles.modalButton, styles.submitButton]}
                          onPress={handleModificarAnuncio}
                        >
                          <Text style={styles.modalButtonText}>Guardar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.modalButton, styles.cancelButton]}
                          onPress={() => setAnuncioEditandoId(null)}
                        >
                          <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  
                  <ComentariosAnuncio 
                    anuncioID={anuncio.ID}
                    comentarios={comentarios[anuncio.ID] || []}
                    onEnviarComentario={handleComentarioAnuncio}
                  />
                </View>
              )}
            />
          )}
        </View>
        
        <Footer />
      </ScrollView>
    </View>
  );
}

// Componente separado para comentarios
function ComentariosAnuncio({ anuncioID, comentarios, onEnviarComentario }) {
  const [nuevoComentario, setNuevoComentario] = useState("");

  const enviarComentario = () => {
    onEnviarComentario(anuncioID, nuevoComentario);
    setNuevoComentario("");
  };

  return (
    <View style={styles.comentariosContainer}>
      <View style={styles.nuevoComentario}>
        <TextInput
          style={styles.comentarioInput}
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChangeText={setNuevoComentario}
        />
        <TouchableOpacity
          style={styles.enviarComentarioButton}
          onPress={enviarComentario}
          disabled={!nuevoComentario.trim()}
        >
          <Text style={styles.enviarComentarioButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      
      {comentarios.map(comentario => (
        <View key={comentario.ID} style={styles.comentarioItem}>
          <View style={styles.comentarioHeader}>
            <Image
              source={{
                uri: `http://localhost:3000/imagenes/${comentario.RutaFoto || 'usuario.png'}`
              }}
              style={styles.comentarioUsuarioImagen}
            />
            <Text style={styles.comentarioUsuarioNombre}>{comentario.Nombre_Usuario}</Text>
            <Text style={styles.comentarioFecha}>
              {new Date(comentario.Fecha).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.comentarioTexto}>{comentario.Descripcion}</Text>
        </View>
      ))}
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
  errorContainer: {
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
  bannerAula: {
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  aulaNombre: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.azulPrimario,
    marginBottom: 8,
  },
  profesorNombre: {
    fontSize: 16,
    color: colors.grisOscuro,
  },
  novedadesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  novedadesTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.azulPrimario,
  },
  crearAnuncioButton: {
    backgroundColor: colors.azulPrimario,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  crearAnuncioButtonText: {
    color: colors.blanco2,
    fontWeight: "bold",
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
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: colors.azulPrimario,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grisMedio,
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    backgroundColor: colors.blanco2,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
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
  submitButton: {
    backgroundColor: colors.azulPrimario,
  },
  modalButtonText: {
    color: colors.blanco2,
    fontWeight: "bold",
  },
  sinAnuncios: {
    padding: 20,
    backgroundColor: colors.grisClaro,
    borderRadius: 8,
    alignItems: "center",
  },
  anuncioContainer: {
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
  anuncioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  anuncioUsuario: {
    flexDirection: "row",
    alignItems: "center",
  },
  usuarioImagen: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  usuarioNombre: {
    fontWeight: "bold",
    color: colors.azul,
  },
  anuncioFecha: {
    color: colors.grisOscuro,
    fontSize: 12,
  },
  anuncioTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 8,
  },
  anuncioDescripcion: {
    color: colors.grisOscuro,
    marginBottom: 12,
    lineHeight: 20,
  },
  archivoLink: {
    color: colors.azulPrimario,
    textDecorationLine: "underline",
    marginBottom: 8,
  },
  anuncioAcciones: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    marginBottom: 16,
  },
  accionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: colors.azulSecundario,
    marginLeft: 8,
  },
  eliminarButton: {
    backgroundColor: "#dc3545",
  },
  accionButtonText: {
    color: colors.blanco2,
    fontSize: 12,
    fontWeight: "bold",
  },
  editarAnuncioForm: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.grisClaro,
    borderRadius: 5,
  },
  editarAnuncioButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  comentariosContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grisMedio,
    paddingTop: 16,
  },
  nuevoComentario: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  comentarioInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.grisMedio,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: colors.blanco2,
  },
  enviarComentarioButton: {
    backgroundColor: colors.azulPrimario,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  enviarComentarioButtonText: {
    color: colors.blanco2,
    fontWeight: "bold",
  },
  comentarioItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: colors.grisClaro,
    borderRadius: 8,
  },
  comentarioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  comentarioUsuarioImagen: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  comentarioUsuarioNombre: {
    fontWeight: "bold",
    color: colors.azul,
    marginRight: 8,
  },
  comentarioFecha: {
    color: colors.grisOscuro,
    fontSize: 12,
  },
  comentarioTexto: {
    color: colors.grisOscuro,
    lineHeight: 18,
  },
});
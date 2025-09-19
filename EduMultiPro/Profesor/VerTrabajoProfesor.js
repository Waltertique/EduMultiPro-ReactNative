import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";
import colors from "../colors";

export default function VerTrabajoProfesor() {
  const navigation = useNavigation();
  const route = useRoute();
  const { trabajoId, aulaId } = route.params;

  const [trabajo, setTrabajo] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener trabajo y archivos
        const resTrabajo = await fetch(`http://localhost:3000/api/edumultipro/Trabajo/${trabajoId}`);
        const dataTrabajo = await resTrabajo.json();
        setTrabajo(dataTrabajo.trabajo);
        setArchivos(dataTrabajo.archivos || []);

        // Obtener comentarios
        await obtenerComentarios();
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar trabajo:", error);
        Alert.alert("Error", "No se pudo cargar el trabajo");
        setLoading(false);
      }
    };

    obtenerDatos();
  }, [trabajoId]);

  const obtenerComentarios = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/edumultipro/Comentarios/Trabajo/${trabajoId}`);
      const data = await res.json();
      setComentarios(data);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  const handleComentarioSubmit = async () => {
    if (!nuevoComentario.trim()) return;

    try {
      const usuarioString = await AsyncStorage.getItem("usuario");
      const usuarioLogueado = usuarioString ? JSON.parse(usuarioString) : null;
      const usuarioId = usuarioLogueado?.id;
      
      if (!usuarioId) {
        Alert.alert("Error", "Usuario no identificado");
        return;
      }

      const fecha = new Date().toISOString().split("T")[0];

      const res = await fetch("http://localhost:3000/api/edumultipro/Comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          descripcion: nuevoComentario,
          trabajo_id: trabajoId,
          usuario_id: usuarioId,
          fecha
        })
      });

      if (res.ok) {
        const data = await res.json();
        Alert.alert("Éxito", data.mensaje);
        setNuevoComentario("");
        obtenerComentarios(); // recargar comentarios
      } else {
        Alert.alert("Error", "Error al comentar");
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      Alert.alert("Error", "Error al conectar con el servidor");
    }
  };

  const eliminarComentario = async (comentarioId) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de eliminar este comentario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`http://localhost:3000/api/edumultipro/Comentarios/${comentarioId}`, {
                method: "DELETE"
              });

              if (res.ok) {
                const data = await res.json();
                Alert.alert("Éxito", data.mensaje);
                obtenerComentarios(); // recarga
              } else {
                Alert.alert("Error", "Error al eliminar comentario");
              }
            } catch (error) {
              console.error("Error al eliminar comentario:", error);
              Alert.alert("Error", "Error al conectar con el servidor");
            }
          }
        }
      ]
    );
  };

  const navegarATrabajos = () => {
    navigation.navigate("TrabajoProfesor", { id: aulaId });
  };

  const navegarAVerEntregados = () => {
    navigation.navigate("VerTrabajoProfesorEntregado", { 
      trabajoId, 
      aulaId 
    });
  };

  const abrirArchivo = (rutaArchivo) => {
    Linking.openURL(`http://localhost:3000/${rutaArchivo}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando trabajo...</Text>
      </View>
    );
  }

  if (!trabajo) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se pudo cargar el trabajo</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableProfesor />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contenido}>
          {/* Botones superiores */}
          <View style={styles.botonesSuperiores}>
            <View style={styles.botonesGrupo}>
              <TouchableOpacity style={styles.botonSecundario}>
                <Text style={styles.botonSecundarioTexto}>Instrucciones</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.botonSecundario}
                onPress={navegarAVerEntregados}
              >
                <Text style={styles.botonSecundarioTexto}>Ver Subidos</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.botonCerrar}
              onPress={navegarATrabajos}
            >
              <Icon name="times" size={20} color={colors.blanco2} />
            </TouchableOpacity>
          </View>

          {/* Información del trabajo */}
          <View style={styles.tituloContainer}>
            <View style={styles.tituloInfo}>
              <Image
                source={require("../assets/f9.png")}
                style={styles.trabajoImagen}
              />
              <Text style={styles.titulo}>{trabajo.Titulo_Trabajo}</Text>
            </View>
            
            <View style={styles.fechaContainer}>
              <Text style={styles.fechaLabel}>Fecha de entrega</Text>
              <Text style={styles.fecha}>
                {new Date(trabajo.Fecha_Trabajo).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Descripción y archivos */}
          <View style={styles.descripcionContainer}>
            <Text style={styles.subtitulo}>Descripción:</Text>
            <Text style={styles.descripcion}>{trabajo.Descripcion_Trabajo}</Text>
            
            {archivos.length > 0 && (
              <View style={styles.archivosContainer}>
                <Text style={styles.archivosTitulo}>Archivos adjuntos:</Text>
                {archivos.map((archivo) => (
                  <TouchableOpacity
                    key={archivo.ID}
                    style={styles.archivoLink}
                    onPress={() => abrirArchivo(archivo.ruta_archivo)}
                  >
                    <Icon name="paperclip" size={16} color={colors.azulPrimario} />
                    <Text style={styles.archivoTexto}>{archivo.nombre_original}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Comentarios */}
          <View style={styles.comentariosContainer}>
            <Text style={styles.subtitulo}>Agregar comentarios</Text>
            
            <View style={styles.nuevoComentarioForm}>
              <TextInput
                style={styles.comentarioInput}
                placeholder="Escribe tu comentario"
                value={nuevoComentario}
                onChangeText={setNuevoComentario}
                multiline={true}
                numberOfLines={3}
              />
              <TouchableOpacity
                style={styles.comentarButton}
                onPress={handleComentarioSubmit}
                disabled={!nuevoComentario.trim()}
              >
                <Text style={styles.comentarButtonTexto}>Comentar</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de comentarios */}
            {comentarios.map((comentario) => (
              <View key={comentario.ID} style={styles.comentarioItem}>
                <View style={styles.comentarioHeader}>
                  <View style={styles.comentarioUsuario}>
                    <Image
                      source={{
                        uri: `http://localhost:3000/imagenes/${comentario.RutaFoto || 'usuario.png'}`
                      }}
                      style={styles.usuarioImagen}
                    />
                    <Text style={styles.usuarioNombre}>{comentario.Nombre_Usuario}</Text>
                  </View>
                  <Text style={styles.comentarioFecha}>
                    {new Date(comentario.Fecha).toLocaleDateString()}
                  </Text>
                </View>
                
                <Text style={styles.comentarioTexto}>{comentario.Descripcion}</Text>
                
                <TouchableOpacity
                  style={styles.eliminarComentarioButton}
                  onPress={() => eliminarComentario(comentario.ID)}
                >
                  <Text style={styles.eliminarComentarioTexto}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.fondo,
  },
  contenido: {
    padding: 16,
  },
  botonesSuperiores: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  botonesGrupo: {
    flexDirection: "row",
  },
  botonSecundario: {
    backgroundColor: colors.azulSecundario,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  botonSecundarioTexto: {
    color: colors.blanco2,
    fontWeight: "bold",
  },
  botonCerrar: {
    backgroundColor: colors.grisOscuro,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tituloContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tituloInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  trabajoImagen: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.azulPrimario,
    flex: 1,
  },
  fechaContainer: {
    alignItems: "flex-end",
  },
  fechaLabel: {
    fontSize: 14,
    color: colors.grisOscuro,
    marginBottom: 4,
  },
  fecha: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.azul,
  },
  descripcionContainer: {
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.azulPrimario,
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 16,
    color: colors.grisOscuro,
    lineHeight: 22,
    marginBottom: 16,
  },
  archivosContainer: {
    marginTop: 16,
  },
  archivosTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 8,
  },
  archivoLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.grisClaro,
    borderRadius: 5,
    marginBottom: 8,
  },
  archivoTexto: {
    marginLeft: 8,
    color: colors.azulPrimario,
    textDecorationLine: "underline",
  },
  comentariosContainer: {
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nuevoComentarioForm: {
    marginBottom: 20,
  },
  comentarioInput: {
    borderWidth: 1,
    borderColor: colors.grisMedio,
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: colors.blanco2,
  },
  comentarButton: {
    backgroundColor: colors.azulPrimario,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  comentarButtonTexto: {
    color: colors.blanco2,
    fontWeight: "bold",
  },
  comentarioItem: {
    borderTopWidth: 1,
    borderTopColor: colors.grisMedio,
    paddingTop: 16,
    marginTop: 16,
  },
  comentarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  comentarioUsuario: {
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
  comentarioFecha: {
    color: colors.grisOscuro,
    fontSize: 12,
  },
  comentarioTexto: {
    color: colors.grisOscuro,
    lineHeight: 20,
    marginBottom: 12,
  },
  eliminarComentarioButton: {
    alignSelf: "flex-end",
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  eliminarComentarioTexto: {
    color: colors.blanco2,
    fontSize: 12,
    fontWeight: "bold",
  },
});
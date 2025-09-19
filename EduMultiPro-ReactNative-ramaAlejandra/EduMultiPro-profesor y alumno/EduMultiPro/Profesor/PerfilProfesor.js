import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";
import colors from "../colors";

import { apiFetch } from "../api";
import { STATIC_URL } from "../api"; // 👈 importa aquí


export default function PerfilProfesor() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const usuarioString = await AsyncStorage.getItem('usuario');
        if (!usuarioString) {
          setLoading(false);
          return;
        }

        const usuarioLocal = JSON.parse(usuarioString);
        if (!usuarioLocal?.id) {
          setLoading(false);
          return;
        }

        const res = await apiFetch(`verUsuario/${usuarioLocal.id}`);
        const data = await res.json();
        
        if (res.ok) {
          setUsuario(data.usuario);
        }
      } catch (err) {
        console.error('❌ Error al cargar el perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.azulPrimario} />
        <Text style={styles.loadingText}>Cargando datos del perfil...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudieron cargar los datos del perfil</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableProfesor />

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Mi Información</Text>
        </View>

        <View style={styles.contenidoTabla}>
          {/* Fila 1: Foto e Identificación */}
          <View style={styles.fila}>
            <View style={[styles.celda, styles.celdaFoto]}>
              <Text style={styles.encabezado}>Foto</Text>
              {usuario.RutaFoto ? (
                <Image
                  style={styles.fotoPerfil}
                  source={{ uri: `${STATIC_URL}/imagenes/${usuario.RutaFoto}` }}
                />
              ) : (
                <View style={styles.sinFoto}>
                  <Text style={styles.sinFotoTexto}>Sin Foto</Text>
                </View>
              )}
            </View>
            
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Identificación</Text>
              <Text style={styles.dato}>{usuario.ID}</Text>
            </View>
            
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Documento</Text>
              <Text style={styles.dato}>{usuario.Documento}</Text>
            </View>
          </View>

          {/* Fila 2: Nombres */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Primer Nombre</Text>
              <Text style={styles.dato}>{usuario.Primer_Nombre}</Text>
            </View>
            
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Segundo Nombre</Text>
              <Text style={styles.dato}>{usuario.Segundo_Nombre || "N/A"}</Text>
            </View>
          </View>

          {/* Fila 3: Apellidos */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Primer Apellido</Text>
              <Text style={styles.dato}>{usuario.Primer_Apellido}</Text>
            </View>
            
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Segundo Apellido</Text>
              <Text style={styles.dato}>{usuario.Segundo_Apellido || "N/A"}</Text>
            </View>
          </View>

          {/* Fila 4: Correos */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Correo 1</Text>
              <Text style={styles.dato}>{usuario.Correo1}</Text>
            </View>
            
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Correo 2</Text>
              <Text style={styles.dato}>{usuario.Correo2 || "N/A"}</Text>
            </View>
          </View>

          {/* Fila 5: Contactos */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Contacto 1</Text>
              <Text style={styles.dato}>{usuario.Contacto1}</Text>
            </View>
            
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Contacto 2</Text>
              <Text style={styles.dato}>{usuario.Contacto2 || "N/A"}</Text>
            </View>
          </View>

          {/* Fila 6: Fecha Nacimiento y Rol */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Fecha de Nacimiento</Text>
              <Text style={styles.dato}>{usuario.Fecha_Nacimiento}</Text>
            </View>
            
            <View style={styles.celda}>
              <Text style={styles.encabezado}>Rol</Text>
              <Text style={styles.dato}>{usuario.Rol}</Text>
            </View>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.grisOscuro,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.fondo,
  },
  errorText: {
    fontSize: 16,
    color: colors.grisOscuro,
  },
  tituloContainer: {
    padding: 16,
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.azulPrimario,
  },
  contenidoTabla: {
    padding: 16,
  },
  fila: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  celda: {
    flex: 1,
    padding: 8,
  },
  celdaFoto: {
    alignItems: "center",
  },
  encabezado: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 4,
  },
  dato: {
    fontSize: 16,
    color: colors.grisOscuro,
  },
  fotoPerfil: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 8,
  },
  sinFoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.grisMedio,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  sinFotoTexto: {
    color: colors.grisOscuro,
    fontSize: 12,
  },
});
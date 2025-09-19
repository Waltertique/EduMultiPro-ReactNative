// Alumno/PerfilAlumno.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableAlumno from "./DesplegableAlumno";
import colors from "../colors";

export default function PerfilAlumno({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuarioLocal = await AsyncStorage.getItem("usuario");
        if (!usuarioLocal) return;

        const { id } = JSON.parse(usuarioLocal);

        const res = await fetch(`http://192.168.1.53:3000/api/edumultipro/verUsuario/${id}`);
        const data = await res.json();

        setUsuario(data.usuario);
      } catch (err) {
        console.error("❌ Error al cargar el perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  if (loading) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color={colors.azulPrimario} />
        <Text style={{ marginTop: 10 }}>Cargando datos del perfil...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.cargando}>
        <Text>No se pudo cargar el perfil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableAlumno navigation={navigation} />

      <ScrollView contentContainerStyle={styles.centroAlumno}>
        <Text style={styles.titulo}>Mi Información</Text>

        <View style={styles.perfilContainer}>
          <View style={styles.fotoContainer}>
            {usuario.RutaFoto ? (
              <Image
                source={{
                  uri: `http://192.168.1.53:3000/imagenes/${usuario.RutaFoto}`,
                }}
                style={styles.foto}
              />
            ) : (
              <Text>📷 Sin Foto</Text>
            )}
          </View>

          <View style={styles.datosContainer}>
            <Text style={styles.item}>
              <Text style={styles.label}>Identificación: </Text>
              {usuario.ID}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Documento: </Text>
              {usuario.Documento}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Primer Nombre: </Text>
              {usuario.Primer_Nombre}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Segundo Nombre: </Text>
              {usuario.Segundo_Nombre}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Primer Apellido: </Text>
              {usuario.Primer_Apellido}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Segundo Apellido: </Text>
              {usuario.Segundo_Apellido}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Correo 1: </Text>
              {usuario.Correo1}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Correo 2: </Text>
              {usuario.Correo2}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Contacto 1: </Text>
              {usuario.Contacto1}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Contacto 2: </Text>
              {usuario.Contacto2}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Fecha de Nacimiento: </Text>
              {usuario.Fecha_Nacimiento}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Rol: </Text>
              {usuario.Rol}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  cargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centroAlumno: {
    flexGrow: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.azulPrimario,
    textAlign: "center",
    marginBottom: 20,
  },
  perfilContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  fotoContainer: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  datosContainer: {
    width: "60%",
    justifyContent: "center",
  },
  item: {
    fontSize: 14,
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: colors.azulPrimario,
  },
});

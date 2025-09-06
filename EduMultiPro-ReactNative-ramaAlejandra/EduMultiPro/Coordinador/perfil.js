import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import * as React from 'react';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableCoor from './DesplegableCoor';
import colors from '../colors';

export default function Perfil() {
  // Datos estáticos de ejemplo
  const data = {
    identificacion: "1",
    documento: "Cedula",
    primerNombre: "Juan",
    segundoNombre: "Alberto",
    primerApellido: "Pérez",
    segundoApellido: "Gómez",
    correo1: "juan01@gmail.com",
    correo2: "juan.alt01@gmail.com",
    contacto1: "3111111111",
    contacto2: "3234567327",
    fechaNacimiento: "1990-01-15",
    rol: "Coordinador",
    foto: require('../assets/foto.jpg')
  };

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableCoor />

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
        <Text style={styles.titulo}>Mi Información</Text>

        <View style={styles.tabla}>
          {/* Fila de foto + identificación */}
          <View style={styles.fila}>
            <View style={styles.celdaFoto}>
              <Image source={data.foto} style={styles.foto} />
              <Text style={styles.textoCelda}>Foto</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Identificación</Text>
              <Text>{data.identificacion}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Documento</Text>
              <Text>{data.documento}</Text>
            </View>
          </View>

          {/* Fila nombres */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Primer Nombre</Text>
              <Text>{data.primerNombre}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Segundo Nombre</Text>
              <Text>{data.segundoNombre}</Text>
            </View>
          </View>

          {/* Fila apellidos */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Primer Apellido</Text>
              <Text>{data.primerApellido}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Segundo Apellido</Text>
              <Text>{data.segundoApellido}</Text>
            </View>
          </View>

          {/* Correos */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Correo 1</Text>
              <Text>{data.correo1}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Correo 2</Text>
              <Text>{data.correo2}</Text>
            </View>
          </View>

          {/* Contactos */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Contacto 1</Text>
              <Text>{data.contacto1}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Contacto 2</Text>
              <Text>{data.contacto2}</Text>
            </View>
          </View>

          {/* Fecha y rol */}
          <View style={styles.fila}>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Fecha de Nacimiento</Text>
              <Text>{data.fechaNacimiento}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.textoCelda}>Rol</Text>
              <Text>{data.rol}</Text>
            </View>
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
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    color: colors.azulPrimario,
  },
  tabla: {
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    padding: 10,
    width: "90%",
    marginBottom: 20,
    elevation: 3,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  celda: {
    flex: 1,
    paddingHorizontal: 10,
  },
  celdaFoto: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  textoCelda: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
});

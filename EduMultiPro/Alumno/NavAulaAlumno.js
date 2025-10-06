import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../colors";

export default function NavAulaAlumno({ navigation, id }) {
  return (
    <View style={styles.navAulaAlumno}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("VerAulaAlumno", { id })}
      >
        <Text style={styles.buttonText}>Principal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TrabajoAlumno", { id })}
      >
        <Text style={styles.buttonText}>Trabajos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PersonaAlumno", { id })}
      >
        <Text style={styles.buttonText}>Personas</Text>
      </TouchableOpacity>

      {/* Botón Salir */}
      <TouchableOpacity
        style={[styles.button, styles.salirButton]}
        onPress={() => navigation.navigate("ClaseAlumno")}
      >
        <Text style={styles.buttonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navAulaAlumno: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    width: "90%",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 3,
  },
  salirButton: {
    backgroundColor: "#dc3545", // rojo para salir
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

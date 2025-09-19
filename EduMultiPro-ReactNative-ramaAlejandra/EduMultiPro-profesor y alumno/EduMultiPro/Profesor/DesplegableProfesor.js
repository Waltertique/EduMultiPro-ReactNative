import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import colors from "../colors";



// 👉 Opciones del menú para PROFESOR (solo cambian las rutas)
const opciones = [
  { name: "Inicio", icon: "home", route: "PrincipalProfesor" },
  { name: "Noticias", icon: "newspaper", route: "NoticiaProfesor" },
  { name: "Horarios", icon: "calendar-alt", route: "HorarioProfesor" },
  { name: "Clases", icon: "chalkboard-teacher", route: "ClaseProfesor" },
  { name: "Perfil", icon: "user", route: "PerfilProfesor" },
  { name: "Salir", icon: "sign-out-alt", route: "Login" },
];

export default function DesplegableProfesor() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Botón principal */}
      <TouchableOpacity
        style={styles.botonPrincipal}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.textoBoton}>Opciones</Text>
      </TouchableOpacity>

      {/* Modal desplegable */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContenido}>
            <FlatList
              data={opciones}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.opcion}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate(item.route);
                  }}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    color={colors.azul}
                    style={styles.icono}
                  />
                  <Text style={styles.textoOpcion}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.fondo,
  },
  botonPrincipal: {
    backgroundColor: colors.azulPrimario,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: colors.blanco2,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContenido: {
    backgroundColor: colors.blanco2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icono: {
    marginRight: 12,
  },
  textoOpcion: {
    fontSize: 16,
    color: colors.grisOscuro,
  },
});
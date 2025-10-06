import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import * as React from 'react';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';

import { apiFetch } from "../api"; // 👈 importa tu helper

export default function CrearCurso({ navigation }) {

    const [cursoNombre, setCursoNombre] = React.useState("");
    const [grados, setGrados] = React.useState([]);
    const [jornadas, setJornadas] = React.useState([]);
    const [gradoId, setGradoId] = React.useState(null);
    const [jornadaId, setJornadaId] = React.useState(null);

    // Cargar grados y jornadas
    React.useEffect(() => {
        const fetchData = async () => {
        try {
            const resGrados = await apiFetch("/Grados");
            const dataGrados = await resGrados.json();
            setGrados(dataGrados);

            const resJornadas = await apiFetch("/Jornadas");
            const dataJornadas = await resJornadas.json();
            setJornadas(dataJornadas);
        } catch (error) {
            console.error("Error al obtener datos:", error);
            Alert.alert("Error", "No se pudieron cargar grados o jornadas");
        }
        };

        fetchData();
    }, []);

    // Guardar curso
    const guardarCurso = async () => {
        if (!cursoNombre || !gradoId || !jornadaId) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
        }

        try {
        const res = await apiFetch("/Cursos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            Curso_Nombre: cursoNombre,
            grado_id: Number(gradoId),
            jornada_id: Number(jornadaId),
            }),
        });

        const data = await res.json();
        Alert.alert("Éxito", data.mensaje);
        navigation.navigate("Curso"); // volver al listado
        } catch (error) {
        console.error("Error al guardar curso:", error);
        Alert.alert("Error", "No se pudo guardar el curso");
        }
    };

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Crear Curso</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('Curso')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>

                <View style={styles.formularioModificar}>
                    <Text style={styles.titleUsuario}>Datos del Curso</Text>
                    
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Nombre del curso"
                        value={cursoNombre}
                        onChangeText={setCursoNombre}
                    />

                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                        <Picker
                            selectedValue={gradoId}
                            onValueChange={(value) => setGradoId(value)}
                        >
                            <Picker.Item label="Seleccione un grado" value={null} />
                            {grados.map((g) => (
                            <Picker.Item key={g.ID} label={g.Grado_Nombre} value={g.ID} />
                            ))}
                        </Picker>
                    </View>

                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                        <Picker
                            selectedValue={jornadaId}
                            onValueChange={(value) => setJornadaId(value)}
                        >
                            <Picker.Item label="Seleccione una jornada" value={null} />
                            {jornadas.map((j) => (
                            <Picker.Item key={j.ID} label={j.Jornada_Nombre} value={j.ID} />
                            ))}
                        </Picker>
                    </View>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={guardarCurso}>
                        <Text style={styles.textoCrearUsuario}> Guardar Curso</Text>
                    </TouchableOpacity>
                    
                </View>
            
            </View>

        <Footer />

        </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1, // ocupa toda la pantalla
        flexDirection: 'column',
        backgroundColor: colors.fondo, // usamos variable
        margin: 0,
        padding: 0,
        width: '100%',
    },
    
    centroUsuario: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },

    tituloUsuario: {
        width: '90%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario,
        paddingBottom: 10,
    },
    botonCrearUsuario: {
        flexDirection: 'row',
        backgroundColor: '#007bbd',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    textoCrearUsuario: {
        color: 'white',
    },
    titleUsuario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
    },
    formularioModificar:{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        minWidth: '90%',
        marginTop: 20,
        alignItems: 'center',
    },
    datosFormulario:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        minWidth: '80%',
        marginTop: 10,
    },

});
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import * as React from 'react';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableProfesor from './DesplegableProfesor.js';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

import { apiFetch } from "../api"; // 👈 importa tu helper

export default function CrearAulaProfesor({ navigation }) {

    const [aulaNombre, setAulaNombre] = React.useState("");
    const [materiaId, setMateriaId] = React.useState("");
    const [cursoId, setCursoId] = React.useState("");
    const [usuarioId, setUsuarioId] = React.useState("");

    const [materias, setMaterias] = React.useState([]);
    const [cursos, setCursos] = React.useState([]);
    const [profesores, setProfesores] = React.useState([]);

    // Cargar datos al inicio
    React.useEffect(() => {
        const fetchData = async () => {
        try {
            const resMaterias = await apiFetch("/Materias");
            setMaterias(await resMaterias.json());

            const resCursos = await apiFetch("/Cursos-jornada");
            setCursos(await resCursos.json());

            const resProfes = await apiFetch("/Profesores");
            setProfesores(await resProfes.json());
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
        };
        fetchData();
    }, []);

    // Guardar Aula
    const guardarAula = async () => {
        if (!aulaNombre || !materiaId || !cursoId || !usuarioId) {
        Alert.alert("Error", "Por favor complete todos los campos");
        return;
        }

        const nuevaAula = {
        aula_nombre: aulaNombre,
        materia_id: materiaId,
        curso_id: cursoId,
        usuario_id: usuarioId,
        };

        try {
        const res = await apiFetch("/Aulas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaAula),
        });
        const data = await res.json();
        Alert.alert("Aviso", data.mensaje || "Aula creada correctamente");
        navigation.navigate("ClaseProfesor");
        } catch (error) {
        console.error("Error al crear el aula:", error);
        Alert.alert("Error", "Ocurrió un error al crear el aula");
        }
    };

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableProfesor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroProfeso}>

                    <View style={styles.tituloUsuario}>
                        <Text style={styles.titleUsuario}>Crear Aula</Text>
                        
                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('ClaseProfesor')}>
                            <FontAwesome name="user" size={16} color="#fff" />
                            <Text style={styles.textoCrearUsuario}> Salir</Text>
                        </TouchableOpacity>
        
                    </View>
                    
                    <View style={styles.formularioModificar}>
                        <TextInput
                            style={styles.datosFormulario}
                            placeholder='Nombre del Aula'
                            value={aulaNombre}
                            onChangeText={setAulaNombre}
                        />
    
                        <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                            <Picker
                                selectedValue={materiaId}
                                onValueChange={(value) => setMateriaId(value)}
                                >
                                <Picker.Item label="Seleccione una Materia" value="" />
                                {materias.map((m) => (
                                    <Picker.Item key={m.ID} label={m.Materia_Nombre} value={m.ID} />
                                ))}
                            </Picker>
                        </View>
    
                        <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                            <Picker
                                selectedValue={cursoId}
                                onValueChange={(value) => setCursoId(value)}
                                >
                                <Picker.Item label="Seleccione un Curso" value="" />
                                {cursos.map((c) => (
                                    <Picker.Item key={c.ID} label={c.Curso_Con_Jornada} value={c.ID} />
                                ))}
                            </Picker>
                        </View>
    
                        <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                            <Picker
                                selectedValue={usuarioId}
                                onValueChange={(value) => setUsuarioId(value)}
                                >
                                <Picker.Item label="Seleccione un Profesor" value="" />
                                {profesores.map((p) => (
                                    <Picker.Item key={p.ID} label={p.Nombre_Completo} value={p.ID} />
                                ))}
                            </Picker>
                        </View>
                        
                            <TouchableOpacity style={styles.botonCrearUsuario} onPress={guardarAula}>
                                <Text style={styles.textoCrearUsuario}> Guardar Aula</Text>
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
    
    centroProfeso: {
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
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario,
        marginBottom: 15
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
        alignItems: 'center',
        marginBottom: 20,
    },
    datosFormulario:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        minWidth: '80%',
        marginTop: 10,
    }
})
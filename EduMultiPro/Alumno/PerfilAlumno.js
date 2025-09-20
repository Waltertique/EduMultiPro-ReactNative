import { 
  View, Text, Image, TouchableOpacity, 
  StyleSheet, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableAlumno from './DesplegableAlumno';
import { apiFetch, STATIC_URL } from "../api";
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function PrincipalAlumno() {

    const [usuario, setUsuario] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const cargarPerfil = async () => {
        try {
            const usuarioLocal = JSON.parse(await AsyncStorage.getItem("usuario"));
            if (!usuarioLocal?.id) {
            Alert.alert("Error", "No hay sesión activa");
            return;
            }

            // 🔹 Llamar al backend con el ID del usuario logueado
            const res = await apiFetch(`/verUsuario/${usuarioLocal.id}`);
            const data = await res.json();

            if (res.ok) {
            setUsuario(data.usuario);
            } else {
            Alert.alert("Error", data.mensaje || "No se pudo cargar el perfil");
            }
        } catch (error) {
            console.error("❌ Error al cargar perfil:", error);
            Alert.alert("Error", "No se pudo cargar el perfil");
        } finally {
            setLoading(false);
        }
        };

        cargarPerfil();
    }, []);

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text>Cargando perfil...</Text>
        </View>
        );
    }

    if (!usuario) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>No se encontró información del usuario</Text>
        </View>
        );
    }

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableAlumno />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroAlumno}>
                    
                    <View style={styles.tituloUsuario}>
                        <Text style={styles.titleUsuario}>Informacion del Usuario</Text>
                    </View>

                    <View style={styles.contenedorInfo}>
                    
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> N.O Indentificacion:</Text>
                            <Text style={styles.textoInfo}>{usuario.ID}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Documento:</Text>
                            <Text style={styles.textoInfo}>{usuario.Documento}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Primer Nombre:</Text>
                            <Text style={styles.textoInfo}>{usuario.Primer_Nombre}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Segundo Nombre:</Text>
                            <Text style={styles.textoInfo}>{usuario.Segundo_Nombre}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Primer Apellido:</Text>
                            <Text style={styles.textoInfo}>{usuario.Primer_Apellido}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Segundo Apellido:</Text>
                            <Text style={styles.textoInfo}>{usuario.Segundo_Apellido}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Correo1:</Text>
                            <Text style={styles.textoInfo}>{usuario.Correo1}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Correo2:</Text>
                            <Text style={styles.textoInfo}>{usuario.Correo2}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Contacto1:</Text>
                            <Text style={styles.textoInfo}>{usuario.Contacto1}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Contacto2:</Text>
                            <Text style={styles.textoInfo}>{usuario.Contacto2}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Fecha de Nacimiento:</Text>
                            <Text style={styles.textoInfo}>{usuario.Fecha_Nacimiento}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}> Rol:</Text>
                            <Text style={styles.textoInfo}>{usuario.Rol}</Text>
                        </View>
                        <View style={styles.contenedorInfo2}>
                            <Text style={styles.textoInfoTitle}>Foto:</Text>
                            {usuario.RutaFoto ? (
                                <Image
                                source={{ uri: `${STATIC_URL}/imagenes/${usuario.RutaFoto}` }}
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                                resizeMode="contain"
                                />
                            ) : (
                                <FontAwesome name="user-circle" size={80} color="gray" />
                            )}
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
        flex: 1, // ocupa toda la pantalla
        flexDirection: 'column',
        backgroundColor: colors.fondo, // usamos variable
        margin: 0,
        padding: 0,
        width: '100%',
    },
    
    centroAlumno: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    tituloUsuario: {
        minWidth: '90%',
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario,
        paddingBottom: 10,
    },
    titleUsuario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
    },
    contenedorInfo: {
        minWidth: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        marginVertical: 20,
    },
    contenedorInfo2: {
        minWidth: '90%',
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingVertical: 5,
    },
    textoInfoTitle:{
        fontWeight: 'bold',
        marginRight: 10,
    },
})
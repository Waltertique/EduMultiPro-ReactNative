import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 👉 Importamos las pantallas del alumno
import PrincipalAlumno from "./PrincipalAlumno";
import NoticiaAlumno from "./NoticiaAlumno";
import VerNoticiaAlumno from "./VerNoticiaAlumno";
import HorarioAlumno from "./HorarioAlumno";
import ClaseAlumno from "./ClaseAlumno";
import PerfilAlumno from "./PerfilAlumno";
import VerAulaAlumno from "./VerAulaAlumno";
import TrabajoAlumno from "./TrabajoAlumno";
import VerTrabajoAlumno from "./VerTrabajoAlumno";
import PersonaAlumno from "./PersonaAlumno";

const Stack = createNativeStackNavigator();

export default function RutasAlumno() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PrincipalAlumno" component={PrincipalAlumno} />

      {/* Noticias */}
      <Stack.Screen name="NoticiaAlumno" component={NoticiaAlumno} />
      <Stack.Screen name="VerNoticiaAlumno" component={VerNoticiaAlumno} />

      {/* Horarios */}
      <Stack.Screen name="HorarioAlumno" component={HorarioAlumno} />

      {/* Clases */}
      <Stack.Screen name="ClaseAlumno" component={ClaseAlumno} />
      <Stack.Screen name="VerAulaAlumno" component={VerAulaAlumno} />

      {/* Trabajos */}
      <Stack.Screen name="TrabajoAlumno" component={TrabajoAlumno} />
      <Stack.Screen name="VerTrabajoAlumno" component={VerTrabajoAlumno} />

      {/* Compañeros */}
      <Stack.Screen name="PersonaAlumno" component={PersonaAlumno} />

      {/* Perfil */}
      <Stack.Screen name="PerfilAlumno" component={PerfilAlumno} />
    </Stack.Navigator>
  );
}

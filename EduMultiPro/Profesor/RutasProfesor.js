import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 👉 Importamos las pantallas del profesor
import PrincipalProfesor from "./PrincipalProfesor";
import NoticiaProfesor from "./NoticiaProfesor";
import VerNoticiaProfesor from "./VerNoticiaProfesor";
import HorarioProfesor from "./HorarioProfesor";
import ClaseProfesor from "./ClaseProfesor";
import PerfilProfesor from "./PerfilProfesor";
import VerAulaProfesor from "./VerAulaProfesor";
import TrabajoProfesor from "./TrabajoProfesor";
import VerTrabajoProfesor from "./VerTrabajoProfesor";
import PersonaProfesor from "./PersonaProfesor";

const Stack = createNativeStackNavigator();

export default function RutasProfesor() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PrincipalProfesor" component={PrincipalProfesor} />

      {/* Noticias */}
      <Stack.Screen name="NoticiaProfesor" component={NoticiaProfesor} />
      <Stack.Screen name="VerNoticiaProfesor" component={VerNoticiaProfesor} />

      {/* Horarios */}
      <Stack.Screen name="HorarioProfesor" component={HorarioProfesor} />

      {/* Clases */}
      <Stack.Screen name="ClaseProfesor" component={ClaseProfesor} />
      <Stack.Screen name="VerAulaProfesor" component={VerAulaProfesor} />

      {/* Trabajos */}
      <Stack.Screen name="TrabajoProfesor" component={TrabajoProfesor} />
      <Stack.Screen name="VerTrabajoProfesor" component={VerTrabajoProfesor} />

      {/* Compañeros */}
      <Stack.Screen name="PersonaProfesor" component={PersonaProfesor} />

      {/* Perfil */}
      <Stack.Screen name="PerfilProfesor" component={PerfilProfesor} />
    </Stack.Navigator>
  );
}
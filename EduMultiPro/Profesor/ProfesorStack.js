// Coordinador/ProfesorStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 👉 Importamos las pantallas del Coordinador
import PrincipalProfesor from './PrincipalProfesor';
import NoticiaProfesor from './NoticiaProfesor';
import HorarioProfesor from './HorarioProfesor';
import ClaseProfesor from './ClaseProfesor';
import PerfilProfesor from './PerfilProfesor';

import VerNoticiaProfesor from './VerNoticiaProfesor';
import CrearAulaProfesor from './CrearAulaProfesor';
import VerAulaProfesor from './VerAulaProfesor';
import TrabajoProfesor from './TrabajoProfesor';
import NotaProfesor from './NotaProfesor';
import PersonaProfesor from './PersonaProfesor';
import ActualizarTrabajoProfesor from './ActualizarTrabajoProfesor';
import CrearTrabajoProfesor from './CrearTrabajoProfesor';
import VerTrabajoProfesor from './VerTrabajoProfesor';
import VerTrabajoEntregadoPro from './VerTrabajoEntregadoPro';


// 👉 Importamos el menú desplegable
import DesplegableProfesor from './DesplegableProfesor';

const Stack = createNativeStackNavigator();

export default function ProfesorStack() {
  return (
    <Stack.Navigator>
      {/* Pantalla principal del Coordinador con el menú */}

        <Stack.Screen name="PrincipalProfesor" component={PrincipalProfesor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableProfesor />, 
            }} 
        />

        <Stack.Screen name="NoticiaProfesor" component={NoticiaProfesor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableProfesor />,
            }} 
        />

        <Stack.Screen name="HorarioProfesor" component={HorarioProfesor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableProfesor />,
            }} 
        />

        <Stack.Screen name="ClaseProfesor" component={ClaseProfesor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableProfesor />,
            }} 
        />

        <Stack.Screen name="PerfilProfesor" component={PerfilProfesor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableProfesor />,
            }} 
        />

        <Stack.Screen name="VerNoticiaProfesor" component={VerNoticiaProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="CrearAulaProfesor" component={CrearAulaProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="VerAulaProfesor" component={VerAulaProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="TrabajoProfesor" component={TrabajoProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="NotaProfesor" component={NotaProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="PersonaProfesor" component={PersonaProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="ActualizarTrabajoProfesor" component={ActualizarTrabajoProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="CrearTrabajoProfesor" component={CrearTrabajoProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="VerTrabajoProfesor" component={VerTrabajoProfesor} options={{ headerShown: false }} />
        <Stack.Screen name="VerTrabajoEntregadoPro" component={VerTrabajoEntregadoPro} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
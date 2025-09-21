// Coordinador/AlumnoStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 👉 Importamos las pantallas del Coordinador
import PrincipalAlumno from './PrincipalAlumno';
import NoticiaAlumno from './NoticiaAlumno';
import HorarioAlumno from './HorarioAlumno';
import ClaseAlumno from './ClaseAlumno';
import PerfilAlumno from './PerfilAlumno';

import VerNoticiaAlumno from './VerNoticiaAlumno';
import VerAulaAlumno from './VerAulaAlumno';
import TrabajoAlumno from './TrabajoAlumno';
import PersonaAlumno from './PersonaAlumno';
import VerTrabajoAlumno from './VerTrabajoAlumno';


// 👉 Importamos el menú desplegable
import DesplegableAlumno from './DesplegableAlumno';

const Stack = createNativeStackNavigator();

export default function AlumnoStack() {
  return (
    <Stack.Navigator>
      {/* Pantalla principal del Coordinador con el menú */}

        <Stack.Screen name="PrincipalAlumno" component={PrincipalAlumno} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableAlumno />, 
            }} 
        />

        <Stack.Screen name="NoticiaAlumno" component={NoticiaAlumno} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableAlumno />,
            }} 
        />

        <Stack.Screen name="HorarioAlumno" component={HorarioAlumno} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableAlumno />,
            }} 
        />

        <Stack.Screen name="ClaseAlumno" component={ClaseAlumno} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableAlumno />,
            }} 
        />

        <Stack.Screen name="PerfilAlumno" component={PerfilAlumno} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableAlumno />,
            }} 
        />

        <Stack.Screen name="VerNoticiaAlumno" component={VerNoticiaAlumno} options={{ headerShown: false }} />
        <Stack.Screen name="VerAulaAlumno" component={VerAulaAlumno} options={{ headerShown: false }} />
        <Stack.Screen name="TrabajoAlumno" component={TrabajoAlumno} options={{ headerShown: false }} />
        <Stack.Screen name="PersonaAlumno" component={PersonaAlumno} options={{ headerShown: false }} />
        <Stack.Screen name="VerTrabajoAlumno" component={VerTrabajoAlumno} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
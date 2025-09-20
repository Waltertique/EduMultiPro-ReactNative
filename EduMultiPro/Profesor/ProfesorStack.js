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

    </Stack.Navigator>
  );
}
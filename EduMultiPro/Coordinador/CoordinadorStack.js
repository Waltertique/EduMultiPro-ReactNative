// Coordinador/CoordinadorStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 👉 Importamos las pantallas del Coordinador
import PrincipalCoordinador from './PrincipalCoordinador';
import HorarioCoor from './HorarioCoor';
import NoticiaCoor from './NoticiaCoor';
import ReporteCoor from './ReporteCoor';
import PerfilCoor from './PerfilCoor';

import MateriaCoor from './MateriaCoor';
import GradoCoor from './GradoCoor';
import JornadaCoor from './JornadaCoor';
import CrearCursoCoor from './CrearCursoCoor';
import VerCursoCoor from './VerCursoCoor';
import ActualizarHorarioCoor from './ActualizarHorarioCoor';
import VerHorarioCoor from './VerHorarioCoor';
import CrearHorarioCoor from './CrearHorarioCoor';
import ActualizarNoticiaCoor from './ActualizarNoticiaCoor';
import VerNoticiaCoor from './VerNoticiaCoor';
import CrearNoticiaCoor from './CrearNoticiaCoor';
import ReporteClaseCoor from './ReporteClaseCoor';
import ReporteAgendaCoor from './ReporteAgendaCoor';


// 👉 Importamos el menú desplegable
import DesplegableCoor from './DesplegableCoor';

const Stack = createNativeStackNavigator();

export default function CoordinadorStack() {
  return (
    <Stack.Navigator>
      {/* Pantalla principal del Coordinador con el menú */}

        <Stack.Screen name="PrincipalCoordinador" component={PrincipalCoordinador} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableCoor />, 
            }} 
        />

        <Stack.Screen name="HorarioCoor" component={HorarioCoor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableCoor />,
            }} 
        />

        <Stack.Screen name="NoticiaCoor" component={NoticiaCoor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableCoor />,
            }} 
        />

        <Stack.Screen name="ReporteCoor" component={ReporteCoor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableCoor />,
            }} 
        />

        <Stack.Screen name="PerfilCoor" component={PerfilCoor} 
            options={{ 
            headerShown: false,
            headerTitle: () => <DesplegableCoor />,
            }} 
        />


      <Stack.Screen name="MateriaCoor" component={MateriaCoor} options={{ headerShown: false }} />
      <Stack.Screen name="GradoCoor" component={GradoCoor} options={{ headerShown: false }} />
      <Stack.Screen name="JornadaCoor" component={JornadaCoor} options={{ headerShown: false }} />
      <Stack.Screen name="CrearCursoCoor" component={CrearCursoCoor} options={{ headerShown: false }} />
      <Stack.Screen name="VerCursoCoor" component={VerCursoCoor} options={{ headerShown: false }} />
      <Stack.Screen name="ActualizarHorarioCoor" component={ActualizarHorarioCoor} options={{ headerShown: false }} />
      <Stack.Screen name="VerHorarioCoor" component={VerHorarioCoor} options={{ headerShown: false }} />
      <Stack.Screen name="CrearHorarioCoor" component={CrearHorarioCoor} options={{ headerShown: false }} />
      <Stack.Screen name="ActualizarNoticiaCoor" component={ActualizarNoticiaCoor} options={{ headerShown: false }} />
      <Stack.Screen name="VerNoticiaCoor" component={VerNoticiaCoor} options={{ headerShown: false }} />
      <Stack.Screen name="CrearNoticiaCoor" component={CrearNoticiaCoor} options={{ headerShown: false }} />
      <Stack.Screen name="ReporteClaseCoor" component={ReporteClaseCoor} options={{ headerShown: false }} />
      <Stack.Screen name="ReporteAgendaCoor" component={ReporteAgendaCoor} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
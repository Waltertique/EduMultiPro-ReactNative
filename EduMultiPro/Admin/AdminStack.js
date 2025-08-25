// Admin/AdminStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 👉 Importamos las pantallas del admin
import Usuario from './Usuario';
import Curso from './Curso';
import Horario from './Horario';
import Aula from './Aula';
import Noticia from './Noticia';
import Reporte from './Reporte';

import CrearUsuario from './CrearUsuario';
import VerUsuario from './VerUsuario';
import Materia from './Materia';
import Grado from './Grado';
import Jornada from './Jornada';
import CrearCurso from './CrearCurso';
import VerCurso from './VerCurso';
import CrearHorario from './CrearHorario';
import VerHorario from './VerHorario';
import ActualizarHorario from './ActualizarHorario';
import CrearAula from './CrearAula';
import VerAula from './VerAula';
import VerNoticia from './VerNoticia';
import CrearNoticia from './CrearNoticia';
import ActualizarNoticia from './ActualizarNoticia';

// 👉 Importamos el menú desplegable
import Desplegable from '../Desplegable';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      {/* Pantalla principal del admin con el menú */}

      <Stack.Screen name="Usuario" component={Usuario} 
        options={{ 
          headerShown: false,
          headerTitle: () => <Desplegable />, 
        }} 
      />

      <Stack.Screen name="Curso" component={Curso} 
        options={{ 
          headerShown: false,
          headerTitle: () => <Desplegable />,
        }} 
      />

      <Stack.Screen name="Horario" component={Horario} 
        options={{ 
          headerShown: false,
          headerTitle: () => <Desplegable />,
        }} 
      />

      <Stack.Screen name="Aula" component={Aula} 
        options={{ 
          headerShown: false,
          headerTitle: () => <Desplegable />,
        }} 
      />

      <Stack.Screen name="Noticia" component={Noticia} 
        options={{ 
          headerShown: false,
          headerTitle: () => <Desplegable />,
        }} 
      />

      <Stack.Screen name="Reporte" component={Reporte} 
        options={{ 
          headerShown: false,
          headerTitle: () => <Desplegable />,
        }} 
      />
      <Stack.Screen name="CrearUsuario" component={CrearUsuario} options={{ headerShown: false }} />
      <Stack.Screen name="VerUsuario" component={VerUsuario} options={{ headerShown: false }} />
      <Stack.Screen name="Materia" component={Materia} options={{ headerShown: false }} />
      <Stack.Screen name="Grado" component={Grado} options={{ headerShown: false }} />
      <Stack.Screen name="Jornada" component={Jornada} options={{ headerShown: false }} />
      <Stack.Screen name="CrearCurso" component={CrearCurso} options={{ headerShown: false }} />
      <Stack.Screen name="VerCurso" component={VerCurso} options={{ headerShown: false }} />
      <Stack.Screen name="CrearHorario" component={CrearHorario} options={{ headerShown: false }} />
      <Stack.Screen name="VerHorario" component={VerHorario} options={{ headerShown: false }} />
      <Stack.Screen name="ActualizarHorario" component={ActualizarHorario} options={{ headerShown: false }} />
      <Stack.Screen name="CrearAula" component={CrearAula} options={{ headerShown: false }} />
      <Stack.Screen name="VerAula" component={VerAula} options={{ headerShown: false }} />
      <Stack.Screen name="VerNoticia" component={VerNoticia} options={{ headerShown: false }} />
      <Stack.Screen name="CrearNoticia" component={CrearNoticia} options={{ headerShown: false }} />
      <Stack.Screen name="ActualizarNoticia" component={ActualizarNoticia} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
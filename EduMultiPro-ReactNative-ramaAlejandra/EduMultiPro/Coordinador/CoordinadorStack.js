import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// pantallas de coordinador
import cursos from './cursos';
import horarios from './horarios';
import noticias from './noticias';
import materias from './materias';
import grados from './grados';
import jornadas from './jornadas';
import crearCursos from './crearCursos';
import crearHorarios from './crearHorarios';
import crearNoticias from './crearNoticias';
import verCursos from './verCursos';
import verHorarios from './verHorarios';
import verNoticias from './verNoticias';
import modHorarios from './modHorarios';
import modNoticias from './modNoticias'; 
import perfil from "./perfil";

import DesplegableCoor from './DesplegableCoor';

const Stack = createNativeStackNavigator();

export default function CoordinadorStack() {
  return (
    <Stack.Navigator>
      {/* Pantallas principales */}
      <Stack.Screen 
        name="cursos" 
        component={cursos} 
        options={{ headerShown: false, headerTitle: () => <DesplegableCoor /> }} 
      />

      <Stack.Screen 
        name="horarios" 
        component={horarios} 
        options={{ headerShown: false, headerTitle: () => <DesplegableCoor /> }} 
      />

      <Stack.Screen 
        name="noticias" 
        component={noticias} 
        options={{ headerShown: false, headerTitle: () => <DesplegableCoor /> }} 
      />
      <Stack.Screen 
        name="perfil" 
        component={perfil} 
        options={{ headerShown: false, headerTitle: () => <DesplegableCoor /> }} 
      />

      

      {/* Pantallas CRUD */}
      <Stack.Screen name="crearCursos" component={crearCursos} options={{ headerShown: false }} />
      <Stack.Screen name="crearHorarios" component={crearHorarios} options={{ headerShown: false }} />
      <Stack.Screen name="crearNoticias" component={crearNoticias} options={{ headerShown: false }} />
      <Stack.Screen name="grados" component={grados} options={{ headerShown: false }} />
      <Stack.Screen name="jornadas" component={jornadas} options={{ headerShown: false }} />
      <Stack.Screen name="materias" component={materias} options={{ headerShown: false }} />
      <Stack.Screen name="modHorarios" component={modHorarios} options={{ headerShown: false }} />
      <Stack.Screen name="modNoticias" component={modNoticias} options={{ headerShown: false }} />
      <Stack.Screen name="verHorarios" component={verHorarios} options={{ headerShown: false }} />
      <Stack.Screen name="verNoticias" component={verNoticias} options={{ headerShown: false }} />
      <Stack.Screen name="verCursos" component={verCursos} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

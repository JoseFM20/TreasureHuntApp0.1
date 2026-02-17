/**
 * @file App.tsx
 * Punto de entrada principal de la aplicación
 */

// ✅ Importar polyfills PRIMERO
import 'react-native-fetch-api';
import 'whatwg-fetch';
import { Buffer } from 'buffer';

// Hacer Buffer disponible globalmente
(global as any).Buffer = Buffer;

// ✅ Polyfills para fetch API completa
if (typeof global.btoa === 'undefined') {
  global.btoa = function(str: string) {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof global.atob === 'undefined') {
  global.atob = function(str: string) {
    return Buffer.from(str, 'base64').toString('binary');
  };
}

if (typeof global.Headers === 'undefined') {
  (global as any).Headers = require('react-native-fetch-api').Headers;
}

if (typeof global.Request === 'undefined') {
  (global as any).Request = require('react-native-fetch-api').Request;
}

if (typeof global.Response === 'undefined') {
  (global as any).Response = require('react-native-fetch-api').Response;
}

console.log('[App] ✅ Polyfills completos configurados');
console.log('[App] fetch disponible:', typeof global.fetch !== 'undefined');

import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './src/context';
import { 
  SplashScreen, 
  HomeScreen, 
  CameraScreen, 
  FoundListScreen, 
  ScoreboardScreen 
} from './src/screens';

/**
 * Componente interno que renderiza la pantalla actual
 */
const AppContent: React.FC = () => {
  const { currentScreen } = useAppContext();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Mostrar splash por 3 segundos al iniciar
  if (showSplash) {
    return (
      <SplashScreen 
        onFinish={handleSplashFinish} 
        duration={3}
        imageSource={require('./src/assets/treasure-hunt-splash.png')}
      />
    );
  }

  return (
    <>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'camera' && <CameraScreen />}
      {currentScreen === 'found' && <FoundListScreen />}
      {currentScreen === 'scoreboard' && <ScoreboardScreen />}
    </>
  );
};

/**
 * Componente raíz de la aplicación
 */
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

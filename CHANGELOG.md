# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-15

### Added
- ✨ Estructura inicial del proyecto con TypeScript
- 📱 Pantalla principal (Home) con lista de objetivos
- 📷 Pantalla de captura de fotos y videos cortos (≤10s)
- 📋 Pantalla de items encontrados con organización por fechas
- 💾 Servicio de almacenamiento local con AsyncStorage
- 🎥 Servicio de cámara con manejo de permisos
- 🪝 Hooks personalizados (useCamera, useFoundItems)
- 🎨 Componentes reutilizables (Button, Card, LoadingSpinner)
- 🎯 Sistema de constantes centralizadas
- 🌍 Contexto global (AppContext) con React Context
- 📚 Utilidades para formateo, estadísticas y agrupación
- 🔄 Manejo robusto de errores y sincronización
- 📖 Documentación completa (README, DEVELOPMENT)
- ⚙️ Configuración de Expo y Metro

### Features
- Captura de fotos con calidad configurable
- Grabación de videos con duración máxima
- Almacenamiento persistente de items
- Visualización de historial por fecha
- Eliminación de items individuales
- Contador de items encontrados
- Indicadores visuales de objetivos completados

### Technical
- TypeScript para tipado estático
- React Native 0.71.8
- Expo 48.0.0
- React 18.2.0
- expo-camera 13.0.0
- AsyncStorage para persistencia

## Próxima Release [1.1.0] - Planeado

### Planned
- [ ] Integración con GPS/ubicación
- [ ] Subida a cloud storage (Firebase)
- [ ] Compartir en redes sociales
- [ ] Sistema de puntuación
- [ ] Competencias entre usuarios
- [ ] Temas personalizables
- [ ] Múltiples idiomas
- [ ] Notificaciones push

---

**Notas de Versión:**
- Versión inicial completamente funcional
- Todas las características básicas implementadas
- Código limpio y documentado
- Listo para producción con posibles mejoras

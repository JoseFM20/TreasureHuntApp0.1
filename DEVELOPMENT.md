# 📚 Guía de Desarrollo - Treasure Hunt App

## Convenciones de Código

### Estructura de Ficheros

Cada archivo TypeScript debe incluir:
1. Comentario de cabecera con ruta del archivo
2. Importaciones organizadas
3. Tipos/interfaces al principio
4. Componentes/funciones
5. Estilos al final (si aplica)

### Ejemplo:

```typescript
/**
 * @file src/screens/HomeScreen.tsx
 * Descripción del módulo
 */

import React from 'react';
import { View } from 'react-native';
import type { FC } from 'react';

interface Props {
  // tipos
}

export const HomeScreen: FC<Props> = (props) => {
  return <View />;
};
```

## Convenciones de Nombres

- **Carpetas**: `kebab-case` (ej: `src/services/`)
- **Archivos**: `PascalCase` para componentes (ej: `HomeScreen.tsx`), `camelCase` para servicios (ej: `storageService.ts`)
- **Funciones**: `camelCase` (ej: `generateId()`)
- **Tipos**: `PascalCase` (ej: `FoundItem`, `AppContextType`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `STORAGE_KEY`)

## Estructura de un Componente

```typescript
interface ComponentProps {
  // Props aquí
}

export const MyComponent: React.FC<ComponentProps> = ({
  prop1,
  prop2
}) => {
  // Estado y hooks
  const [state, setState] = useState(null);

  // Efectos
  useEffect(() => {
    // lógica
  }, []);

  // Handlers
  const handlePress = () => {};

  // Render
  return <View />;
};

const styles = StyleSheet.create({
  // Estilos
});
```

## Estructura de un Servicio

```typescript
/**
 * Descripción breve de qué hace el servicio
 */
export const serviceFunction = async (): Promise<ReturnType> => {
  try {
    // Lógica
    return result;
  } catch (error) {
    console.error('Mensaje descriptivo:', error);
    throw error;
  }
};
```

## Estructura de un Hook

```typescript
export const useMyHook = () => {
  const [state, setState] = useState(null);

  const handleSomething = useCallback(() => {
    // lógica
  }, []);

  useEffect(() => {
    // Carga inicial
  }, []);

  return { state, handleSomething };
};
```

## Checklist de Desarrollo

Antes de hacer commit:

- [ ] El código sigue las convenciones establecidas
- [ ] Sin imports no utilizados
- [ ] TypeScript sin errores (`npx tsc --noEmit`)
- [ ] Los componentes son reutilizables
- [ ] Manejo de errores correcto
- [ ] Comentarios en funciones complejas
- [ ] Props documentadas
- [ ] Estilos organizados

## Testing

### Estructura de Tests

```typescript
// src/__tests__/services/storageService.test.ts
import { getFoundItems } from '../../services';

describe('storageService', () => {
  describe('getFoundItems', () => {
    it('debería retornar items encontrados', async () => {
      const items = await getFoundItems();
      expect(Array.isArray(items)).toBe(true);
    });
  });
});
```

## Debugging

### Logs

```typescript
// Logs de información
console.log('Info:', value);

// Logs de error
console.error('Error:', error);

// Logs de advertencia
console.warn('Warning:', value);
```

### Herramientas

- **Expo DevTools**: `Ctrl + M` (Android) o `Cmd + M` (iOS)
- **React Developer Tools**: Extensión de navegador
- **Redux DevTools**: Para debugging de estado

## Performance

### Optimizaciones

```typescript
// Usar useCallback para funciones
const handlePress = useCallback(() => {
  // lógica
}, []);

// Usar useMemo para valores computados
const stats = useMemo(() => getStats(items), [items]);

// Lazy loading de pantallas (si se needed)
// const HomeScreen = lazy(() => import('./screens/HomeScreen'));
```

## Git Workflow

### Commits

```bash
# Por feature
git checkout -b feature/camera-improvements

# Commits atómicos y descriptivos
git commit -m "feat: mejorar interfaz de captura de cámara"
git commit -m "fix: resolver error al guardar videos"
git commit -m "docs: actualizar guía de desarrollo"
```

### Tipos de Commits

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios de documentación
- `style:` Cambios de formato
- `refactor:` Refactorización
- `perf:` Mejoras de rendimiento
- `test:` Agregar tests

## Recursos

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Context API](https://react.dev/reference/react/useContext)

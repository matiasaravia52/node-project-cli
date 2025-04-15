# Node Project CLI

Una herramienta de línea de comandos para generar proyectos Node.js con configuraciones predefinidas y buenas prácticas.

## Características

Esta CLI permite generar rápidamente proyectos con configuraciones listas para usar:

### Proyectos Backend (Express)
- Soporte para TypeScript
- Opciones de base de datos: MongoDB o PostgreSQL
- Configuración de Docker para desarrollo y producción
- ESLint y Prettier
- Manejo adecuado de errores para TypeScript

### Proyectos Frontend (React)
- React con create-react-app
- Soporte para TypeScript
- CSS Modules (sin Tailwind ni PostCSS)
- ESLint y Prettier

### Proyectos Frontend (Next.js)
- Next.js con App Router
- Soporte para TypeScript
- CSS Modules (sin Tailwind ni PostCSS)
- ESLint y Prettier

## Instalación

### Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/matiasaravia52/node-project-cli.git

# Entrar al directorio
cd node-project-cli

# Instalar dependencias
npm install

# Crear un enlace simbólico global
npm link
```

### Instalación desde npm (cuando esté publicado)

```bash
npm install -g node-project-cli
```

## Uso

Una vez instalado, puedes usar la CLI con el comando `init-project`:

```bash
# Iniciar el asistente interactivo
init-project init

# O especificar opciones directamente
init-project init --type backend --name mi-proyecto-api --typescript --db postgres --docker
```

### Opciones disponibles

- `--type`: Tipo de proyecto (`backend`, `react`, `nextjs`)
- `--name`: Nombre del proyecto
- `--typescript`: Habilitar soporte para TypeScript
- `--db`: Base de datos para proyectos backend (`mongodb`, `postgres`)
- `--docker`: Incluir configuración de Docker
- `--lint`: Incluir ESLint y Prettier

## Estructura de los proyectos generados

### Proyectos Backend

```
proyecto/
  |- src/                  # Código fuente
  |   |- config/          # Configuración (base de datos, etc.)
  |   |- controllers/     # Controladores
  |   |- middleware/      # Middleware personalizado
  |   |- models/          # Modelos de datos
  |   |- routes/          # Definición de rutas
  |   |- utils/           # Utilidades
  |   |- app.ts/js        # Configuración de la aplicación Express
  |- index.ts/js          # Punto de entrada principal
  |- .env                 # Variables de entorno (no incluir en git)
  |- .env.example         # Ejemplo de variables de entorno
  |- docker-compose.yml    # Configuración de Docker para desarrollo completo
  |- docker-compose.db.yml # Configuración de Docker solo para base de datos
  |- Dockerfile            # Configuración de Docker para producción
  |- Dockerfile.dev        # Configuración de Docker para desarrollo
  |- tsconfig.json         # Configuración de TypeScript (si aplica)
  |- .eslintrc.js          # Configuración de ESLint (si aplica)
  |- .prettierrc           # Configuración de Prettier (si aplica)
```

### Proyectos React

```
proyecto/
  |- public/              # Archivos públicos estáticos
  |- src/                 # Código fuente
  |   |- assets/         # Imágenes, iconos, etc.
  |   |- components/     # Componentes reutilizables
  |   |- hooks/          # Custom hooks
  |   |- pages/          # Componentes de página
  |   |- services/       # Servicios para API, etc.
  |   |- styles/         # Estilos globales
  |   |- utils/          # Funciones utilitarias
  |   |- App.tsx/jsx     # Componente principal
  |   |- index.tsx/jsx   # Punto de entrada
  |- package.json        # Dependencias y scripts
  |- tsconfig.json       # Configuración de TypeScript (si aplica)
  |- .eslintrc.js        # Configuración de ESLint (si aplica)
  |- .prettierrc         # Configuración de Prettier (si aplica)
```

### Proyectos Next.js

```
proyecto/
  |- app/                 # App Router de Next.js
  |   |- layout.tsx/jsx  # Layout principal
  |   |- page.tsx/jsx    # Página principal
  |- components/          # Componentes reutilizables
  |- hooks/               # Custom hooks
  |- services/            # Servicios para API, etc.
  |- styles/              # Estilos globales
  |- utils/               # Funciones utilitarias
  |- public/              # Archivos públicos estáticos
  |- package.json         # Dependencias y scripts
  |- next.config.js       # Configuración de Next.js
  |- tsconfig.json        # Configuración de TypeScript (si aplica)
  |- .eslintrc.js         # Configuración de ESLint (si aplica)
  |- .prettierrc          # Configuración de Prettier (si aplica)
```

## Scripts disponibles en los proyectos generados

### Proyectos Backend

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática
- `npm run build`: Compila el código TypeScript para producción
- `npm start`: Inicia el servidor en modo producción
- `npm test`: Ejecuta las pruebas
- `npm run db:up`: Inicia la base de datos en Docker
- `npm run db:down`: Detiene la base de datos en Docker
- `npm run dev:local`: Inicia la base de datos y el servidor en modo desarrollo

### Proyectos React

- `npm start`: Inicia la aplicación en modo desarrollo
- `npm test`: Ejecuta las pruebas
- `npm run build`: Construye la aplicación para producción

### Proyectos Next.js

- `npm run dev`: Inicia la aplicación en modo desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm start`: Inicia un servidor de producción con la aplicación construida
- `npm run lint`: Ejecuta el linter

## Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`)
3. Haz tus cambios y realiza commits (`git commit -am 'Añadir nueva característica'`)
4. Sube tus cambios (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Autor

- [Matías Aravia](https://github.com/matiasaravia52)

// Templates para proyectos backend
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

const createBackendProject = (projectDir, options) => {
  const { name, db, typescript, docker, lintAndPrettier } = options;
  
  console.log(chalk.blue('📁 Creando estructura de carpetas para proyecto backend...'));
  
  // Crear estructura de carpetas similar a finances-api
  fs.mkdirSync(`${projectDir}/src`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/routes`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/controllers`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/models`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/middleware`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/utils`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/config`, { recursive: true });
  
  // Crear archivos base
  console.log(chalk.blue('📄 Creando archivos base...'));
  
  // Crear .env
  fs.writeFileSync(`${projectDir}/.env`, `PORT=3000
NODE_ENV=development
${db === 'MongoDB' ? 'MONGODB_URI=mongodb://localhost:27017/' + name : 'DATABASE_URL=postgres://postgres:postgres@localhost:5432/' + name}
`);

  // Crear .env.example
  fs.writeFileSync(`${projectDir}/.env.example`, `PORT=3000
NODE_ENV=development
${db === 'MongoDB' ? 'MONGODB_URI=mongodb://localhost:27017/' + name : 'DATABASE_URL=postgres://postgres:postgres@localhost:5432/' + name}
`);

  // Crear .gitignore
  fs.writeFileSync(`${projectDir}/.gitignore`, `node_modules
.env
dist
coverage
.DS_Store
`);

  // Crear README.md
  let readmeContent = `# ${name}

API backend construida con Express${typescript ? ' y TypeScript' : ''}.

## Requisitos

- Node.js 14+
- ${db === 'MongoDB' ? 'MongoDB' : 'PostgreSQL'}`;

  if (docker) {
    readmeContent += '\n- Docker y Docker Compose';
  }

  readmeContent += `

## Instalación

\`\`\`bash
npm install
\`\`\`

## Desarrollo

\`\`\`bash
npm run dev
\`\`\`

## Producción

\`\`\`bash
npm run build
npm start
\`\`\`
`;

  fs.writeFileSync(`${projectDir}/README.md`, readmeContent);

  // Crear archivo de configuración de base de datos
  const dbConfigFile = typescript ? 'ts' : 'js';
  
  if (db === 'MongoDB') {
    fs.writeFileSync(`${projectDir}/src/config/database.${dbConfigFile}`, typescript ? 
`import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${name}');
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error: unknown) {
    // Manejar el error correctamente para TypeScript
    if (error instanceof Error) {
      console.error(\`Error: \${error.message}\`);
    } else {
      console.error('Error desconocido al conectar a la base de datos');
    }
    process.exit(1);
  }
};

export default connectDB;
` : 
`const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${name}');
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;
`);
  } else {
    fs.writeFileSync(`${projectDir}/src/config/database.${dbConfigFile}`, typescript ? 
`import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/${name}', {
  dialect: 'postgres',
  logging: false,
});

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
  } catch (error: unknown) {
    // Manejar el error correctamente para TypeScript
    if (error instanceof Error) {
      console.error(\`Error: \${error.message}\`);
    } else {
      console.error('Error desconocido al conectar a la base de datos');
    }
    process.exit(1);
  }
};

export { sequelize, connectDB };
` : 
`const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/${name}', {
  dialect: 'postgres',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
`);
  }

  // Crear ruta de ping
  fs.writeFileSync(`${projectDir}/src/routes/ping.${dbConfigFile}`, typescript ? 
`import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

export default router;
` : 
`const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

module.exports = router;
`);

  // Crear archivo principal de la aplicación
  fs.writeFileSync(`${projectDir}/src/app.${dbConfigFile}`, typescript ? 
`import express, { Express } from 'express';
import dotenv from 'dotenv';
import pingRouter from './routes/ping';
${db === 'MongoDB' ? 'import connectDB from \'./config/database\';' : 'import { connectDB } from \'./config/database\';'}

dotenv.config();

// Conectar a la base de datos
connectDB();

const app: Express = express();

app.use(express.json());
app.use(pingRouter);

export default app;
` : 
`const express = require('express');
const dotenv = require('dotenv');
const pingRouter = require('./routes/ping');
${db === 'MongoDB' ? 'const connectDB = require(\'./config/database\');' : 'const { connectDB } = require(\'./config/database\');'}

dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

app.use(express.json());
app.use(pingRouter);

module.exports = app;
`);

  // Crear index.js o index.ts en la raíz
  fs.writeFileSync(`${projectDir}/index.${dbConfigFile}`, typescript ? 
`import app from './src/app';

// Este archivo es el punto de entrada para producción
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(\`Servidor corriendo en puerto \${PORT}\`));
` : 
`const app = require('./src/app');

// Este archivo es el punto de entrada para producción
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(\`Servidor corriendo en puerto \${PORT}\`));
`);

  // Inicializar proyecto npm
  console.log(chalk.blue('📦 Inicializando proyecto npm...'));
  execSync('npm init -y', { cwd: projectDir, stdio: 'inherit' });
  
  // Modificar package.json
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.scripts = {
    "start": typescript ? "node dist/index.js" : "node index.js",
    "dev": typescript ? "ts-node-dev --respawn index.ts" : "nodemon index.js",
    "build": typescript ? "tsc" : "echo \"No build step needed\"",
    "test": "jest"
  };
  
  // Agregar scripts para Docker si es necesario
  if (docker) {
    packageJson.scripts = {
      ...packageJson.scripts,
      "db:up": "docker compose -f docker-compose.db.yml up -d",
      "db:down": "docker compose -f docker-compose.db.yml down",
      "dev:local": "npm run db:up && npm run dev"
    };
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  // Instalar dependencias
  console.log(chalk.blue('📦 Instalando dependencias...'));
  execSync('npm install express dotenv cors helmet', { cwd: projectDir, stdio: 'inherit' });
  
  // Instalar dependencias de desarrollo
  console.log(chalk.blue('📦 Instalando dependencias de desarrollo...'));
  execSync('npm install jest nodemon --save-dev', { cwd: projectDir, stdio: 'inherit' });
  
  // Instalar dependencias específicas de la base de datos
  if (db === 'MongoDB') {
    execSync('npm install mongoose', { cwd: projectDir, stdio: 'inherit' });
  } else {
    execSync('npm install pg pg-hstore sequelize', { cwd: projectDir, stdio: 'inherit' });
  }
  
  // Configurar TypeScript si es necesario
  if (typescript) {
    console.log(chalk.blue('🔧 Configurando TypeScript...'));
    execSync('npm install typescript ts-node ts-node-dev @types/node @types/express @types/cors @types/helmet --save-dev', { cwd: projectDir, stdio: 'inherit' });
    
    // Crear tsconfig.json
    fs.writeFileSync(`${projectDir}/tsconfig.json`, `{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "index.ts"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
`);
  }
  
  // Configurar ESLint y Prettier si es necesario
  if (lintAndPrettier) {
    console.log(chalk.blue('🔧 Configurando ESLint y Prettier...'));
    
    // Instalar dependencias
    execSync('npm install eslint prettier eslint-config-prettier eslint-plugin-prettier --save-dev', { cwd: projectDir, stdio: 'inherit' });
    
    if (typescript) {
      execSync('npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser --save-dev', { cwd: projectDir, stdio: 'inherit' });
    }
    
    // Crear .eslintrc.js
    fs.writeFileSync(`${projectDir}/.eslintrc.js`, typescript ? 
`module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Personaliza tus reglas aquí
  },
};
` : 
`module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Personaliza tus reglas aquí
  },
};
`);
    
    // Crear .prettierrc
    fs.writeFileSync(`${projectDir}/.prettierrc`, `{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
`);
  }
  
  // Configurar Docker si es necesario
  if (docker) {
    console.log(chalk.blue('🐳 Configurando Docker...'));
    
    // Crear Dockerfile para producción
    fs.writeFileSync(`${projectDir}/Dockerfile`, `FROM node:16-alpine

WORKDIR /app

# Instalar dependencias primero para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

${typescript ? `# Compilar la aplicación TypeScript
RUN npm run build

# Verificar que el archivo compilado existe
RUN ls -la dist/` : ''}

EXPOSE 3000

# Usar node directamente en lugar de npm para evitar problemas de señales
CMD ["${typescript ? `node` : `npm`}", "${typescript ? `dist/index.js` : `start`}"]
`);
    
    // Crear Dockerfile.dev para desarrollo
    fs.writeFileSync(`${projectDir}/Dockerfile.dev`, `FROM node:16-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

EXPOSE 3000

# Ejecutar en modo desarrollo
CMD ["npm", "run", "dev"]
`);
    
    // Crear docker-compose.yml
    fs.writeFileSync(`${projectDir}/docker-compose.yml`, db === 'MongoDB' ? 
`services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/${name}
    depends_on:
      - mongo
    volumes:
      - .:/app
      - /app/node_modules

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
` : 
`services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/${name}
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

  postgres:
    image: postgres:latest
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${name}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
`);
    
    // Crear docker-compose.db.yml para ejecutar solo la base de datos
    fs.writeFileSync(`${projectDir}/docker-compose.db.yml`, db === 'MongoDB' ? 
`services:
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
` : 
`services:
  postgres:
    image: postgres:latest
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${name}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
`);
  }
  
  console.log(chalk.green('✅ Proyecto backend creado exitosamente.'));
};

module.exports = { createBackendProject };

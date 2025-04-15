// Templates para proyectos Next.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

const createNextProject = (projectDir, options) => {
  const { name, typescript, lintAndPrettier } = options;
  
  console.log(chalk.blue('📁 Creando proyecto Next.js con CSS Modules...'));
  
  // Crear proyecto Next.js
  console.log(chalk.blue('⚛️ Inicializando proyecto Next.js...'));
  execSync(`npx create-next-app ${projectDir} ${typescript ? '--typescript' : ''} --eslint --no-tailwind --no-src-dir --app`, { stdio: 'inherit' });
  
  // Crear estructura de carpetas similar a finances-app
  console.log(chalk.blue('📁 Creando estructura de carpetas adicionales...'));
  fs.mkdirSync(`${projectDir}/components`, { recursive: true });
  fs.mkdirSync(`${projectDir}/hooks`, { recursive: true });
  fs.mkdirSync(`${projectDir}/utils`, { recursive: true });
  fs.mkdirSync(`${projectDir}/services`, { recursive: true });
  
  // Eliminar archivos innecesarios y configuraciones de Tailwind si existen
  console.log(chalk.blue('🧹 Limpiando archivos innecesarios...'));
  if (fs.existsSync(`${projectDir}/tailwind.config.js`)) {
    fs.unlinkSync(`${projectDir}/tailwind.config.js`);
  }
  if (fs.existsSync(`${projectDir}/postcss.config.js`)) {
    fs.unlinkSync(`${projectDir}/postcss.config.js`);
  }
  
  // Crear archivos base
  console.log(chalk.blue('📄 Creando archivos base...'));
  
  // Crear archivo de estilos globales
  fs.writeFileSync(`${projectDir}/app/globals.css`, `:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  --text-color: #333333;
  --background-color: #ffffff;
  --gray-light: #f5f5f5;
  --gray-medium: #dddddd;
  --gray-dark: #666666;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background-color);
  color: var(--text-color);
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

button {
  cursor: pointer;
}
`);

  // Crear componente de ejemplo con CSS Modules
  const fileExt = typescript ? 'tsx' : 'js';
  const cssExt = 'module.css';
  
  fs.mkdirSync(`${projectDir}/components/Button`, { recursive: true });
  
  fs.writeFileSync(`${projectDir}/components/Button/Button.${cssExt}`, `.button {
  padding: 10px 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
}

.secondary {
  background-color: var(--secondary-color);
}

.secondary:hover {
  background-color: #27ae60;
}
`);

  fs.writeFileSync(`${projectDir}/components/Button/Button.${fileExt}`, typescript ? 
`'use client';

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button' 
}) => {
  return (
    <button
      className={\`\${styles.button} \${variant === 'secondary' ? styles.secondary : ''}\`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
` : 
`'use client';

import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  return (
    <button
      className={\`\${styles.button} \${variant === 'secondary' ? styles.secondary : ''}\`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
`);

  fs.writeFileSync(`${projectDir}/components/Button/index.${fileExt}`, 
`export { default } from './Button';
`);

  // Actualizar página principal
  fs.writeFileSync(`${projectDir}/app/page.${fileExt}`, typescript ? 
`import Button from '@/components/Button';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1>Bienvenido a tu nueva aplicación Next.js</h1>
        <p>Edita <code>app/page.tsx</code> y guarda para recargar.</p>
      </div>
      
      <div className={styles.buttons}>
        <Button>Botón Primario</Button>
        <Button variant="secondary">Botón Secundario</Button>
      </div>
    </main>
  );
}
` : 
`import Button from '@/components/Button';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1>Bienvenido a tu nueva aplicación Next.js</h1>
        <p>Edita <code>app/page.js</code> y guarda para recargar.</p>
      </div>
      
      <div className={styles.buttons}>
        <Button>Botón Primario</Button>
        <Button variant="secondary">Botón Secundario</Button>
      </div>
    </main>
  );
}
`);

  // Actualizar CSS de la página
  fs.writeFileSync(`${projectDir}/app/page.module.css`, `.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem;
  min-height: 100vh;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
}

.center h1 {
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .main {
    padding: 2rem;
  }
  
  .buttons {
    flex-direction: column;
  }
}
`);

  // Actualizar README.md
  fs.writeFileSync(`${projectDir}/README.md`, `# ${name}

Aplicación Next.js${typescript ? ' con TypeScript' : ''} y CSS Modules.

## Estructura del Proyecto

\`\`\`
app/             # App Router de Next.js
  ├── layout.js  # Layout principal
  ├── page.js    # Página principal
components/      # Componentes reutilizables
hooks/           # Custom hooks
services/        # Servicios para API, etc.
utils/           # Funciones utilitarias
\`\`\`

## Scripts Disponibles

### \`npm run dev\`

Ejecuta la aplicación en modo desarrollo.
Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

### \`npm run build\`

Construye la aplicación para producción.

### \`npm start\`

Inicia un servidor de producción con la aplicación construida.
`);

  // Configurar ESLint y Prettier si es necesario
  if (lintAndPrettier) {
    console.log(chalk.blue('🔧 Configurando ESLint y Prettier...'));
    
    // Crear .prettierrc
    fs.writeFileSync(`${projectDir}/.prettierrc`, `{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
`);
    
    // Instalar dependencias de ESLint y Prettier
    execSync('npm install eslint-config-prettier eslint-plugin-prettier prettier --save-dev', { cwd: projectDir, stdio: 'inherit' });
    
    // Actualizar package.json para agregar scripts
    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.scripts = {
      ...packageJson.scripts,
      "lint": "next lint",
      "format": "prettier --write \"**/*.{js,jsx,ts,tsx,css,md}\""
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Actualizar .eslintrc.json
    fs.writeFileSync(`${projectDir}/.eslintrc.json`, `{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
`);
  }
  
  // Eliminar dependencias de Tailwind si existen
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies.tailwindcss) {
    delete packageJson.dependencies.tailwindcss;
  }
  
  if (packageJson.devDependencies && packageJson.devDependencies.tailwindcss) {
    delete packageJson.devDependencies.tailwindcss;
  }
  
  if (packageJson.devDependencies && packageJson.devDependencies.postcss) {
    delete packageJson.devDependencies.postcss;
  }
  
  if (packageJson.devDependencies && packageJson.devDependencies.autoprefixer) {
    delete packageJson.devDependencies.autoprefixer;
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  // Instalar dependencias actualizadas
  console.log(chalk.blue('📦 Actualizando dependencias...'));
  execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
  
  console.log(chalk.green('✅ Proyecto Next.js creado exitosamente.'));
};

module.exports = { createNextProject };

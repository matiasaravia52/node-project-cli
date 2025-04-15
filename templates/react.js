// Templates para proyectos React
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

const createReactProject = (projectDir, options) => {
  const { name, typescript, lintAndPrettier } = options;
  
  console.log(chalk.blue('📁 Creando proyecto React con CSS Modules...'));
  
  // Crear proyecto React
  console.log(chalk.blue('⚛️ Inicializando proyecto React...'));
  execSync(`npx create-react-app ${projectDir} ${typescript ? '--template typescript' : ''}`, { stdio: 'inherit' });
  
  // Eliminar archivos innecesarios
  console.log(chalk.blue('🧹 Limpiando archivos innecesarios...'));
  fs.unlinkSync(`${projectDir}/src/App.css`);
  fs.unlinkSync(`${projectDir}/src/logo.svg`);
  
  // Crear estructura de carpetas similar a finances-app
  console.log(chalk.blue('📁 Creando estructura de carpetas...'));
  fs.mkdirSync(`${projectDir}/src/components`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/pages`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/hooks`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/utils`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/services`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/assets`, { recursive: true });
  fs.mkdirSync(`${projectDir}/src/styles`, { recursive: true });
  
  // Crear archivos base
  console.log(chalk.blue('📄 Creando archivos base...'));
  
  // Crear archivo de estilos globales
  fs.writeFileSync(`${projectDir}/src/styles/globals.css`, `:root {
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

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background-color);
  color: var(--text-color);
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
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
  const fileExt = typescript ? 'tsx' : 'jsx';
  const cssExt = 'module.css';
  
  fs.writeFileSync(`${projectDir}/src/components/Button.${cssExt}`, `.button {
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

  fs.writeFileSync(`${projectDir}/src/components/Button.${fileExt}`, typescript ? 
`import React from 'react';
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
`import React from 'react';
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

  // Crear App.js o App.tsx actualizado
  fs.writeFileSync(`${projectDir}/src/App.${fileExt}`, typescript ? 
`import React from 'react';
import Button from './components/Button';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bienvenido a tu nueva aplicación React</h1>
      <p>Edita <code>src/App.tsx</code> y guarda para recargar.</p>
      <div style={{ marginTop: '20px' }}>
        <Button onClick={() => alert('¡Botón primario clickeado!')}>Botón Primario</Button>
        <span style={{ margin: '0 10px' }}></span>
        <Button variant="secondary" onClick={() => alert('¡Botón secundario clickeado!')}>
          Botón Secundario
        </Button>
      </div>
    </div>
  );
};

export default App;
` : 
`import React from 'react';
import Button from './components/Button';
import './styles/globals.css';

function App() {
  return (
    <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bienvenido a tu nueva aplicación React</h1>
      <p>Edita <code>src/App.js</code> y guarda para recargar.</p>
      <div style={{ marginTop: '20px' }}>
        <Button onClick={() => alert('¡Botón primario clickeado!')}>Botón Primario</Button>
        <span style={{ margin: '0 10px' }}></span>
        <Button variant="secondary" onClick={() => alert('¡Botón secundario clickeado!')}>
          Botón Secundario
        </Button>
      </div>
    </div>
  );
}

export default App;
`);

  // Actualizar index.js o index.tsx
  fs.writeFileSync(`${projectDir}/src/index.${typescript ? 'tsx' : 'js'}`, typescript ? 
`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
` : 
`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
`);

  // Actualizar README.md
  fs.writeFileSync(`${projectDir}/README.md`, `# ${name}

Aplicación React${typescript ? ' con TypeScript' : ''} y CSS Modules.

## Estructura del Proyecto

\`\`\`
src/
  ├── assets/       # Imágenes, iconos, etc.
  ├── components/   # Componentes reutilizables
  ├── hooks/        # Custom hooks
  ├── pages/        # Componentes de página
  ├── services/     # Servicios para API, etc.
  ├── styles/       # Estilos globales
  └── utils/        # Funciones utilitarias
\`\`\`

## Scripts Disponibles

### \`npm start\`

Ejecuta la aplicación en modo desarrollo.
Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

### \`npm test\`

Ejecuta los tests en modo interactivo.

### \`npm run build\`

Construye la aplicación para producción en la carpeta \`build\`.
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
      "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
      "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
      "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\""
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Crear o actualizar .eslintrc.js
    fs.writeFileSync(`${projectDir}/.eslintrc.js`, typescript ? 
`module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [1, { 'extensions': ['.tsx', '.jsx'] }]
  }
};
` : 
`module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [1, { 'extensions': ['.jsx'] }]
  }
};
`);
  }
  
  console.log(chalk.green('✅ Proyecto React creado exitosamente.'));
};

module.exports = { createReactProject };

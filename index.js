#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Importar templates
const { createBackendProject } = require('./templates/backend');
const { createReactProject } = require('./templates/react');
const { createNextProject } = require('./templates/nextjs');

// Comando para crear un nuevo proyecto
const createProject = async () => {
  // Preguntar tipo de proyecto
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: '¿Qué tipo de proyecto querés crear?',
      choices: [
        { name: 'Backend (Express)', value: 'backend' },
        { name: 'Frontend (React)', value: 'react' },
        { name: 'Frontend (Next.js)', value: 'nextjs' }
      ]
    }
  ]);

  // Preguntas comunes para todos los proyectos
  const commonQuestions = [
    { name: 'name', message: 'Nombre del proyecto:' },
    {
      type: 'confirm',
      name: 'typescript',
      message: '¿Querés usar TypeScript?',
      default: false
    },
    {
      type: 'confirm',
      name: 'lintAndPrettier',
      message: '¿Querés configurar ESLint y Prettier?',
      default: true
    }
  ];

  // Preguntas específicas para backend
  const backendQuestions = [
    {
      type: 'list',
      name: 'db',
      message: '¿Qué base de datos vas a usar?',
      choices: ['MongoDB', 'PostgreSQL']
    },
    {
      type: 'confirm',
      name: 'docker',
      message: '¿Querés incluir Docker?',
      default: false
    }
  ];

  // Obtener respuestas según el tipo de proyecto
  let answers;
  
  if (projectType === 'backend') {
    answers = await inquirer.prompt([...commonQuestions, ...backendQuestions]);
  } else {
    answers = await inquirer.prompt(commonQuestions);
  }

  // Crear directorio del proyecto
  const projectDir = path.join(process.cwd(), answers.name);
  
  // Verificar si el directorio ya existe
  if (fs.existsSync(projectDir)) {
    console.log(chalk.red(`❌ Error: El directorio ${answers.name} ya existe.`));
    return;
  }

  // Crear el proyecto según el tipo seleccionado
  try {
    switch (projectType) {
      case 'backend':
        createBackendProject(projectDir, answers);
        break;
      case 'react':
        createReactProject(projectDir, answers);
        break;
      case 'nextjs':
        createNextProject(projectDir, answers);
        break;
      default:
        console.log(chalk.red('❌ Tipo de proyecto no soportado.'));
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error al crear el proyecto: ${error.message}`));
    console.error(error);
  }
};

// Comando para mostrar información de la herramienta
const showInfo = () => {
  console.log(chalk.blue('=== Project CLI ==='));
  console.log('Una herramienta para crear proyectos con configuraciones predefinidas.');
  console.log('\nTipos de proyectos soportados:');
  console.log('- Backend (Express) con MongoDB o PostgreSQL');
  console.log('- Frontend (React) con CSS Modules');
  console.log('- Frontend (Next.js) con CSS Modules');
  console.log('\nPara crear un nuevo proyecto, ejecuta:');
  console.log(chalk.green('init-project init'));
};

// Definir comandos
program
  .command('init')
  .description('Inicia un nuevo proyecto')
  .action(createProject);

program
  .command('info')
  .description('Muestra información sobre la herramienta')
  .action(showInfo);

// Mostrar ayuda si no se proporciona ningún comando
if (!process.argv.slice(2).length) {
  showInfo();
  program.help();
}

program.parse(process.argv);

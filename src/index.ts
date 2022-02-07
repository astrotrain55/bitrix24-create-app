#!/usr/bin/env node

import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import * as template from './utils/template';
import chalk from 'chalk';
import * as yargs from 'yargs';

const CHOICES = fs.readdirSync(path.join(__dirname, '..', 'templates'));

const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES,
    when: () => !yargs.argv['template']
  },
  {
    name: 'name',
    type: 'input',
    message: 'Project name:',
    when: () => !yargs.argv['name'],
    validate: (input: string) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  }
];

const CURR_DIR = process.cwd();

export interface TemplateConfig {
  files?: string[]
  postMessage?: string
}

export interface CliOptions {
  projectName: string
  templateName: string
  templatePath: string
  tartgetPath: string
  config: TemplateConfig
}

inquirer.prompt(QUESTIONS).then((response: Object) => {
  const answers = Object.assign({}, response, yargs.argv);
  const projectChoice = answers['template'];
  const projectName = answers['name'];
  const templatePath = path.join(__dirname, '..', 'templates', projectChoice);
  const tartgetPath = path.join(CURR_DIR, projectName);
  const templateConfig = getTemplateConfig(templatePath);

  const options: CliOptions = {
    projectName,
    templateName: projectChoice,
    templatePath,
    tartgetPath,
    config: templateConfig
  }

  if (!createProject(tartgetPath)) {
    return;
  }

  createDirectoryContents(templatePath, projectName, templateConfig);

  if (!postProcess(options)) {
    return;
  }

  showMessage(options);
});

function showMessage(options: CliOptions) {
  console.log('');
  console.log(chalk.green('Done.'));
  console.log(chalk.green(`Go into the project: cd ${options.projectName}`));

  const message = options.config.postMessage;

  if (message) {
    console.log('');
    console.log(chalk.yellow(message));
    console.log('');
  }

}

function getTemplateConfig(templatePath: string): TemplateConfig {
  const configPath = path.join(templatePath, '.template.json');

  if (!fs.existsSync(configPath)) return {};

  const templateConfigContent = fs.readFileSync(configPath);

  if (templateConfigContent) {
    return JSON.parse(templateConfigContent.toString());
  }

  return {};
}

function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
    return false;
  }

  fs.mkdirSync(projectPath);
  return true;
}

function postProcess(options: CliOptions) {
  if (isNode(options)) {
    return postProcessNode(options);
  }
  return true;
}

function isNode(options: CliOptions) {
  return fs.existsSync(path.join(options.templatePath, 'package.json'));
}

function postProcessNode(options: CliOptions) {
  shell.cd(options.tartgetPath);

  let cmd = '';

  if (shell.which('npm')) {
    cmd = 'npm i';
  }

  if (cmd) {
    const result = shell.exec(cmd);

    if (result.code !== 0) {
      return false;
    }
  } else {
    console.log(chalk.red('No npm found. Cannot run installation.'));
  }

  return true;
}

const SKIP_FILES = ['node_modules', '.template.json'];

function createDirectoryContents(templatePath: string, projectName: string, config: TemplateConfig) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);
    const stats = fs.statSync(origFilePath);

    if (SKIP_FILES.indexOf(file) > -1) return;

    if (stats.isFile()) {
      const writePath = path.join(CURR_DIR, projectName, file);
      const favicon = ['public', 'favicon.ico'].join(path.sep);
      const indexHtml = ['public', 'index.html'].join(path.sep);

      if (origFilePath.includes(favicon)) {
        fs.copyFileSync(origFilePath, writePath);
      } else if (origFilePath.includes('config.template')) {
        fs.copyFileSync(origFilePath, writePath.replace('config.template', '.gitignore'));
      } else {
        let contents = fs.readFileSync(origFilePath, 'utf8');

        if (!origFilePath.includes(indexHtml)) {
          contents = template.render(contents, { projectName });
        }

        fs.writeFileSync(writePath, contents, 'utf8');
      }
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(CURR_DIR, projectName, file));
      createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), config);
    }
  });
}

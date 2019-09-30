#!/usr/bin/env/ node
const inquirer = require('inquirer');
const fs = require('fs');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const currentDirectory = process.cwd();

const QUESTIONS = [
  {
    name: 'template-choice',
    type: 'list',
    message: 'What template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'template-name',
    type: 'input',
    message: 'template name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  }
];


inquirer.prompt(QUESTIONS)
  .then(answers => {
    const templateChoice = answers['template-choice'];
    const templateName = answers['template-name'];
    const templatePath = `${__dirname}/templates/${templateChoice}`;
    
    fs.mkdirSync(`${currentDirectory}/${templateName}`);

    createDirectoryContents(templatePath, templateName);
});

const createDirectoryContents = (templatePath, newTemplatePath) => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    
    const stats = fs.statSync(origFilePath);
    
    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');
   
      if (file === '.npmignore') file = '.gitignore';
      
      const writePath = `${currentDirectory}/${newTemplatePath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    }
  });
}
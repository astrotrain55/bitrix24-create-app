#!/usr/bin/env node
import { exec } from 'child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { cp, existsSync, readdirSync, statSync } from 'node:fs';
import { green, red } from 'kolorist';
import prompts from 'prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SKIP_FILES: string[] = ['node_modules', 'dist'];
const NG_POST_MESSAGE = 'Explore the Docs https://angular.dev/';
const VUE_POST_MESSAGE =
  'Vue’s official documentation provides you with all information you need to get started https://vuejs.org/';
const NG_REPO_EXAMPLE = 'bitrix24-stickerpack-app';
const VUE_REPO_EXAMPLE = 'bitrix24-pricing-app';

async function main() {
  const response = await prompts({
    type: 'select',
    name: 'action',
    message: 'What project template would you like to generate?',
    choices: [
      { title: 'Template', value: 'unpack' },
      { title: 'Repository', value: 'clone' },
    ],
  });

  if (response.action === 'unpack') {
    const folderPath = join(__dirname, 'templates');

    if (existsSync(folderPath)) {
      const folders = readdirSync(folderPath).filter((file) => {
        return statSync(join(folderPath, file)).isDirectory();
      });

      if (folders.length === 0) {
        console.info('There are no folders available for unpacking.');
        return;
      }

      const { selectedFolder } = await prompts({
        type: 'select',
        name: 'selectedFolder',
        message: 'Select a folder for unpacking:',
        choices: folders.map((folder) => {
          const title = folder.includes('ng') ? red(folder) : green(folder);
          return { title, value: folder };
        }),
      });
      const { projectName } = await prompts({
        type: 'text',
        name: 'projectName',
        message: 'Enter the name of the project:',
        initial: selectedFolder,
      });

      cp(
        join(folderPath, selectedFolder),
        projectName,
        {
          recursive: true,
          filter(source: string): boolean | Promise<boolean> {
            const isSkip = SKIP_FILES.some((name) =>
              source.startsWith(join(folderPath, selectedFolder, name)),
            );
            return !isSkip;
          },
        },
        (err: Error) => {
          if (err) {
            console.error('Unpacking error:', err);
            return;
          }

          console.info(
            'The folder has been successfully extracted to',
            projectName.includes('ng') ? red(projectName) : green(projectName),
          );
          console.info(
            selectedFolder.includes('ng') ? NG_POST_MESSAGE : VUE_POST_MESSAGE,
          );
        },
      );
    } else {
      console.error('No templates found.');
    }
  } else if (response.action === 'clone') {
    const { repo } = await prompts({
      type: 'select',
      name: 'repo',
      message: 'Enter the URL of the repository to clone:',
      choices: [
        {
          title: red(`${NG_REPO_EXAMPLE} (Angular example)`),
          value: NG_REPO_EXAMPLE,
        },
        {
          title: green(`${VUE_REPO_EXAMPLE} (Vue example)`),
          value: VUE_REPO_EXAMPLE,
        },
      ],
    });

    exec(
      `git clone git@github.com:astrotrain55/${repo}.git`,
      (err, stdout, stderr) => {
        if (err) {
          console.error('Cloning error:', stderr);
          return;
        }
        console.info(
          `The ${`https://github.com/astrotrain55/${repo}`} repository has been successfully cloned.`,
          stdout,
        );
      },
    );
  }
}

main().catch(console.error);

# map

## Overview
Contains the front-end code. The front-end consists of a collection of React components written in TypeScript and uses Vite and Tailwind CSS. 

## Structure
- **.storybook** - Storybook configuration.
- **.vscode** - VS Code debugging configuration.
- **html** - Static HTML resources related to the project.
- **src** - Component source code. 

##	Installation
- A **package.json** and **yarn.lock** file is provided to assist with installation of the necessary dependencies. 
- Within the **src/lib/** directory, rename the **config_.ts** file to **config.ts** and populate the variables contained within with values appropriate for your environment. Setting the `environment` variable within the **config.ts** file allows quick switching between different environments.
- Several build scripts are provided in the **package.json** file, notably:
- `yarn dev` - Runs the Vite dev server.
- `yarn build` - Builds the React app into a **dist** directory.
- `yarn build-library` - Builds UMD and ES component modules into a **dist** directory.

##	Notes
Storybook stories and Vitest tests have as yet been implemented for only a sub-set of components.

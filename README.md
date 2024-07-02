# wreck-free-foreshores

## Overview
This repository contains the components which make up the Wreck-Free Foreshores site. It consists of a database, API and front-end.

## Structure
- **api** - PHP API for the database.
- **database** - MySQL scripts to create the database schema and upload sample data.
- **map** - Graphical front-end which consumes endpoints presented by the API. Consists of React components written in TypeScript using Vite and Tailwind CSS.
- **reset** - PHP script to provide user password reset functionality.

##	Installation
The suggested order of implementation is 1. database; 2. api, 3. map, 4. reset. See the README files within each directory for further information.

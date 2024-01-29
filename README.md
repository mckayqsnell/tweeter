# Tweeter-Web

A starter project for the Tweeter Web application.

## Setting Up the Project

1. cd into the tweeter-shared folder
1. Run 'npm install'
1. run 'npm run build'
1. cd into the tweeter-web folder
1. Run 'npm install'
1. Run 'npm run build'

**Note:** VS Code seems to have a bug. After doing this, you should be able to run the project but code editors report that they can't see the 'tweeter-shared' module. Restarting VS Code fixes the problem. You will likely need to restart VS Code every time you compile or build the 'tweeter-shared' module.

**Note:** If you are using Windows, make sure to use a Git Bash terminal instead of Windows Powershell. Otherwise, the scripts won't run properly in tweeter-shared and it will cause errors when building tweeter-web.

## Rebuilding the Project

Rebuild either module of the project (tweeter-shared or tweeter-web) by running 'npm run build' after making any code or configuration changes in the module. The 'tweeter-web' module is dependent on 'tweeter-shared', so if you change 'tweeter-shared' you will also need to rebuild 'tweeter-web'. After rebuilding 'tweeter-shared' you will likely need to restart VS Code (see note above under 'Setting Up the Project').

## Running the Project

Run the project by running 'npm start' from within the 'tweeter-web' folder.

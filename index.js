const readline = require('readline');
const { spawn } = require("child_process");
const fs = require('fs');
const { QUERY, TARGET_FOLDER, INVALID_OPTION, INFO, EXIT_INFO, EXECUTEING_DOCKER_FILES } = require('./constants.js');

const getDockerComposeList = (folder) => {
    const dockerComposeFilesList = [];
    fs.readdirSync(folder).forEach(file => dockerComposeFilesList.push(file));
    return dockerComposeFilesList;
};
const readUserInput = (query) => {
    const readLineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => readLineInterface.question(query, input => {
        readLineInterface.close();
        resolve(input);
    }))
}

async function main() {
    console.log(INFO);

    const dockerComposeFilesList = getDockerComposeList(TARGET_FOLDER);
    dockerComposeFilesList.forEach((file, i) => {
        console.log(`${i + 1}. ${file}`);
    });

    const option = await readUserInput(QUERY);

    if (option.toLowerCase() === 'q' || option.toLowerCase() === 'exit') {
        console.log(EXIT_INFO);
        process.exit(0);
    }
    if (option < 1 || option > dockerComposeFilesList.length || isNaN(+option)) {
        console.log(INVALID_OPTION);
    }

    console.log(EXECUTEING_DOCKER_FILES);

    const fileArg = `${TARGET_FOLDER}/${dockerComposeFilesList[option - 1]}`;
    const dockerComposeSpwan = spawn('docker-compose', ['-f', fileArg, 'up'], {
        cwd: process.cwd(),
        detached: true,
        stdio: 'inherit'
    });
    dockerComposeSpwan.unref();
}

main();
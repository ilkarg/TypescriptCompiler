const { exec } = require("child_process");
const { errorMonitor } = require("events");
const fs = require('fs');

function main() {
    let tsFiles = [];
    let status;

    if (process.argv.length <= 2) {
        console.log('Example: node compiler.js <path_to_ts_dir> <path_to_js_dir>');
        return;
    }

    if (!isset(process.argv[2]) || !isset(process.argv[3])) {
        console.log('Example: node compiler.js <path_to_ts_dir> <path_to_js_dir>');
        return;
    }
    
    if (!fs.existsSync(process.argv[2]) || !fs.existsSync(process.argv[3])) {
        console.log('Error: directory (directories) not exists');
        return;
    }

    fs.readdirSync(process.argv[2]).forEach(function(file) {
        if (file.endsWith('.ts'))
            tsFiles.push(file);
    });

    if (tsFiles.length > 0)
        status = compile(process.argv[3], process.argv[2], tsFiles);
    else
        console.log('Не выбрано файлов для компиляции');

    if (status)
        console.log('Compilation successful!');
}

function isset(arg) {
    return arg != null && arg != 'undefined' && arg.trim() != '';
}

function compile(jsDir, tsDir, tsFiles) {
    try {
        command = 'npx tsc ';
        for (let i = 0; i < tsFiles.length; i++) {
            command += tsDir == './' ? tsFiles[i] : tsDir + '/' + tsFiles[i];
            command += jsDir == './' ? '' : ' --outDir ' + jsDir;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    if (error.message.trim() != '')
                        console.log(`error: ${error.message}`);
                    return false;
                }
                if (stderr) {
                    if (stderr.trim() != '')
                        console.log(`stderr: ${stderr}`);
                    return false;
                }

                if (stdout.trim() != '')
                    console.log(`stdout: ${stdout}`);
            });
        }
    } catch (err) {
        console.log(`Error try/catch: ${err.message}`);
        return false;
    }

    return true;
}

main();
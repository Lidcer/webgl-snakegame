const fs = require('fs');
const path = require('path');
const shaderDirectory = path.join(__dirname, '..' , 'src', 'shaders');
const generatedShaderDirectory = path.join(__dirname, '..' , 'src', 'generated', 'shaders.ts');

const shouldWatchFiles = process.argv.includes('-w') || process.argv.includes('-watch');  

if (shouldWatchFiles) {
    console.log('Watching shader file');
}

const shader = new Map()

async function generate(){
    const filesName = await readDirectory(shaderDirectory) 
    let generatedShaderFile = '//Generated file\n'
    let shouldWrite = false; 
    for (const fileName of filesName){
        const shaderName = fileName.split('.')[0]; 
        const text = await readFile(path.join(__dirname, '..' , 'src', 'shaders', fileName));
        if(shader.get(fileName) === undefined || shader.get(fileName) !== text) {
            shouldWrite = true;
        }
        shader.set(fileName, text);
        const combiner = `\nexport const ${shaderName} = \`\n${text}\`;\n`;
        generatedShaderFile += combiner;
    }
    if (shouldWrite) {
        console.info('Compiling shaders...');
        await writeFile(generatedShaderDirectory, generatedShaderFile);
        console.info('Done');
    }
}

function watch() { 
    setTimeout(async () => {
        await generate();
        watch();
    });
}


function readDirectory(path){
    return new Promise((resolve, reject) => {
        fs.readdir(path, 'utf-8', (err, files) => {
            if(err) return reject(new Error(err))
            resolve(files);
        })
    });
}

function readFile(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if(err) return reject(new Error(err))
            resolve(data);
        })
    });
}

function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if(err) return reject(new Error(err))
            resolve();
        })
    });
}



if (shouldWatchFiles) {
    watch();
} else {
    generate();
}
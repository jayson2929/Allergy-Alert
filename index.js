
const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')
const rootPath = path.normalize(`${__dirname}`).replace(" ", "\\ ")

const runPromisifiedCommand = async (cmd, showLog = true) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if(err) reject(err)
            else {
                const rst = stdout ? stdout : stderr
                if(showLog) console.log(rst)
                resolve(rst)
            }
        })
    })
}
console.log("Starting SQLITE Database Server...")
runPromisifiedCommand(`node ${rootPath}/data/DataServer.js`)
console.log("Starting React Application Server. ")
fs.unlinkSync("./tsconfig.json")
runPromisifiedCommand(`react-scripts start`)
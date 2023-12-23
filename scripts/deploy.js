// eslint-disable-next-line security/detect-child-process
var exec = require('child_process').exec;
require('dotenv').config();
exec(
  `scp -r -O app-linux ${process.env.SERVER_USER}@${process.env.SERVER_IP}:${process.env.SERVER_DIST}`,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  },
);

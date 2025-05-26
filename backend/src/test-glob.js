const glob = require('glob');
const path = require('path');

const userPath = path.join(__dirname, '..', 'users', 'bittubadmash_324af196-9c83-4599-b773-76f5e255705c');
const searchPath = path.join(userPath, '.terragrunt-cache', '**', 'terraform.tfstate').replace(/\\/g, '/');
console.log('Searching for:', searchPath);
const matches = glob.sync(searchPath, { dot: true });
console.log('Found matches:', matches);

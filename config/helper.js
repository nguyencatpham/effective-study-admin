var path = require('path');

const EVENT =process.env.npm_lifecycle_event || ''
const ROOT = path.resolve(__dirname, '..')

module.exports = {
    root:path.join.bind(path, ROOT),
    hasProcessFlag: (flag)=>{
        return process.argv.join('').indexOf(flag) > -1;
    },
    hasNpmFlag: (flag)=>{
        return EVENT.includes(flag);
    },
    isWebpackDevServer: ()=>{
        return process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1]));
    },
    getProfile:()=>{
        let profile = 'development';
        const argvs = process.argv.splice(2);
        if (argvs.filter((e) => {
            return /^--env\.profile/.test(e);
          }).length) {
          // get argument --env.profile value
          profile = argvs.filter((e) => {
            return /^--env\.profile/.test(e);
          })[0].split('=')[1];
        }
      
        return profile;
      }
}
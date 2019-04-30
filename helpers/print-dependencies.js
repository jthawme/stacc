const fs = require('fs')
const wipeDependencies = () => {
  const file  = fs.readFileSync('package.json')
  const content = JSON.parse(file)

  fs.copyFileSync('package.json', 'package.tmp.json');

  console.log(`npm install --save-dev ${Object.keys(content.devDependencies).join(' ')}`);
  console.log(`npm install --save ${Object.keys(content.dependencies).join(' ')}`);

  content.devDependencies = {};
  content.dependencies = {};

  fs.writeFileSync('package.json', JSON.stringify(content))
}
if (require.main === module) {
  wipeDependencies()
} else {
  module.exports = wipeDependencies
}
const fs = require('fs');
const file = 'src/pages/Reports.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\\\`/g, '`');
content = content.replace(/\\\$\{/g, '${');
fs.writeFileSync(file, content);
console.log('Fixed Reports.jsx');

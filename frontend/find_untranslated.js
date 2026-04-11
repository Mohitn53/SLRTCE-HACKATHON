const fs = require('fs');

function findJsx(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = dir + '/' + file;
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) results = results.concat(findJsx(filePath));
      else if (file.endsWith('.jsx')) results.push(filePath);
    });
  } catch (e) {
  }
  return results;
}

const files = findJsx('src');
let untranslated = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('<Text') && !content.includes('useLanguage')) {
    untranslated.push(f);
  }
});
console.log('Un-translated JSX files:\n', untranslated.join('\n'));

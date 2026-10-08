// Validates all questions have the right shape
const fs = require('fs');
const code = fs.readFileSync('data/files.js', 'utf8').replace('const Files =', 'global.Files =');
eval(code);

let errors = 0;
let warnings = 0;

global.Files.forEach(f => {
  if (!f.id || !f.title || !f.description) {
    console.error(`❌ File ${f.id} missing required fields`);
    errors++;
  }
  if (f.lessons.length !== 3) {
    console.warn(`⚠️  File ${f.id} has ${f.lessons.length} lessons, expected 3`);
    warnings++;
  }
  f.lessons.forEach(l => {
    if (!['A', 'B', 'C'].includes(l.letter)) {
      console.error(`❌ File ${f.id} lesson ${l.letter}: invalid letter`);
      errors++;
    }
    ['grammar', 'vocabulary', 'mixed'].forEach(section => {
      const items = l[section] || [];
      if (!Array.isArray(items)) {
        console.error(`❌ File ${f.id} lesson ${l.letter} ${section}: not an array`);
        errors++;
        return;
      }
      items.forEach((q, i) => {
        if (!q.type) {
          console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: missing type`);
          errors++;
          return;
        }
        if (!q.prompt) {
          console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: missing prompt`);
          errors++;
        }
        if (q.type === 'mc') {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: mc needs >=2 options`);
            errors++;
          }
          if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options?.length) {
            console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: mc answer invalid`);
            errors++;
          }
        } else if (q.type === 'fill') {
          if (q.answer === undefined) {
            console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: fill needs answer`);
            errors++;
          }
        } else if (q.type === 'reorder') {
          if (!Array.isArray(q.words) || q.words.length < 2) {
            console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: reorder needs words array`);
            errors++;
          }
        } else if (q.type === 'match') {
          if (!Array.isArray(q.pairs) || q.pairs.length < 2) {
            console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: match needs pairs array`);
            errors++;
          }
        } else if (q.type === 'tf') {
          if (typeof q.answer !== 'boolean') {
            console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: tf needs boolean answer`);
            errors++;
          }
        } else {
          console.error(`❌ File ${f.id} lesson ${l.letter} ${section}[${i}]: unknown type ${q.type}`);
          errors++;
        }
      });
    });
  });
});

const total = global.Files.reduce((s,f) => s + f.lessons.reduce((ss,l) => ss + l.grammar.length + l.vocabulary.length + l.mixed.length, 0), 0);
const totalLessons = global.Files.reduce((s,f) => s + f.lessons.length, 0);

console.log('\n========================================');
console.log('Validation Summary');
console.log('========================================');
console.log('Files:', global.Files.length);
console.log('Lessons:', totalLessons);
console.log('Total questions:', total);
console.log('Errors:', errors);
console.log('Warnings:', warnings);
if (errors > 0) process.exit(1);
console.log('✅ All checks passed');

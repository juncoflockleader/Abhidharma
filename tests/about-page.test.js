const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');

assert.match(html, /data-tab-id="about"[^>]*>关于与致谢</);
assert.match(html, /class="about-workspace"/);
assert.match(html, /从一无所知，到尝试把所学整理成图/);
assert.match(html, /佛陀/);
assert.match(html, /罗庆龙老师/);
assert.match(html, /智藏尊者/);
assert.match(html, /UKassapa 尊者/);
assert.match(html, /DEDICATION OF MERIT/);
assert.match(html, /github\.com\/juncoflockleader\/Abhidharma/);
assert.doesNotMatch(html, /my-words-svg/);
assert.doesNotMatch(html, /js\/mywords\.js/);
assert.doesNotMatch(html, /52缘溯源没有加入色法内容/);

console.log('about-page: responsive acknowledgements and updated project status verified');

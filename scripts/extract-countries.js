const fs = require('fs')
const p = 'D:/Projects/HelpDesk/HelpDesk/database/seeders/CountrySeeder.php'
const s = fs.readFileSync(p, 'utf8')
const re = /\['name'\s*=>\s*'((?:\\'|[^'])*)'\s*,\s*'code'\s*=>\s*'([A-Z]{2})'\]/g
const out = []
let m
while ((m = re.exec(s))) {
  out.push({ name: m[1].replace(/\\'/g, "'"), code: m[2] })
}
console.log('countries', out.length)
fs.mkdirSync('prisma/seed-data', { recursive: true })
fs.writeFileSync('prisma/seed-data/countries.json', JSON.stringify(out, null, 2))

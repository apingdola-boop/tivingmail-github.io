const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'logo.svg');
const pngPath = path.join(__dirname, 'public', 'logo.png');

const svgBuffer = fs.readFileSync(svgPath);

sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✅ PNG 로고 생성 완료: public/logo.png');
  })
  .catch(err => {
    console.error('❌ 변환 실패:', err);
  });








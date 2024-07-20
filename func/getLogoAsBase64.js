const fs = require('fs');
const path = require('path')

const getLogoAsBase64 = async (address) => {
    const projectRoot = process.cwd();
    const imagePath = path.join(projectRoot, address);
    const imageData = await fs.promises.readFile(imagePath, 'base64');
    return `data:image/${address.split('.').pop()};base64,${imageData}`;
}

const getLogoAsBase64Directly = async (address) => {
    const projectRoot = process.cwd();
    const imagePath = path.join(projectRoot, address);
    const imageData = await fs.promises.readFile(imagePath, 'base64');
    return `data:image/${address.split('.').pop()};base64,${imageData}`;
}

module.exports = { getLogoAsBase64, getLogoAsBase64Directly }
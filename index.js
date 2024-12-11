const { jsPDF } = require('jspdf')
const fabric = require('fabric').fabric
const json = require('./data/demo.json')
const path = require('path')
const fs = require('fs')
const { width, height } = json.clipPath
const doc = new jsPDF('p', 'px', [width, height])

// 注册字体
const font = fs.readFileSync('./fonts/Alimama_ShuHei_Bold.ttf', 'base64')
doc.addFileToVFS('Alimama_ShuHei_Bold.tff', font)
doc.addFont('Alimama_ShuHei_Bold.tff', 'Alimama_ShuHei_Bold', 'normal')
doc.addFont('Alimama_ShuHei_Bold.tff', 'Alimama_ShuHei_Bold', 'bold')
doc.addFont('Alimama_ShuHei_Bold.tff', 'Alimama_ShuHei_Bold', 'italic')

// 创建画布
const canvas = new fabric.StaticCanvas(null, { width, height })
fabric.nodeCanvas.registerFont('./fonts/Alimama_ShuHei_Bold.ttf', {
    family: 'Alimama_ShuHei_Bold'
})

canvas.loadFromJSON(json, async (err) => {
    const objects = canvas.getObjects()
    for (let index = 0; index < objects.length; index++) {
        const object = objects[index];
        if (['i-text', 'textbox'].includes(object.type)) {
            object.fontFamily = 'Alimama_ShuHei_Bold'
            const { fontStyle, fontFamily, fontWeight, fill, text, textAlign, width, charSpacing, lineHeight, angle, scaleX, scaleY } = object
            const scaledFontSize = object.fontSize * ((object.scaleX + object.scaleY) / 2);
            const lineHeights = object.__lineHeights
            const lineWidths = object.__lineWidths
            doc.setFont(fontFamily, fontStyle, fontWeight)
            doc.setFontSize(scaledFontSize)
            doc.setTextColor(fill)
            const textLines = object.textLines
            let curY = 0
            for (let index = 0; index < textLines.length; index++) {
                const text = textLines[index];
                curY += lineHeights[index]
                doc.text(text, object.left, object.top + curY, {
                    align: 'justify', // 相当于字符间距
                    maxWidth: lineWidths[index],
                    lineHeightFactor: lineHeight,
                    angle: angle,
                    horizontalScale: scaleY / scaleX
                })
            }


            doc.save('./files/test.pdf')

        }
    }
})
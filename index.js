const IMAGE_WIDTH=800
const IMAGE_HEIGHT=600

const fs = require('fs')
const {createCanvas, toBuffer, loadImage} = require('canvas')

const loadImagePath = process.argv[2]
const outputImagePath = process.argv[3]
const rekognitionJsonParam = process.argv[4]

const draw = async (loadImagePath, outputImagePath, rekognitionJsonParam) => {
    const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT)
    const context = canvas.getContext('2d')
    const image = await loadImage(loadImagePath)
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'red'
    context.lineWidth = 3
    
    
    const instances = JSON.parse(rekognitionJsonParam).Instances
   
    instances.forEach ((instance) => {
	const box = instance.BoundingBox
	const boxLeft   = Math.floor(box.Left * IMAGE_WIDTH)
	const boxTop    = Math.floor(box.Top  * IMAGE_HEIGHT)
	const boxWidth  = Math.floor(box.Width * IMAGE_WIDTH)
	const boxHeight = Math.floor(box.Height * IMAGE_HEIGHT)
	
	context.beginPath();
	context.moveTo(boxLeft,            boxTop);             // left top
	context.lineTo(boxLeft + boxWidth, boxTop);             // right top
	context.lineTo(boxLeft + boxWidth, boxTop + boxHeight); // right bottom
	context.lineTo(boxLeft,            boxTop + boxHeight); // left bottom
	context.lineTo(boxLeft,            boxTop);             // to left top
	context.stroke();
    })
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 })
    fs.writeFileSync(outputImagePath, buffer)   
}

draw(loadImagePath, outputImagePath, rekognitionJsonParam)

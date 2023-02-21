const IMAGE_WIDTH=800
const IMAGE_HEIGHT=600

const fs = require('fs')
const { createCanvas, toBuffer, loadImage} = require('canvas')

// ロードする画像の場所 S3に入れた画像を同じのを指定
// S3から取ってきてもよかったけど面倒だったと供述しており（ｒｙ
const loadImagePath = process.argv[2]

// 画像を保存するパス
const outputImagePath = process.argv[3]

// rekognition した時の結果
// ネコの部分の結果だけ取ってきて渡す感じ
// シェルスクリプト側参照
const rekognitionJsonParam = process.argv[4]

const draw = async (loadImagePath, outputImagePath, rekognitionJsonParam) => {
    const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT)
    const context = canvas.getContext('2d')
    const image = await loadImage(loadImagePath)
    const cat = await loadImage('frame/neko8.svg')

    // https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // いわゆる乗算
    context.globalCompositeOperation = 'multiply'
    context.imageSmoothingEnabled = true

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    const instances = JSON.parse(rekognitionJsonParam).Instances
   
    // どのへんに画像を乗っけるかはよしなに調整
    instances.forEach ((instance) => {
	const box = instance.BoundingBox

	var boxLeft   = Math.floor(box.Left * IMAGE_WIDTH)
	var boxTop    = Math.floor(box.Top  * IMAGE_HEIGHT)
	var boxWidth  = Math.floor(box.Width * IMAGE_WIDTH)
	var boxHeight = Math.floor(box.Height * IMAGE_HEIGHT)

	const param = 0.2

	// 横長の場合は気持ち縦を増やす
	//console.log(boxWidth/ boxHeight)
	if ( boxWidth/ boxHeight > 1.3) {
	    boxTop = boxTop - (boxHeight * 0.1)
	    boxHeight = boxHeight * 1.2
	}

	// 縦長の場合は気持ち横を増やす
	console.log(boxHeight/boxWidth)
	if ( boxHeight/boxWidth > 1.5) {
	    boxLeft = boxLeft - (boxWidth * 0.25)
	    boxWidth = boxWidth * 1.5
	}
	
	context.drawImage(
	    cat,
	    Math.floor(boxLeft - (boxWidth * (param/2))),
	    Math.floor(boxTop - (boxHeight * param)),
	    Math.floor(boxWidth * ( 1 + param)),
	    Math.floor(boxHeight * ( 1 + param))
	)
    })
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 })
    fs.writeFileSync(outputImagePath, buffer)   
}

draw(loadImagePath, outputImagePath, rekognitionJsonParam)

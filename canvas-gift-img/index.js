var selectEle = document.getElementById('select')
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var cardEle = document.getElementById('card')
var ranBtn = document.getElementById('random')
var fullBtn = document.getElementById('full')

var canvasInfo = {}
var isEnabled = false
var image = null
var ranCached = {}
var animation = null

// 显示半径
var displayR = 30;

// 显示速度
var speed = 30



function init() {
    bindEvent()
}

function bindEvent() {
    selectEle.addEventListener('change', function (e) {
        var files = e.target.files;
        var file = files[0];
        var fileReader = new FileReader()

        resetParam()

        fileReader.readAsDataURL(file)

        fileReader.onload = function (e) {
            image = new Image()
            var res = e.target.result;
            if (image.compelete) {
                console.log('compelete')
            }
            image.onload = function () {
                console.log('ONLOAD')
                randomDraw(image)
            }
            image.setAttribute('src', res)
            cardEle.style['background-image'] = "url('" + res + "')"
        }
    })
    ranBtn.addEventListener('click', function () {
        if (image) {
            randomDraw(image)
        }
    })
    fullBtn.addEventListener('click', function () {
        if (image) {
            displayFull(image)
        }
    })
}

function resetParam() {
    displayR = 30
    speed = 30
}

function randomDraw(img) {
    var ranX = Math.random() * canvas.width
    var ranY = Math.random() * canvas.height
    ranX = ranX < displayR ? displayR : (ranX > canvas.width - displayR) ? canvas.width - displayR : ranX
    ranY = ranY < displayR ? displayR : (ranY > canvas.height - displayR) ? canvas.height - displayR : ranY

    ranCached.x = ranX
    ranCached.y = ranY

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.beginPath()
    ctx.arc(ranX, ranY, displayR, 0, Math.PI * 2)
    ctx.strokeStyle = "#bbb"
    ctx.stroke()
    ctx.clip()
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.restore()
}

function easeOutQuad(pos) {
    return -(Math.pow((pos - 1), 2) - 1);
}

function displayFull(img) {
    var max = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2))
    if (displayR > max) {
        cancelAnimationFrame(animation)
        return;
    }
    speed = speed * 0.98
    speed = speed < 1 ? 1 : speed
    displayR += speed
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.beginPath()
    ctx.arc(ranCached.x, ranCached.y, displayR, 0, Math.PI * 2)
    ctx.strokeStyle = "#bbb"
    ctx.stroke()
    ctx.clip()
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.restore()

    animation = requestAnimationFrame(function () {
        displayFull(img)
    })
}

init()
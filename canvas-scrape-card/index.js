var selectEle = document.getElementById('select')
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var cardEle = document.getElementById('card')
var canvasInfo = {}
var isEnabled = false

// 擦除画笔半径
var penR = 10

function init() {
    getCanvasInfo()
    bindEvent()
}

function bindEvent() {
    var xBefore, yBefore;
    selectEle.addEventListener('change', function (e) {
        var files = e.target.files;
        var file = files[0];
        var fileReader = new FileReader()

        fileReader.readAsDataURL(file)

        fileReader.onload = function (e) {
            var res = e.target.result;
            cardEle.style['background-image'] = "url('" + res + "')"
            drawCover()
        }
    })

    canvas.addEventListener('mousedown', function (e) {
        console.log('down')
        isEnabled = true
        var pageX = e.pageX;
        var pageY = e.pageY;
        var x = pageX - canvasInfo.left;
        var y = pageY - canvasInfo.top;
        ctx.moveTo(x, y)
    })

    canvas.addEventListener('mousemove', function (e) {
        if (!isEnabled) {
            return
        }
        var pageX = e.pageX;
        var pageY = e.pageY;
        var xAfter = pageX - canvasInfo.left;
        var yAfter = pageY - canvasInfo.top;

        ctx.save()
        ctx.beginPath()
        ctx.arc(xAfter, yAfter, penR, 0, Math.PI * 2)
        ctx.clip()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore()

        if (xBefore || yBefore) {
            console.log(xBefore, yBefore)
            var deg = Math.atan((yAfter - yBefore) / (xAfter - xBefore))
            var deltaX = penR * Math.sin(deg)
            var deltaY = penR * Math.cos(deg)
            var x1 = xBefore + deltaX
            var y1 = yBefore - deltaY
            var x2 = xBefore - deltaX
            var y2 = yBefore + deltaY
            var x3 = xAfter - deltaX
            var y3 = yAfter + deltaY
            var x4 = xAfter + deltaY
            var y4 = yAfter - deltaY
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.lineTo(x3, y3)
            ctx.lineTo(x4, y4)
            ctx.closePath()
            ctx.clip()
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.restore()
        }

        xBefore = xAfter;
        yBefore = yAfter;
    })

    canvas.addEventListener('mouseup', function () {
        isEnabled = false
        xBefore = undefined
        yBefore = undefined
    })

    document.addEventListener('mouseup', function () {
        isEnabled = false
        xBefore = undefined
        yBefore = undefined
    })

}

function getCanvasInfo() {
    canvasInfo = canvas.getBoundingClientRect()
    console.log(canvasInfo)
}

function drawCover() {
    ctx.fillStyle = "#333"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}



init()
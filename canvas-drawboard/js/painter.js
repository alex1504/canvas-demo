;
(function () {

    function Painter(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }

    Painter.prototype.setArea = function (width, height) {
        this.canvas.width = width
        this.canvas.height = height
    }

    Painter.prototype.circle = function (param) {
        this.ctx.beginPath()
        this.ctx.arc(param.shape.x, param.shape.y, param.shape.r, 0, Math.PI * 2)
        this.ctx.fillStyle = param.style.fill
        this.ctx.fill()
    }

    Painter.prototype.square = function (param) {
        this.ctx.beginPath()
        this.ctx.rect(param.shape.x, param.shape.y, param.shape.w, param.shape.h)
        this.ctx.fillStyle = param.style.fill
        this.ctx.fill()
    }

    Painter.prototype.line = function (param) {
        this.ctx.beginPath()
        this.ctx.moveTo(param.shape.x1, param.shape.y1)
        this.ctx.lineTo(param.shape.x2, param.shape.y2)
        this.ctx.strokeStyle = param.style.stroke
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
        this.ctx.lineWidth = 10
        this.ctx.stroke()
        this.ctx.closePath()
    }

    Painter.prototype.curve = function (param) {
        var x1 = param.shape.x1
        var x2 = param.shape.x2
        var y1 = param.shape.y1
        var y2 = param.shape.y2
        /*  var theta = Math.atan(y2 - y1 / x2 - x1)
         var deltaX = 10 / 2 * Math.sin(theta)
         var deltaY = 10 / 2 * Math.cos(theta) */

        // 补间方形坐标
        /*  var x3 = x1 + deltaX
         var y3 = y1 - deltaY
         var x4 = x1 - deltaX
         var y4 = y1 + deltaY
         var x5 = x2 + deltaX
         var y5 = y2 - deltaY
         var x6 = x2 - deltaX
         var y6 = y2 + deltaY */

        this.ctx.beginPath()
        this.ctx.moveTo(param.shape.x1, param.shape.y1)
        this.ctx.lineTo(param.shape.x2, param.shape.y2)
        this.ctx.closePath()
        this.ctx.strokeStyle = param.style.stroke
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
        this.ctx.lineWidth = 10
        this.ctx.stroke()
        /*  
         this.ctx.beginPath()
         this.ctx.moveTo(x3, y3)
         this.ctx.lineTo(x4, y4)
         this.ctx.lineTo(x5, y5)
         this.ctx.lineTo(x6, y6)
         this.ctx.closePath()
         this.ctx.fillStyle = param.style.fill
         this.ctx.fill() */
    }

    Painter.prototype.erase = function (param) {
        this.ctx.beginPath()
        this.ctx.arc(param.shape.x, param.shape.y, param.shape.r, 0, Math.PI * 2)
        this.ctx.fillStyle = param.style.fill
        this.ctx.fill()
    }

    Painter.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = Painter;
    } else if (typeof define === "function" && define.amd) {
        define("Painter", [], function () {
            return Painter;
        });
    } else {
        window.Painter = Painter
    }

})()
var drawboard = (function () {
    var canvas = document.getElementById("canvas")
    var paletteEle = document.getElementById("palette")
    var painter = new Painter(canvas)
    var btnEles = document.querySelectorAll(".j-action")
    var coverEle = document.getElementById("cover")
    var prvImgEle = document.getElementById("prv-img")
    var closeEle = document.getElementById('close')
    var on = false
    var paintData = []
    var color;
    var stepFlag = 0
    var lastPen = 'circle'

    function setArea() {
        var width = window.innerWidth
        var height = window.innerHeight
        painter.setArea(width, height)
    }

    function bindEvent() {
        drawCircle()
        btnEles.forEach(function (btn) {
            btn
                .addEventListener('click', function (e) {
                    var action = e
                        .target
                        .getAttribute('data-action')

                    if (action !== "back" && action !== "refresh") {
                        btnEles.forEach(function (btn) {
                            btn
                                .classList
                                .remove('z-active')
                        })
                        btn
                            .classList
                            .add('z-active')
                    }

                    switch (action) {
                        case 'circle':
                            drawCircle();
                            lastPen = 'circle'
                            break;
                        case 'square':
                            drawSquare();
                            lastPen = 'square'
                            break;
                        case 'line':
                            drawLine();
                            lastPen = 'line'
                            break;
                        case 'pencil':
                            drawCurve();
                            lastPen = 'pencil'
                            break;
                        case 'eraser':
                            drawErase();
                            lastPen = 'eraser'
                            break;
                        case 'back':
                            stepBack();
                            break;
                        case 'refresh':
                            refresh();
                            break;
                        case 'picture':
                            renderImage();
                            removeEvent();
                            break;
                        case 'save':
                            saveImage();
                            removeEvent();
                            break;
                    }

                })
        })

        closeEle.onclick = function () {
            coverEle.classList.remove('z-active')
            resetPen()
        }


    }

    function removeEvent() {
        canvas.onmousedown = null;
        canvas.onmousemove = null;
        canvas.onmouseup = null;
    }

    function resetPen() {
        btnEles.forEach(function (btn) {
            var action = btn.getAttribute('data-action')
            if (action === lastPen) {
                btn
                    .classList
                    .add('z-active')
            } else {
                btn
                    .classList
                    .remove('z-active')
            }

        })
    }

    function drawCircle() {
        canvas.onmousedown = function (e) {
            var x1,
                y1,
                x2,
                y2,
                r,
                x3,
                y3,
                len;

            on = true
            x1 = e.pageX;
            y1 = e.pageY;
            r = 0;
            len = paintData.length

            canvas.onmousemove = function (e) {
                if (!on) {
                    return
                }

                x2 = e.pageX
                y2 = e.pageY
                x3 = x1 + (x2 - x1) / 2
                y3 = y1 + (y2 - y1) / 2
                r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2

                paintData[len] = {}
                paintData[len].type = 'circle'
                paintData[len].x = x3
                paintData[len].y = y3
                paintData[len].r = r
                paintData[len].color = color

                render()
            }
            canvas.onmouseup = function (e) {
                on = false
                console.log(paintData)
            }
        }
    }

    function drawSquare() {
        canvas.onmousedown = function (e) {
            var x1,
                y1,
                x2,
                y2,
                len;

            on = true
            x1 = e.pageX;
            y1 = e.pageY;
            len = paintData.length

            canvas.onmousemove = function (e) {
                console.log('move')
                if (!on) {
                    return
                }

                x2 = e.pageX
                y2 = e.pageY

                paintData[len] = {}
                paintData[len].type = 'square'
                paintData[len].x = x1
                paintData[len].y = y1
                paintData[len].w = x2 - x1
                paintData[len].h = y2 - y1
                paintData[len].color = color

                render()
            }
            canvas.onmouseup = function (e) {
                on = false
            }
        }
    }

    function drawLine() {
        canvas.onmousedown = function (e) {
            var x1,
                y1,
                x2,
                y2,
                len;

            on = true
            x1 = e.pageX;
            y1 = e.pageY;
            len = paintData.length

            canvas.onmousemove = function (e) {
                console.log('move')
                if (!on) {
                    return
                }

                x2 = e.pageX
                y2 = e.pageY

                paintData[len] = {}
                paintData[len].type = 'line'
                paintData[len].x1 = x1
                paintData[len].y1 = y1
                paintData[len].x2 = x2
                paintData[len].y2 = y2
                paintData[len].color = color

                render()
            }
            canvas.onmouseup = function (e) {
                on = false
            }
        }
    }

    function drawCurve() {
        canvas.onmousedown = function (e) {
            var x1,
                y1,
                x2,
                y2,
                len, on;

            on = true
            x1 = e.pageX;
            y1 = e.pageY;

            canvas.onmousemove = function (e) {
                if (!on) {
                    return
                }

                on = false

                setTimeout(() => {
                    on = true
                }, 60);

                len = paintData.length
                x2 = e.pageX
                y2 = e.pageY

                paintData[len] = {}
                paintData[len].type = 'curve'
                paintData[len].x1 = x1
                paintData[len].y1 = y1
                paintData[len].x2 = x2
                paintData[len].y2 = y2
                paintData[len].color = color
                paintData[len].stepFlag = stepFlag

                painter.curve({
                    shape: {
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2
                    },
                    style: {
                        stroke: color
                    }
                })
                x1 = x2
                y1 = y2
            }
            canvas.onmouseup = function (e) {
                canvas.onmousemove = null
                stepFlag++
            }
        }
    }

    function drawErase() {
        canvas.onmousedown = function (e) {
            var x,
                y,
                len, on;

            on = true
            canvas.onmousemove = function (e) {
                if (!on) {
                    return
                }

                on = false

                setTimeout(() => {
                    on = true
                }, 60);

                len = paintData.length
                x = e.pageX
                y = e.pageY

                paintData[len] = {}
                paintData[len].type = 'eraser'
                paintData[len].x = x
                paintData[len].y = y
                paintData[len].r = 10
                paintData[len].color = "#f8f8f8"
                paintData[len].stepFlag = stepFlag

                render()
            }
            canvas.onmouseup = function (e) {
                canvas.onmousemove = null
                stepFlag++
            }
        }
    }

    function stepBack() {
        if (!paintData.length) {
            return;
        }
        var index = paintData.length - 1
        var lastItemType = paintData[index].type
        var lastItemStepFlag = paintData[index].stepFlag

        if (lastItemType === "curve" || lastItemType === "eraser") {
            while (index >= 0) {
                var stepFlag = paintData[index].stepFlag
                if (lastItemStepFlag === stepFlag) {
                    paintData.pop()
                } else {
                    break
                }
                index--
            }
        } else {
            paintData.pop()
        }

        render()
    }

    function refresh() {
        paintData = []
        painter.clear()
        canvas.onmousedown = null
        canvas.onmousemove = null
        canvas.onmouseup = null
    }

    function renderImage() {
        if (!paintData.length) {
            alert("当前画布为空")
            resetPen()
            return
        }

        var data = canvas.toDataURL()

        prvImgEle.src = data
        coverEle.classList.add('z-active')
    }

    function saveImage() {
        if (!paintData.length) {
            alert("当前画布为空")
            resetPen()
            return
        }
        var aEle = document.createElement('a')
        var data = prvImgEle.getAttribute('src')
        var fileName = new Date().toLocaleDateString().replace(/\//g, '-') + '-' + Math.floor((Math.random() * 1000000)) + '.png'
        aEle.setAttribute('download', fileName)
        aEle.href = data
        document.body.appendChild(aEle)
        aEle.click()
        document.body.removeChild(aEle)
    }

    function render() {
        painter.clear()
        paintData.forEach(item => {
            if (item.type === 'circle') {
                painter.circle({
                    shape: {
                        x: item.x,
                        y: item.y,
                        r: item.r
                    },
                    style: {
                        fill: item.color
                    }
                })
            }

            if (item.type === 'square') {
                painter.square({
                    shape: {
                        x: item.x,
                        y: item.y,
                        w: item.w,
                        h: item.h
                    },
                    style: {
                        fill: item.color
                    }
                })
            }

            if (item.type === 'line') {
                painter.line({
                    shape: {
                        x1: item.x1,
                        y1: item.y1,
                        x2: item.x2,
                        y2: item.y2
                    },
                    style: {
                        stroke: item.color
                    }
                })
            }

            if (item.type === 'curve') {
                painter.curve({
                    shape: {
                        x1: item.x1,
                        y1: item.y1,
                        x2: item.x2,
                        y2: item.y2
                    },
                    style: {
                        fill: item.color,
                        stroke: item.color
                    }
                })
            }

            if (item.type === 'eraser') {
                painter.erase({
                    shape: {
                        x: item.x,
                        y: item.y,
                        r: item.r
                    },
                    style: {
                        fill: item.color
                    }
                })
            }
        })
    }

    function initPalette() {
        $
            .getJSON("./js/color.json", function (data) {
                color = data[0][0]

                data.forEach(function (group, groupIndex) {
                    group
                        .forEach(function (color, index) {
                            var div = document.createElement('div')
                            div.style['background-color'] = color
                            div.className = 'square'
                            if (groupIndex === 0 && index === 0) {
                                div
                                    .classList
                                    .add('z-active')
                            }

                            paletteEle.appendChild(div)
                        })
                })

                Array
                    .prototype
                    .forEach
                    .call(paletteEle.children, function (node) {
                        node
                            .addEventListener('click', function () {
                                Array
                                    .prototype
                                    .forEach
                                    .call(paletteEle.children, function (node) {
                                        node
                                            .classList
                                            .remove('z-active')
                                    })
                                this
                                    .classList
                                    .add('z-active')
                                color = this.style['background-color']
                            })
                    })

            });
    }

    function init() {
        setArea()
        initPalette()
        bindEvent()
    }

    return {
        init: init
    }
})()

drawboard.init()
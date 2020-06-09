const log = console.log.bind(console)

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `选择器 ${selector} 写错了, 请仔细检查并且复习三种基本的选择器`
        alert(s)
        return null
    } else {
        return element
    }
}

const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}

// 生成一个二维 n*n 的数组，其中数字
// 0   代表空白格子（点击到会翻开一片连着的空白格子）
// 1~8 代表格子周围有多少颗雷（点击格子显示这个数字）
// 9   代表雷（点到显示全部雷 && 游戏结束）

const random09 = () => {
    let n = Math.random()
    if (n > 0.88) {
        return 9
    } else {
        return 0
    }
}

const randomLine09 = n => {
    let r = []
    for (let i = 0; i < n; i++) {
        let e = random09()
        r.push(e)
    }
    return r
}

const randomSquare09 = n => {
    let r = []
    for (let i = 0; i < n; i++) {
        let e = randomLine09(n)
        r.push(e)
    }
    // log('randomSquare09', r)
    return r
}

const clonedSquare = function(array) {
    let r = []
    for (let i = 0; i < array.length; i++) {
        let line = array[i]
        let e = line.slice(0)
        r.push(e)
    }
    return r
}

const plus1 = function(array, x, y) {
    // 什么情况下可以 +1
    // 1. 不能是 9
    // 2. 不能越界
    let n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

const markAround = function(array, x, y) {
    if (array[x][y] === 9) {
        // 标记周围 8 个
        // 本来标记的时候需要判断是不是可以标记
        // 比如要标记左上角, 要判断 x > 0, y > 0
        // 这种判断非常麻烦, 所以我们直接把这个判断丢到下一层函数去处理

        // 先标记左边 3 个
        plus1(array, x - 1, y - 1)
        plus1(array, x - 1, y)
        plus1(array, x - 1, y + 1)

        // 再标记上下 2 个
        plus1(array, x, y - 1)
        plus1(array, x, y + 1)

        // 再标记右边 3 个
        plus1(array, x + 1, y - 1)
        plus1(array, x + 1, y)
        plus1(array, x + 1, y + 1)
    }
}

const markedSquare = function(array) {
    let square = clonedSquare(array)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    // log('markedSquare', square)
    return square
}

var n = 9
var array = randomSquare09(n)
var square = markedSquare(array)
// log('markedSquare_load', square)

// 根据二维数组把 n*n 个格子插入页面
const templateSquare = (n, i, j) => {
    let t = `
        <span class="grid" data-num="${n}" data-x="${i}" data-y="${j}">${n}</span>
    `
    return t
}

const insertSquare = (n , square) => {
    log('square in insertSquare', square, square.length)
    // let l = square.length

    let box = e('.box')
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let num = square[i][j]
            let t = templateSquare(num, i, j)
            box.insertAdjacentHTML('beforeend', t)
        }
    }
}

// 给格子添加点击事件
const eventClick = (n , square) => {
    let ele = e('.box')
    ele.addEventListener('click', function(event) {
        let target = event.target
        if (target.classList.contains('grid')) {
            // log('点到了格子', target)
            let self = event.target
            checkCell(self, square)
        }
    })
}

// 对点击到的 不同类型的格子 进行判断
// 如果已经显示，不做任何处理
// 如果没显示过
// 1. 如果点开的是 0，展开周围一片直到有数字的格子
// 2. 如果点开是 9，将全部 9 显示出来，游戏结束
// 3. 如果点开是其他数字，直接显示这个数字

const checkCell = (cell, square) => {
    // cell 参数是 span 元素
    // 拿到存在 cell 里的数字的值
    let n = Number(cell.dataset.num)
    if (n === 0) {
        // log('open 0')
        cell.classList.add('blank')
        showAround(cell, square)
    } else if (n === 9) {
        // log('open 9')
        cell.classList.add('red-mine')
        openAllLei()
        alert('点到雷了！\n游戏结束 ┭┮﹏┭┮')
    } else {
        cell.classList.add('opened')
    }
}

// 自动展开一片的功能
// 判断周围 8 个格子
// 通过当前格子坐标定位到周围 8 个格子的坐标
// 然后把判断丢到下一层函数去处理
const showAround = (cell, square) => {
    // 拿到格子的坐标
    let x = Number(cell.dataset.x)
    let y = Number(cell.dataset.y)

    // 上下2个
    check1(square, x, y + 1)
    check1(square, x, y - 1)
    // 左3个
    check1(square, x - 1, y - 1)
    check1(square, x - 1, y)
    check1(square, x - 1, y + 1)
    // 右3个
    check1(square, x + 1, y - 1)
    check1(square, x + 1, y)
    check1(square, x + 1, y + 1)
}

// 判断一个格子如何处理的功能
// 因为格子的坐标 (x, y) 和二维数组下标 [i][j] 是一一对应的
// 所以查找周围格子的逻辑相当于数组处理
// 先判断周围的格子是否出界，如果没出界：
// 如果格子已经被点开，不做处理
// 如果格子没被点开：
    // 如果是 0 ，添加对应 class 展开格子，递归调用 showAround
    // 如果是 9 ，不做处理
    // 如果是其他数字，添加对应 class 显示数字
// 注意！！！递归的终止条件为展开的格子是 1-9
const check1 = (square, x, y) => {
    let cells = es('.grid')
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        let xn = Number(cell.dataset.x)
        let yn = Number(cell.dataset.y)
        let n = Number(cell.dataset.num)
        // 先判断周围的格子是否出界
        if (x >= 0 && x < square.length && y >= 0 && y < square.length) {
            // 如果没出界，通过定位到格子
            if (xn === x && yn === y) {
                // 如果格子没被点开
                if ((!cell.classList.contains('opened')) && !(cell.classList.contains('blank'))) {
                    // 如果是 0 ，添加对应 class 展开格子，递归调用 showAround
                    if (n === 0) {
                        cell.classList.add('blank')
                        showAround(cell, square)
                    } else if (n === 9) {
                        break
                    } else {
                        cell.classList.add('opened')
                        break
                    }
                }
            }
        }

    }
}

// 自动展开所有雷的函数
const openAllLei = () => {
    let cells = es('.grid')
    // 循环遍历所有 cell 的数字，如果是 9，添加对应的class
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        let n = Number(cell.dataset.num)
        if (n === 9) {
            cell.classList.add('black-mine')
        }
    }
}

const __main = () => {
    // let n = 9
    insertSquare(n, square)
    eventClick(n, square)
}

__main()

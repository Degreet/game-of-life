const ctx = canvas.getContext('2d')
const size = 30
const delay = 100
const line = 1
const colors = {
    alive: 'yellow',
    cell: '#595959'
}

let state = [[2, 5], [2, 6], [2, 7], [2, 8], [2, 10]]
let interval
let strState = state.map(String)
let shiftX, shiftY
let rows, cols
let pause

onload = onresize = () => {
    canvas.width = innerWidth
    canvas.height = innerHeight - 4

    shiftX = innerWidth % size / 2
    shiftY = innerHeight % size / 2

    rows = canvas.height / size | 0
    cols = canvas.width / size | 0

    interval = setInterval(() => {
        tick()
        render()
    }, delay)
}

function buildField() {
    ctx.fillStyle = colors.cell
    for (let i = shiftX; i < innerWidth - size; i += size) {
        for (let j = shiftY; j < innerHeight - size; j += size) {
            ctx.fillRect(i, j, size - line, size - line)
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    buildField()
    state.forEach(coords => {
        ctx.fillStyle = colors.alive
        ctx.fillRect(coords[0] * size + shiftX, coords[1] * size + shiftY, size - line, size - line)
    })
}

function tick() {
    const tempCoords = state.flatMap(([x, y]) => [
        [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
        [x - 1, y],     [x, y],     [x + 1, y],
        [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
    ]).filter(([x, y]) => x >= 0 && x < cols && y >= 0 && y < rows)

    const uniqueTempCoords = [...new Set(tempCoords.map(String))].map(str => str.split(',').map(Number))
    
    state = uniqueTempCoords.filter(coords => {
        const alive = strState.includes(coords.join())
        const count = countNeighbours(coords, state)
        return count == 3 || alive && count > 1 && count < 4
    })

    strState = state.map(String)
}

function countNeighbours([x0, y0], coordsArr) {
    const alive = strState.includes([x0, y0].join())
    return coordsArr.filter(([x, y]) => x - x0 < 2 && x - x0 > -2 && y - y0 < 2 && y - y0 > -2).length - alive
}

canvas.onclick = e => {
    const col = (e.x - shiftX) / size | 0
    const row = (e.y - shiftY) / size | 0
    const cell = state.find(([x, y]) => x == col && y == row)
    if (cell) state = state.filter(coords => coords != cell)
    else state.push([col, row])
    strState = state.map(String)
    render()
}

onkeydown = e => {
    if (e.key == ' ') {
        if (pause) {
            document.body.style.background = '#696969'
            pause = false
            interval = setInterval(() => {
                tick()
                render()
            }, delay)
        } else {
            pause = true
            clearInterval(interval)
            document.body.style.background = '#999999'
        }
    }
}
$(".solve").on("click", () => {
    $(".travelled").each((index, target) => {
        $(target).removeClass("travelled")
    })

    $(".path").each((index, target) => {
        $(target).removeClass("path")
    })
    let map = Array(ROWS).fill().map(() => Array(COLS));
    let value;

    $(".row").each((row_index, row_target) => {
        $(row_target).children(".cell").each((col_index, col_target) => {
            if ($(col_target).hasClass("wall")){
                value = "X";
            }
            else if ($(col_target).hasClass("start")){
                value = "0";
            }
            else if ($(col_target).hasClass("end")){
                value = "E";
            }
            else{
                value = "_";
            }
            map[row_index][col_index] = value;
        })
    })
    solveMap(map, () => {plotPath(map)});
})

let nearestEndRow, nearestEndCol;

function solveMap(map, callback) {
    let start_row, start_col;
    let foundStart = false;
    for (let row = 0; row < ROWS; row++){
        for (let col = 0; col < COLS; col++){
            if (map[row][col] == "0"){
                start_row = row;
                start_col = col;
                foundStart = true;
                break
            }
        }
        if (foundStart){
            break
        }
    }
    
    let queue = [];
    let offsets  = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    queue.push([start_row, start_col, 0])

    let pathFound = false;
    let item = queue.shift()

    let interval = setInterval(async ()=>{
        if (item) {
            curr_row = item[0];
            curr_col = item[1];
            curr_dist= item[2];

            for (let offset of offsets){
                new_row = curr_row + offset[0];
                new_col = curr_col + offset[1];
                new_dist= curr_dist + 1

                if (new_row < 0 || new_row >= ROWS || new_col < 0 || new_col >= COLS){
                    continue;
                }

                if (map[new_row][new_col] == "E"){
                    nearestEndRow = new_row;
                    nearestEndCol = new_col;
                    pathFound = true;
                    break;
                }
                if (map[new_row][new_col] != "_"){
                    continue;
                }
                map[new_row][new_col] = new_dist;
                let target = $(`.row:eq(${new_row}) > .cell:eq(${new_col})`)
                clearCell(target)
                    
                target.addClass("travelled")
                queue.push([new_row, new_col, new_dist])

            }

            if (pathFound) {
                clearInterval(interval);
                callback()
            }

            item = queue.shift();
        }
        else {
            clearInterval(interval);
            callback()
        }

    }, 0);
}

function plotPath(map) {
    let offsets  = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    curr_row = nearestEndRow;
    curr_col = nearestEndCol;
    let curr_dist;

    for (let offset of offsets) {
        new_row = curr_row + offset[0];
        new_col = curr_col + offset[1];
        if (!isNaN(map[new_row][new_col])){
            curr_dist = map[new_row][new_col];
            curr_row = new_row;
            curr_col = new_col;
            break;
        }
    }

    let target = $(`.row:eq(${new_row}) > .cell:eq(${new_col})`)
    clearCell(target)
                    
    target.addClass("path")

    atStart = false;
    while (!atStart){
        for (let offset of offsets){
            new_row = curr_row + offset[0];
            new_col = curr_col + offset[1];
            new_dist = curr_dist - 1
            console.log(new_row, new_col)

            if (map[new_row][new_col] == "0"){
                atStart = true;
                break;
            }

            if (map[new_row][new_col] == new_dist){
                let target = $(`.row:eq(${new_row}) > .cell:eq(${new_col})`)
                clearCell(target)
                    
                target.addClass("path")

                curr_row = new_row
                curr_col = new_col
                curr_dist = new_dist
                break
            }
        }
    }

}
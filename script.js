let ROWS = Math.floor(($(window).height() - $("header").height()) / 40) - 2;
let COLS = Math.floor($(window).width() / 40);

let container = document.getElementsByClassName("grid-container")[0];

for (let i = 0; i < ROWS; i++){
    let row = document.createElement("div");
    row.setAttribute("class", "row")
    for (let j = 0; j < COLS; j++){
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        row.appendChild(cell);
    }
    
    container.appendChild(row);
}

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

function clearCell(cell){
    cell.removeClass("wall")
    .removeClass("start")
    .removeClass("end")
    .removeClass("travelled")
    .removeClass("path")
}

let mouseIsDown = false;
let mode;
let activeOption = "wall";

$(".option").on("click", (event) => {
    $("header > .option").each((index, target) => {
        $(target).removeClass("active");
    })
    $(event.target).addClass("active");

    activeOption = $(event.target).attr("id")
})

$(document).on("mousedown", (event) => {
    pauseEvent(event);

    mouseIsDown = true;
    if ($(event.target).hasClass(activeOption)){
        mode = "clear";
    }
    else {
        mode = activeOption;
    }
    if ($(event.target).hasClass("cell")){
        $(".travelled").each((index, target) => {
            $(target).removeClass("travelled")
        })
    
        $(".path").each((index, target) => {
            $(target).removeClass("path")
        })
        if (mode == "clear"){
            clearCell($(event.target))
        }
        else if (mode == "start") {
            $(".cell.start").each((index, target) => {
                $(target).removeClass("start");
            })
            clearCell($(event.target))
            $(event.target).addClass(mode);
        }
        else {
            $(event.target).addClass(mode);
        }
    }
});
$(document).on("mousemove", (event) => {
    if (mouseIsDown){
        if ($(event.target).hasClass("cell")){
            if (mode == "clear"){
                clearCell($(event.target))
            }
            else if (mode != "start") {
                clearCell($(event.target))
                $(event.target).addClass(mode);
            }

        }
    }
});
$(document).on("mouseup", (event) => {
    mouseIsDown = false;
});
$(".reset").on("click", (event) => {
    $(".cell").each((index, target) => {
        clearCell($(target));
    })
    
})
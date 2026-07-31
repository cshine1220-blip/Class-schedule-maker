// ======================================================
// timetable.js V2
// ======================================================

function createTimetable() {

    const timetable = document.getElementById("timetable");

    timetable.innerHTML = "";

    const table = document.createElement("table");

    //----------------------------------------------------
    // 時段資料
    //----------------------------------------------------

    const periods = [

        { code:"A", time:"07:10-08:00", value:10 },

        { code:"1", time:"08:10-09:00", value:1 },

        { code:"2", time:"09:10-10:00", value:2 },

        { code:"3", time:"10:10-11:00", value:3 },

        { code:"4", time:"11:10-12:00", value:4 },

        { code:"B", time:"12:10-13:00", value:11 },

        { code:"5", time:"13:10-14:00", value:5 },

        { code:"6", time:"14:10-15:00", value:6 },

        { code:"7", time:"15:10-16:00", value:7 },

        { code:"8", time:"16:10-17:00", value:8 },

        { code:"C", time:"17:05-17:55", value:12 },

        { code:"D", time:"18:00-18:50", value:13 },

        { code:"E", time:"18:55-19:45", value:14 },

        { code:"F", time:"19:50-20:40", value:15 },

        { code:"G", time:"20:45-21:35", value:16 }

    ];

    //----------------------------------------------------
    // 星期
    //----------------------------------------------------

    const days = [

        "一",

        "二",

        "三",

        "四",

        "五",


    ];

    //----------------------------------------------------
    // Header
    //----------------------------------------------------

    const head = document.createElement("tr");

    head.innerHTML = `

        <th class="time-column">時間</th>

        <th class="period-column">節次</th>

    `;

    days.forEach(day=>{

        const th=document.createElement("th");

        th.className="day-header";

        th.textContent="星期"+day;

        head.appendChild(th);

    });

    table.appendChild(head);

    //----------------------------------------------------
    // 建立格子
    //----------------------------------------------------

    periods.forEach(period=>{

        const tr=document.createElement("tr");

        const tdTime=document.createElement("td");

        tdTime.className="time-column";

        tdTime.textContent=period.time;

        tr.appendChild(tdTime);

        const tdCode=document.createElement("td");

        tdCode.className="period-column";

        tdCode.textContent=period.code;

        tr.appendChild(tdCode);

        for(let day=0;day<5;day++){

            const td=document.createElement("td");

            td.className="course-cell";

            td.dataset.day=day;

            td.dataset.period=period.value;

            td.addEventListener("dragover",e=>{

                e.preventDefault();

            });

            td.addEventListener("drop",()=>{

                DragManager.drop(

                    day,

                    period.value

                );

            });

            tr.appendChild(td);

        }

        table.appendChild(tr);

    });

    timetable.appendChild(table);

    refreshDragDrop();

}
// ======================================================
// 重新繪製整個課表
// ======================================================

function renderTimetable() {

    document.querySelectorAll(".course-cell").forEach(cell => {

        cell.innerHTML = "";

        cell.classList.remove("conflict");

    });

    App.timetable.forEach(course => {

        renderCell(

            course.day,

            course.period

        );

    });

    renderConflicts();

}

// ======================================================
// 繪製單一格
// ======================================================

function renderCell(day, period) {

    const cell = document.querySelector(

        `.course-cell[data-day="${day}"][data-period="${period}"]`

    );

    if (!cell)
        return;

    cell.innerHTML = "";

    const course = App.timetable.find(c =>

        c.day == day &&
        c.period == period

    );

    if (!course)
        return;

    const module = getModule(

        course.moduleId

    );

    if (!module)
        return;

    const block = document.createElement("div");

    block.className = "course-block";

    block.draggable = true;

    block.style.background = module.color;

    block.innerHTML = `

        <strong>${module.name}</strong>

        <div>${module.teacher || ""}</div>

        <div>${course.room || module.room || ""}</div>

        <small>

            ${module.credit || 0} 學分

        </small>

    `;

    //-----------------------------------------
    // 拖曳開始
    //-----------------------------------------

    block.addEventListener("dragstart", () => {

        DragManager.startMove(

            day,

            period

        );

    });

    //-----------------------------------------
    // 拖曳結束
    //-----------------------------------------

    block.addEventListener("dragend", () => {

        DragManager.end();

    });

    //-----------------------------------------
    // 雙擊編輯
    //-----------------------------------------

    block.addEventListener("dblclick", () => {

        if (typeof openEditModal === "function") {

            openEditModal(module);

        }

    });

    //-----------------------------------------
    // 右鍵刪除
    //-----------------------------------------

    block.addEventListener("contextmenu", e => {

        e.preventDefault();

        if (!confirm("確定移除此課程？"))
            return;

        removeCourse(

            day,

            period

        );

    });

    cell.appendChild(block);

}
// ======================================================
// 更新單一格
// ======================================================

function refreshCell(day, period) {

    renderCell(day, period);

}

// ======================================================
// 更新整張課表
// ======================================================

function refreshTimetable() {

    createTimetable();

    renderTimetable();

}

// ======================================================
// 取得指定課程
// ======================================================

function getCourse(day, period) {

    return App.timetable.find(course =>

        course.day == day &&
        course.period == period

    );

}

// ======================================================
// 刪除指定格課程
// ======================================================

function removeCourse(day, period) {

    App.timetable = App.timetable.filter(course =>

        !(

            course.day == day &&
            course.period == period

        )

    );

    saveData();

    refreshTimetable();

}

// ======================================================
// 衝堂檢查
// ======================================================

function checkConflict(day, period) {

    return App.timetable.filter(course =>

        course.day == day &&
        course.period == period

    );

}

// ======================================================
// 顯示衝堂
// ======================================================

function renderConflicts() {

    document.querySelectorAll(".course-cell").forEach(cell => {

        const day = Number(cell.dataset.day);

        const period = Number(cell.dataset.period);

        const conflicts = checkConflict(day, period);

        cell.classList.remove("conflict");

        if (conflicts.length > 1) {

            cell.classList.add("conflict");

        }

    });

}

// ======================================================
// 清空課表畫面
// ======================================================

function clearTimetableView() {

    document.querySelectorAll(".course-cell").forEach(cell => {

        cell.innerHTML = "";

        cell.classList.remove("conflict");

    });

}
// ======================================================
// 找出連續課程（預留 V3）
// ======================================================

function findContinuousCourse(day, period) {

    const course = getCourse(day, period);

    if (!course)
        return null;

    const moduleId = course.moduleId;

    const list = App.timetable
        .filter(c =>

            c.day == day &&

            c.moduleId == moduleId

        )
        .sort((a, b) =>

            a.period - b.period

        );

    return list;

}

// ======================================================
// 是否為第一節
// ======================================================

function isFirstPeriod(day, period) {

    const list = findContinuousCourse(

        day,

        period

    );

    if (!list)
        return false;

    return list[0].period === period;

}

// ======================================================
// 計算 rowspan
// ======================================================

function getRowSpan(day, period) {

    const list = findContinuousCourse(

        day,

        period

    );

    if (!list)
        return 1;

    let span = 1;

    for (let i = 1; i < list.length; i++) {

        if (

            list[i].period ===

            list[i - 1].period + 1

        ) {

            span++;

        }

        else {

            break;

        }

    }

    return span;

}

// ======================================================
// 判斷是否隱藏
// ======================================================

function shouldHideCell(day, period) {

    const list = findContinuousCourse(

        day,

        period

    );

    if (!list)
        return false;

    return list.some(course =>

        course.period < period

    );

}

// ======================================================
// 更新所有 rowspan（目前預留）
// ======================================================

function updateRowSpan() {

    document.querySelectorAll(

        ".course-cell"

    ).forEach(cell => {

        cell.style.display = "";

        cell.removeAttribute("rowspan");

    });

}

// ======================================================
// timetable.js Part 3 End
// ======================================================
// ======================================================
// 初始化課表
// ======================================================

function initTimetable() {

    createTimetable();

    renderTimetable();

}

// ======================================================
// 重新載入
// ======================================================

function reloadTimetable() {

    createTimetable();

    renderTimetable();

}

// ======================================================
// 視窗大小改變
// ======================================================

function resizeTimetable() {

    renderTimetable();

}

// ======================================================
// 更新資料
// ======================================================

function updateTimetable() {

    saveData();

    renderTimetable();

}

// ======================================================
// 清除課表
// ======================================================

function clearTimetable() {

    if (!confirm("確定清空整個課表？"))
        return;

    App.timetable = [];

    saveData();

    renderTimetable();

}

// ======================================================
// 依 moduleId 尋找所有課程
// ======================================================

function getCoursesByModule(moduleId) {

    return App.timetable.filter(course =>

        course.moduleId == moduleId

    );

}

// ======================================================
// 移除整門課
// ======================================================

function removeModuleCourses(moduleId) {

    App.timetable = App.timetable.filter(course =>

        course.moduleId != moduleId

    );

    saveData();

    renderTimetable();

}

// ======================================================
// 判斷格子是否有課
// ======================================================

function hasCourse(day, period) {

    return App.timetable.some(course =>

        course.day == day &&

        course.period == period

    );

}

// ======================================================
// DOM Ready
// ======================================================

window.addEventListener("load", () => {

    initTimetable();

});

// ======================================================
// 視窗大小改變
// ======================================================

window.addEventListener("resize", () => {

    resizeTimetable();

});

// ======================================================
// timetable.js End
// ======================================================
// ======================================================
// Timetable System V2
// app.js
// Part 1
// ======================================================

let editingModuleId = null;

const modal = document.getElementById("courseModal");

const searchInput = document.getElementById("searchInput");

const courseName = document.getElementById("courseName");
const teacherName = document.getElementById("teacherName");
const roomName = document.getElementById("roomName");
const creditInput = document.getElementById("credit");
const categoryInput = document.getElementById("category");
const colorInput = document.getElementById("color");

const addCourseBtn = document.getElementById("addCourseBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const deleteBtn = document.getElementById("deleteCourseBtn");

init();

function init(){

    loadData();

    createTimetable();

    renderModules();

    renderTimetable();

    initExcel();

    initExport();

    initImport();

    bindEvents();

}

function bindEvents(){

    searchInput.addEventListener("input",()=>{

        renderModules(searchInput.value);

    });

    addCourseBtn.addEventListener("click",openCreateModal);

    cancelBtn.addEventListener("click",closeModal);

    saveBtn.addEventListener("click",saveModule);

    deleteBtn.addEventListener("click",deleteModule);

}

function openCreateModal(){

    editingModuleId=null;

    courseName.value="";

    teacherName.value="";

    roomName.value="";

    creditInput.value=0;

    categoryInput.value="必修";

    colorInput.value="#4CAF50";

    saveBtn.textContent="新增課程";

    deleteBtn.style.display="none";

    modal.classList.remove("hidden");

}

function closeModal(){

    modal.classList.add("hidden");

}

function openEditModal(module){

    editingModuleId=module.id;

    courseName.value=module.name;

    teacherName.value=module.teacher;

    roomName.value=module.room;

    creditInput.value=module.credit ?? 0;

    categoryInput.value=module.category ?? "必修";

    colorInput.value=module.color;

    saveBtn.textContent="儲存修改";

    deleteBtn.style.display="inline-block";

    modal.classList.remove("hidden");

}
// ======================================================
// 顯示課程模組
// ======================================================

function renderModules(keyword = "") {

    const list = document.getElementById("moduleList");

    list.innerHTML = "";

    keyword = keyword.trim().toLowerCase();

    App.modules.forEach(module => {

        const text = (
            (module.name ?? "") +
            (module.teacher ?? "") +
            (module.room ?? "")
        ).toLowerCase();

        if (keyword !== "" && !text.includes(keyword)) {
            return;
        }

        const card = document.createElement("div");

        card.className = "module-card";

        card.draggable = true;

        card.dataset.id = module.id;

        card.style.borderLeft =
            "8px solid " + module.color;

        card.innerHTML = `

            <h3>${module.name}</h3>

            <p>
                👨‍🏫 ${module.teacher}
            </p>

            <small>
                🏫 ${module.room}
            </small>

            <br>

            <small>

                ${module.category ?? "未分類"}

                ・

                ${module.credit ?? 0} 學分

            </small>

        `;

        //--------------------------------
        // 拖曳開始
        //--------------------------------

        card.addEventListener("dragstart", () => {

            DragManager.start(module.id);

        });

        //--------------------------------
        // 拖曳結束
        //--------------------------------

        card.addEventListener("dragend", () => {

            DragManager.end();

        });

        //--------------------------------
        // 點擊編輯
        //--------------------------------

        card.addEventListener("click", () => {

            openEditModal(module);

        });

        list.appendChild(card);

    });

}
// ======================================================
// 儲存課程（新增 / 編輯）
// ======================================================

function saveModule() {

    const name = courseName.value.trim();
    const teacher = teacherName.value.trim();
    const room = roomName.value.trim();

    const credit = parseInt(creditInput.value) || 0;

    const category = categoryInput.value;

    const color = colorInput.value;

    if (name === "") {

        alert("請輸入課程名稱");

        return;

    }

    //--------------------------------
    // 新增
    //--------------------------------

    if (editingModuleId === null) {

        const module = {

            id: Date.now(),

            name,

            teacher,

            room,

            credit,

            category,

            color

        };

        App.modules.push(module);

    }

    //--------------------------------
    // 修改
    //--------------------------------

    else {

        const module = App.modules.find(

            m => m.id == editingModuleId

        );

        if (!module) {

            alert("找不到課程");

            return;

        }

        module.name = name;

        module.teacher = teacher;

        module.room = room;

        module.credit = credit;

        module.category = category;

        module.color = color;

    }

    //--------------------------------
    // 更新畫面
    //--------------------------------

    saveData();

    renderModules(searchInput.value);

    renderTimetable();

    closeModal();

}

// ======================================================
// 刪除課程
// ======================================================

function deleteModule() {

    if (editingModuleId === null)
        return;

    if (!confirm("確定刪除此課程？"))
        return;

    //--------------------------------
    // 刪除模組
    //--------------------------------

    App.modules = App.modules.filter(

        module => module.id != editingModuleId

    );

    //--------------------------------
    // 刪除課表上的所有課程
    //--------------------------------

    App.timetable = App.timetable.filter(

        course => course.moduleId != editingModuleId

    );

    editingModuleId = null;

    saveData();

    renderModules(searchInput.value);

    createTimetable();

    renderTimetable();

    closeModal();

}
// ======================================================
// 關閉 Modal（點背景）
// ======================================================

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        closeModal();

    }

});

// ======================================================
// ESC 關閉 Modal
// ======================================================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        closeModal();

    }

});

// ======================================================
// 清空課表
// ======================================================

const clearBtn = document.getElementById("clearBtn");

if (clearBtn) {

    clearBtn.addEventListener("click", () => {

        if (!confirm("確定清空整個課表？")) {

            return;

        }

        App.timetable = [];

        saveData();

        createTimetable();

        renderTimetable();

    });

}

// ======================================================
// 重新整理畫面
// ======================================================

function refreshSystem() {

    saveData();

    renderModules(searchInput.value);

    createTimetable();

    renderTimetable();

}

// ======================================================
// 取得課程
// ======================================================

function getModule(id) {

    return App.modules.find(

        module => module.id == id

    );

}

// ======================================================
// 檢查是否重複
// ======================================================

function moduleExists(name, teacher, room) {

    return App.modules.some(module =>

        module.name === name &&

        module.teacher === teacher &&

        module.room === room

    );

}

// ======================================================
// 重新排序（依課程名稱）
// ======================================================

function sortModules() {

    App.modules.sort((a, b) =>

        a.name.localeCompare(

            b.name,

            "zh-Hant"

        )

    );

}

// ======================================================
// 統一刷新
// ======================================================

function updateAll() {

    sortModules();

    refreshSystem();

}

// ======================================================
// 視窗大小改變
// ======================================================

window.addEventListener("resize", () => {

    renderTimetable();

});

// ======================================================
// app.js Part 4 End
// ======================================================
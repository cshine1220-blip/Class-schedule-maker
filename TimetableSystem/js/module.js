// ======================================================
// module.js V2
// ======================================================

const App = {

    modules: [],

    timetable: [],

    settings: {

        days: [

            "一",
            "二",
            "三",
            "四",
            "五"

        ],

        periods: 10

    }

};

// ======================================================
// 建立課程
// ======================================================

function createModule(data = {}) {

    return {

        id: data.id ?? Date.now() + Math.random(),

        name: data.name ?? "",

        teacher: data.teacher ?? "",

        room: data.room ?? "",

        credit: data.credit ?? 0,

        category: data.category ?? "必修",

        color: data.color ?? randomColor(),

        sections: data.sections ?? []

    };

}

// ======================================================
// 新增課程
// ======================================================

function addModule(data) {

    const module = createModule(data);

    App.modules.push(module);

    return module;

}

// ======================================================
// 修改課程
// ======================================================

function updateModule(id, data) {

    const module = App.modules.find(

        m => m.id == id

    );

    if (!module)
        return;

    Object.assign(module, data);

}

// ======================================================
// 刪除課程
// ======================================================

function removeModule(id) {

    App.modules = App.modules.filter(

        m => m.id != id

    );

    App.timetable = App.timetable.filter(

        c => c.moduleId != id

    );

}

// ======================================================
// 查詢課程
// ======================================================

function getModule(id) {

    return App.modules.find(

        m => m.id == id

    );

}

// ======================================================
// 是否存在
// ======================================================

function hasModule(name, teacher, room) {

    return App.modules.some(

        module =>

            module.name === name &&

            module.teacher === teacher &&

            module.room === room

    );

}

// ======================================================
// 排序
// ======================================================

function sortModules() {

    App.modules.sort(

        (a, b) =>

            a.name.localeCompare(

                b.name,

                "zh-Hant"

            )

    );

}

// ======================================================
// 顏色
// ======================================================

function randomColor() {

    const colors = [

        "#4CAF50",

        "#2196F3",

        "#FF9800",

        "#9C27B0",

        "#F44336",

        "#009688",

        "#3F51B5",

        "#795548",

        "#607D8B",

        "#E91E63"

    ];

    return colors[

        Math.floor(

            Math.random() *

            colors.length

        )

    ];

}
function deleteAllModules(){

    if(!confirm("確定刪除所有模組？"))
        return;

    App.modules=[];

    App.timetable=[];

    saveData();

    renderModules();

    refreshTimetable();

}
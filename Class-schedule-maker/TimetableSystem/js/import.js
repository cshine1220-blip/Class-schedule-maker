// ======================================================
// import.js V2
// ======================================================

function initImport() {

    const importBtn = document.getElementById("importJsonBtn");

    const input = document.getElementById("jsonInput");

    if (!importBtn || !input)
        return;

    importBtn.addEventListener("click", () => {

        input.click();

    });

    input.addEventListener("change", event => {

        const file = event.target.files[0];

        if (!file)
            return;

        importJSON(file);

        input.value = "";

    });

}

// ======================================================
// JSON 匯入
// ======================================================

function importJSON(file) {

    const reader = new FileReader();

    reader.onload = e => {

        try {

            const data = JSON.parse(e.target.result);

            restoreData(data);

            alert("匯入成功");

        }

        catch (err) {

            console.error(err);

            alert("JSON 格式錯誤");

        }

    };

    reader.readAsText(file);

}

// ======================================================
// 還原資料
// ======================================================

function restoreData(data) {

    App.modules = [];

    App.timetable = [];

    //----------------------------------
    // Modules
    //----------------------------------

    if (Array.isArray(data.modules)) {

        data.modules.forEach(module => {

            App.modules.push({

                id: module.id,

                name: module.name ?? "",

                teacher: module.teacher ?? "",

                room: module.room ?? "",

                credit: module.credit ?? 0,

                category: module.category ?? "必修",

                color: module.color ?? randomColor(),

                sections: module.sections ?? []

            });

        });

    }

    //----------------------------------
    // Timetable
    //----------------------------------

    if (Array.isArray(data.timetable)) {

        data.timetable.forEach(course => {

            App.timetable.push({

                moduleId: course.moduleId,

                day: Number(course.day),

                period: Number(course.period),

                room: course.room ?? ""

            });

        });

    }

    //----------------------------------
    // Settings
    //----------------------------------

    if (data.settings) {

        if (Array.isArray(data.settings.days)) {

            App.settings.days = data.settings.days;

        }

        if (data.settings.periods) {

            App.settings.periods = Number(

                data.settings.periods

            );

        }

    }

    saveData();

    createTimetable();

    renderModules();

    renderTimetable();

}

// ======================================================
// 合併匯入（保留現有資料）
// ======================================================

function mergeImport(data) {

    if (!Array.isArray(data.modules))
        return;

    data.modules.forEach(module => {

        if (

            hasModule(

                module.name,

                module.teacher,

                module.room

            )

        )

            return;

        App.modules.push(module);

    });

    if (Array.isArray(data.timetable)) {

        data.timetable.forEach(course => {

            const conflict = App.timetable.find(c =>

                c.day == course.day &&

                c.period == course.period

            );

            if (!conflict) {

                App.timetable.push(course);

            }

        });

    }

    saveData();

    renderModules();

    createTimetable();

    renderTimetable();

}

// ======================================================
// 匯入完成
// ======================================================

console.log("import.js V2 Loaded");
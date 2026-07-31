// ======================================================
// storage.js V2
// ======================================================

const STORAGE_KEY = "TimetableSystem_V2";

// ======================================================
// 儲存
// ======================================================

function saveData() {

    const data = {

        version: 2,

        modules: App.modules,

        timetable: App.timetable,

        settings: App.settings,

        updatedAt: new Date().toISOString()

    };

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}

// ======================================================
// 載入
// ======================================================

function loadData() {

    const json = localStorage.getItem(STORAGE_KEY);

    if (!json) {

        loadOldVersion();

        return;

    }

    try {

        const data = JSON.parse(json);

        App.modules = Array.isArray(data.modules)
            ? data.modules
            : [];

        App.timetable = Array.isArray(data.timetable)
            ? data.timetable
            : [];

        if (data.settings) {

            App.settings.days =
                data.settings.days ??
                App.settings.days;

            App.settings.periods =
                data.settings.periods ??
                App.settings.periods;

        }

    }

    catch (e) {

        console.error(e);

        alert("資料讀取失敗");

    }

}

// ======================================================
// 相容 V1
// ======================================================

function loadOldVersion() {

    const json = localStorage.getItem("TimetableSystem");

    if (!json)
        return;

    try {

        const data = JSON.parse(json);

        App.modules = data.modules || [];

        App.timetable = data.timetable || [];

        saveData();

    }

    catch (e) {

        console.error(e);

    }

}

// ======================================================
// 清除全部資料
// ======================================================

function clearStorage() {

    if (!confirm("確定清除所有資料？"))
        return;

    localStorage.removeItem(STORAGE_KEY);

    App.modules = [];

    App.timetable = [];

    saveData();

    renderModules();

    createTimetable();

    renderTimetable();

}

// ======================================================
// 匯出 JSON
// ======================================================

function exportJson() {

    const blob = new Blob(

        [

            JSON.stringify(

                {

                    modules: App.modules,

                    timetable: App.timetable,

                    settings: App.settings

                },

                null,

                2

            )

        ],

        {

            type: "application/json"

        }

    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "Timetable.json";

    a.click();

}

// ======================================================
// 匯入 JSON
// ======================================================

function importJson(file) {

    const reader = new FileReader();

    reader.onload = e => {

        const data = JSON.parse(e.target.result);

        App.modules = data.modules || [];

        App.timetable = data.timetable || [];

        if (data.settings)
            App.settings = data.settings;

        saveData();

        renderModules();

        createTimetable();

        renderTimetable();

    };

    reader.readAsText(file);

}

// ======================================================
// 自動儲存
// ======================================================

window.addEventListener("beforeunload", () => {

    saveData();

});
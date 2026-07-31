// ======================================================
// export.js V2
// ======================================================

function initExport() {

    const exportBtn = document.getElementById("exportBtn");

    if (!exportBtn) return;

    exportBtn.addEventListener("click", showExportMenu);

}

// ======================================================
// 匯出選單
// ======================================================

function showExportMenu() {

    const type = prompt(

`請輸入匯出格式：

1 = JSON
2 = Excel
3 = CSV
4 = 列印`

    );

    switch(type){

        case "1":

            exportJSON();

            break;

        case "2":

            exportExcel();

            break;

        case "3":

            exportCSV();

            break;

        case "4":

            printTimetable();

            break;

    }

}

// ======================================================
// JSON
// ======================================================

function exportJSON(){

    const data={

        version:2,

        modules:App.modules,

        timetable:App.timetable,

        settings:App.settings,

        exportTime:new Date().toLocaleString()

    };

    downloadFile(

        JSON.stringify(data,null,4),

        "Timetable.json",

        "application/json"

    );

}

// ======================================================
// CSV
// ======================================================

function exportCSV(){

    let csv="課程,老師,教室,星期,節次\n";

    App.timetable.forEach(course=>{

        const module=getModule(course.moduleId);

        if(!module) return;

        csv+=

`${module.name},${module.teacher},${course.room ?? module.room},${App.settings.days[course.day]},${course.period}\n`;

    });

    downloadFile(

        csv,

        "Timetable.csv",

        "text/csv"

    );

}

// ======================================================
// Excel
// ======================================================

function exportExcel(){

    const rows=[];

    App.timetable.forEach(course=>{

        const module=getModule(course.moduleId);

        if(!module) return;

        rows.push({

            課程:module.name,

            老師:module.teacher,

            教室:course.room ?? module.room,

            星期:App.settings.days[course.day],

            節次:course.period,

            學分:module.credit,

            分類:module.category

        });

    });

    const sheet=XLSX.utils.json_to_sheet(rows);

    const book=XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        book,

        sheet,

        "Timetable"

    );

    XLSX.writeFile(

        book,

        "Timetable.xlsx"

    );

}

// ======================================================
// 列印
// ======================================================

function printTimetable(){

    window.print();

}

// ======================================================
// 共用下載
// ======================================================

function downloadFile(

    content,

    filename,

    type

){

    const blob=new Blob(

        [content],

        {

            type

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=filename;

    a.click();

    URL.revokeObjectURL(url);

}
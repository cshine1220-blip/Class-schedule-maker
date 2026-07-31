// ======================================================
// excel.js V2
// Part 1
// ======================================================

function initExcel() {

    const importBtn = document.getElementById("importExcelBtn");

    const excelInput = document.getElementById("excelInput");

    importBtn.addEventListener("click", () => {

        excelInput.click();

    });

    excelInput.addEventListener("change", handleExcel);

}

// ======================================================
// 讀取 Excel
// ======================================================

function handleExcel(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {

        const workbook = XLSX.read(

            e.target.result,

            {

                type: "array"

            }

        );

        const sheet = workbook.Sheets[

            workbook.SheetNames[0]

        ];

        const rows = XLSX.utils.sheet_to_json(

            sheet,

            {

                defval: ""

            }

        );

        importExcel(rows);

        event.target.value = "";

    };

    reader.readAsArrayBuffer(file);

}

// ======================================================
// 匯入課程
// ======================================================

function importExcel(rows){

    let success=0;

    let skip=0;

    rows.forEach(row=>{

        const module=parseRow(row);

        if(!module) return;

        if(hasModule(

            module.name,

            module.teacher,

            module.room

        )){

            skip++;

            return;

        }

        const newModule=addModule(module);

        success++;

        autoPutIntoTimetable(

            newModule,

            module.sections

        );

    });

    updateAll();

    alert(

`Excel 匯入完成

新增：${success}

略過：${skip}`

    );

}
// ======================================================
// Excel → Module
// Part 2
// ======================================================

function parseRow(row){

    const module={

        name:getValue(row,[
            "課程名稱",
            "名稱",
            "科目",
            "Course"
        ]),

        teacher:getValue(row,[
            "老師",
            "教師",
            "授課教師"
        ]),

        room:getValue(row,[
            "教室",
            "教室1",
            "Room"
        ]),

        credit:parseInt(

            getValue(row,[
                "學分",
                "Credits"
            ])

        )||0,

        category:getValue(row,[

            "必選修",
            "課程類別",
            "分類"

        ])||"必修",

        color:randomColor(),

        sections:[]
    };

    if(module.name==="")
        return null;

    //-------------------------------------------------
    // 教室1~3
    //-------------------------------------------------

    const rooms=[

        getValue(row,["教室1"]),

        getValue(row,["教室2"]),

        getValue(row,["教室3"])

    ];

    //-------------------------------------------------
    // 時間1~3
    //-------------------------------------------------

    const times=[

        getValue(row,["時間1"]),

        getValue(row,["時間2"]),

        getValue(row,["時間3"])

    ];

    for(let i=0;i<3;i++){

        if(times[i]==="")
            continue;

        module.sections.push({

            room:rooms[i]||module.room,

            time:times[i]

        });

    }

    return module;

}

// ======================================================
// 安全取得欄位
// ======================================================

function getValue(row,names){

    for(const key of names){

        if(row[key]!==undefined){

            return String(row[key]).trim();

        }

    }

    return "";

}
// ======================================================
// 時間解析
// 支援：
// 1-56
// 2-34
// 5-789
// 4-A56
// ======================================================

function autoPutIntoTimetable(module, sections){

    sections.forEach(section=>{

        const cells=parseTime(section.time);

        cells.forEach(cell=>{

            const conflict=App.timetable.find(course=>

                course.day===cell.day &&
                course.period===cell.period

            );

            if(conflict){

                console.warn(
                    `${module.name} 衝堂：星期${App.settings.days[cell.day]} 第${cell.period}節`
                );

                return;
            }

            App.timetable.push({

                moduleId:module.id,

                day:cell.day,

                period:cell.period,

                room:section.room

            });

        });

    });

}

// ======================================================
// 解析時間
// ======================================================

function parseTime(text){

    text=String(text).trim();

    if(text==="")
        return [];

    //----------------------------------------
    // 去掉空白
    //----------------------------------------

    text=text.replace(/\s+/g,"");

    //----------------------------------------
    // 格式：
    // 1-56
    //----------------------------------------

    const match=text.match(/^([1-7])-([A-Za-z0-9]+)$/);

    if(!match)
        return [];

    const day=parseInt(match[1])-1;

    const periodString=match[2];

    const result=[];

    for(const ch of periodString){

        const p=parsePeriod(ch);

        if(p===null)
            continue;

        result.push({

            day,

            period:p

        });

    }

    return result;

}

// ======================================================
// 節次轉換
// ======================================================

function parsePeriod(ch){

    switch(ch.toUpperCase()){

        case 'A': return 10;
        case 'B': return 11;
        case 'C': return 12;
        case 'D': return 13;
        case 'E': return 14;
        case 'F': return 15;
        case 'G': return 16;

        default:

            if(ch>='1' && ch<='9')
                return Number(ch);

            return null;
    }

}

// ======================================================
// excel.js Part 3 End
// ======================================================
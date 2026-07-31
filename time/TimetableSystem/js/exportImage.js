// ======================================================
// exportImage.js
// 課表圖片匯出
// ======================================================

const ExportImage = {

    periods: [

        { code:"A", time:"07:10~08:00", value:10 },

        { code:"1", time:"08:10~09:00", value:1 },

        { code:"2", time:"09:10~10:00", value:2 },

        { code:"3", time:"10:10~11:00", value:3 },

        { code:"4", time:"11:10~12:00", value:4 },

        { code:"B", time:"12:10~13:00", value:11 },

        { code:"5", time:"13:10~14:00", value:5 },

        { code:"6", time:"14:10~15:00", value:6 },

        { code:"7", time:"15:10~16:00", value:7 },

        { code:"8", time:"16:10~17:00", value:8 },

        { code:"C", time:"17:05~17:55", value:12 },

        { code:"D", time:"18:00~18:50", value:13 },

        { code:"E", time:"18:55~19:45", value:14 },

        { code:"F", time:"19:50~20:40", value:15 },

        { code:"G", time:"20:45~21:35", value:16 }

    ],

    days:[
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
    ]

};
// ======================================================
// 建立匯出用 HTML
// ======================================================

ExportImage.createHTML = function () {

    let html = `

    <div id="export-sheet"

        style="

            width:1600px;

            background:white;

            padding:40px;

            font-family:'Microsoft JhengHei',sans-serif;

        "

    >

        <h2 style="text-align:center;margin-bottom:20px;">

            課程表

        </h2>

        <table

            style="

                width:100%;

                border-collapse:collapse;

                table-layout:fixed;

            "

        >

        <thead>

            <tr>

                <th style="width:120px;">時間</th>

                <th style="width:60px;">節次</th>

    `;

    //---------------------------------------
    // 星期
    //---------------------------------------

    ExportImage.days.forEach(day => {

        html += `

            <th

                style="

                    background:#1976d2;

                    color:white;

                    border:1px solid #999;

                    height:42px;

                "

            >

                ${day}

            </th>

        `;

    });

    html += "</tr></thead><tbody>";

    //---------------------------------------
    // 每一節
    //---------------------------------------

    ExportImage.periods.forEach(period => {

        html += "<tr>";

        html += `

            <td

                style="

                    text-align:center;

                    border:1px solid #999;

                    font-size:13px;

                "

            >

                ${period.time}

            </td>

        `;

        html += `

            <td

                style="

                    text-align:center;

                    border:1px solid #999;

                    font-weight:bold;

                "

            >

                ${period.code}

            </td>

        `;

        //---------------------------------------
        // 七天
        //---------------------------------------

        for(let day=0;day<5;day++){

            html+=`

            <td

                data-day="${day}"

                data-period="${period.value}"

                style="

                    height:72px;

                    border:1px solid #999;

                    vertical-align:top;

                    padding:4px;

                "

            >

            </td>

            `;

        }

        html+="</tr>";

    });

    html+="</tbody></table></div>";

    return html;

};
// ======================================================
// 將課程填入表格
// ======================================================

ExportImage.fillCourses = function(container){

    App.timetable.forEach(item=>{

        const cell = container.querySelector(

            `td[data-day="${item.day}"][data-period="${item.period}"]`

        );

        if(!cell) return;

        const module = getModule(item.moduleId);

        if(!module) return;

        const block = document.createElement("div");

        block.style.cssText = `
            width:100%;
            height:100%;
            background:${module.color || "#90caf9"};
            border-radius:6px;
            box-sizing:border-box;
            padding:4px;
            color:#000;
            font-size:12px;
            line-height:1.4;
            overflow:hidden;
        `;

        block.innerHTML = `
            <div style="font-weight:bold;">
                ${module.name}
            </div>

            <div>
                ${module.teacher || ""}
            </div>

            <div>
                ${item.room || module.room || ""}
            </div>

            <div style="
                margin-top:4px;
                font-size:11px;
                color:#444;
            ">
                ${module.credit || 0} 學分
            </div>
        `;

        cell.appendChild(block);

    });

};
// ======================================================
// 匯出 PNG
// ======================================================

ExportImage.download = async function () {

    // 建立暫存容器
    const wrapper = document.createElement("div");

    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";

    wrapper.innerHTML = ExportImage.createHTML();

    document.body.appendChild(wrapper);

    const sheet = wrapper.querySelector("#export-sheet");

    // 填入課程
    ExportImage.fillCourses(sheet);

    // 轉圖片
    const canvas = await html2canvas(sheet, {

        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true

    });

    // 下載
    const link = document.createElement("a");

    link.download = "課表.png";

    link.href = canvas.toDataURL("image/png");

    link.click();

    wrapper.remove();

};

// ======================================================
// 初始化
// ======================================================

ExportImage.init = function () {

    const btn = document.getElementById("exportImageBtn");

    if (!btn)
        return;

    btn.addEventListener("click", () => {

        ExportImage.download();

    });

};

window.addEventListener("load", () => {

    ExportImage.init();

});
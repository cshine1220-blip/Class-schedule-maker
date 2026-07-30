// ======================================================
// ui.js V2
// ======================================================

const UI = {

    init() {

        this.bindToolbar();

        this.bindSearch();

        this.bindKeyboard();

    },

    //==================================================
    // 工具列
    //==================================================

    bindToolbar() {

        const addBtn = document.getElementById("addCourseBtn");
        const exportBtn = document.getElementById("exportBtn");
        const importBtn = document.getElementById("importJsonBtn");
        const excelBtn = document.getElementById("importExcelBtn");
        const clearBtn = document.getElementById("clearBtn");

        if(addBtn){

            addBtn.addEventListener("click",()=>{

                openCreateModal();

            });

        }

        if(exportBtn){

            exportBtn.addEventListener("click",()=>{

                showExportMenu();

            });

        }

        if(importBtn){

            importBtn.addEventListener("click",()=>{

                document.getElementById("jsonInput").click();

            });

        }

        if(excelBtn){

            excelBtn.addEventListener("click",()=>{

                document.getElementById("excelInput").click();

            });

        }

        if(clearBtn){

            clearBtn.addEventListener("click",()=>{

                if(!confirm("確定清空整個課表？"))
                    return;

                App.timetable=[];

                saveData();

                createTimetable();

                renderTimetable();

            });

        }

    },

    //==================================================
    // 搜尋
    //==================================================

    bindSearch(){

        const input=document.getElementById("searchInput");

        if(!input)
            return;

        input.addEventListener("input",()=>{

            renderModules(

                input.value

            );

        });

    },

    //==================================================
    // 快捷鍵
    //==================================================

    bindKeyboard(){

        document.addEventListener("keydown",e=>{

            //--------------------------------

            if(e.ctrlKey && e.key==="n"){

                e.preventDefault();

                openCreateModal();

            }

            //--------------------------------

            if(e.ctrlKey && e.key==="s"){

                e.preventDefault();

                saveData();

                alert("已儲存");

            }

            //--------------------------------

            if(e.key==="Escape"){

                closeModal();

            }

            //--------------------------------

            if(e.ctrlKey && e.key==="f"){

                e.preventDefault();

                const input=document.getElementById(

                    "searchInput"

                );

                if(input){

                    input.focus();

                    input.select();

                }

            }

        });

    }

};

// ======================================================
// 通知
// ======================================================

function toast(message){

    let toast=document.getElementById("toast");

    if(!toast){

        toast=document.createElement("div");

        toast.id="toast";

        toast.style.position="fixed";
        toast.style.bottom="20px";
        toast.style.right="20px";
        toast.style.padding="12px 20px";
        toast.style.background="#333";
        toast.style.color="#fff";
        toast.style.borderRadius="8px";
        toast.style.zIndex="9999";
        toast.style.opacity="0";

        toast.style.transition=".3s";

        document.body.appendChild(toast);

    }

    toast.textContent=message;

    toast.style.opacity="1";

    setTimeout(()=>{

        toast.style.opacity="0";

    },2000);

}

// ======================================================
// Loading
// ======================================================

function showLoading(){

    document.body.style.cursor="wait";

}

function hideLoading(){

    document.body.style.cursor="default";

}

// ======================================================
// 初始化
// ======================================================

window.addEventListener("load",()=>{

    UI.init();

});
const deleteAllBtn = document.getElementById(
    "deleteAllModulesBtn"
);

if(deleteAllBtn){

    deleteAllBtn.addEventListener("click",()=>{

        deleteAllModules();

    });

}
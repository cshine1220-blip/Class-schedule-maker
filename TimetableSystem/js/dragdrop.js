// ======================================================
// dragdrop.js V2
// ======================================================

const DragManager = {

    currentModule: null,

    moveCourse: null,

    //=========================================
    // 從左側課程拖曳
    //=========================================

    start(moduleId){

        this.currentModule = moduleId;

        this.moveCourse = null;

    },

    //=========================================
    // 從課表拖曳
    //=========================================

    startMove(day,period){

        this.currentModule = null;

        this.moveCourse = {

            day,

            period

        };

    },

    //=========================================
    // 結束拖曳
    //=========================================

    end(){

        this.currentModule = null;

        this.moveCourse = null;

    },

    //=========================================
    // 放下
    //=========================================

    drop(day,period){

        //--------------------------------------
        // 移動課程
        //--------------------------------------

        if(this.moveCourse){

            moveCourseTo(

                this.moveCourse.day,

                this.moveCourse.period,

                day,

                period

            );

            return;

        }

        //--------------------------------------
        // 新增課程
        //--------------------------------------

        if(this.currentModule!=null){

            addCourseTo(

                this.currentModule,

                day,

                period

            );

        }

    }

};

// ======================================================
// 新增到課表
// ======================================================

function addCourseTo(moduleId,day,period){

    const exist=App.timetable.find(c=>

        c.day==day &&

        c.period==period

    );

    if(exist){

        alert("此節已有課程");

        return;

    }

    App.timetable.push({

        moduleId,

        day,

        period

    });

    saveData();

    renderCell(day,period);

}
// ======================================================
// 移動課程
// ======================================================

function moveCourseTo(oldDay, oldPeriod, newDay, newPeriod){

    if(oldDay==newDay && oldPeriod==newPeriod)
        return;

    const source=App.timetable.find(course=>

        course.day==oldDay &&
        course.period==oldPeriod

    );

    if(!source)
        return;

    const target=App.timetable.find(course=>

        course.day==newDay &&
        course.period==newPeriod

    );

    //---------------------------------------
    // 有課程 → 交換
    //---------------------------------------

    if(target){

        const tempDay=target.day;
        const tempPeriod=target.period;

        target.day=source.day;
        target.period=source.period;

        source.day=tempDay;
        source.period=tempPeriod;

    }

    //---------------------------------------
    // 沒課程 → 直接移動
    //---------------------------------------

    else{

        source.day=newDay;
        source.period=newPeriod;

    }

    saveData();

    createTimetable();

    renderTimetable();

}

// ======================================================
// 初始化所有格子的拖曳事件
// ======================================================

function bindDropEvents(){

    document.querySelectorAll(".course-cell").forEach(cell=>{

        cell.addEventListener("dragover",e=>{

            e.preventDefault();

            cell.classList.add("drag-over");

        });

        cell.addEventListener("dragleave",()=>{

            cell.classList.remove("drag-over");

        });

        cell.addEventListener("drop",()=>{

            cell.classList.remove("drag-over");

            DragManager.drop(

                Number(cell.dataset.day),

                Number(cell.dataset.period)

            );

        });

    });

}

// ======================================================
// 重新初始化
// ======================================================

function refreshDragDrop(){

    bindDropEvents();

}

// ======================================================
// dragdrop.js V2 End
// ======================================================
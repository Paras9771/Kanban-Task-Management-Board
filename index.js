// ----------------------- Kanban Board : Todo / Progress / Completed ----------------------------- //

const taskaddbutton = document.querySelector('.btn-add-tast');

const todolist = document.querySelector('.box1');
const counttask = todolist.querySelector('.Number');

const progessbox = document.querySelector('.box2');
const progesscount = progessbox.querySelector('.Number');

const completedbox = document.querySelector('.box3');
const completedcount = completedbox.querySelector('.Number');


// ----------------------- Task Card Banane ka Function ----------------------------- //

function createTask(taskname, status, priority, createdAt) {
    // default values agar load ke time missing ho
    if (!priority) priority = 'low';
    if (!createdAt) createdAt = new Date().toLocaleString();

    // ---- Task card
    const taskadd = document.createElement("div");
    taskadd.classList.add("task");
    taskadd.dataset.priority = priority;
    taskadd.dataset.createdAt = createdAt;

    const tasktext = document.createElement("p");
    tasktext.textContent = taskname;

    // ---- Meta info (Priority + Created time)
    const taskmeta = document.createElement("span");
    taskmeta.classList.add("task-meta");

    let priorityLabel = priority.toUpperCase();
    taskmeta.textContent = `Priority: ${priorityLabel} • Created: ${createdAt}`;

    // Priority color class
    taskmeta.classList.add(`priority-${priority}`);

    // ---- Buttons container (for better layout)
    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("task-buttons");

    // ---- Delete button
    const deletebutton = document.createElement("button");
    deletebutton.textContent = "Delete";
    deletebutton.classList.add("delete-btn");

    // ---- Edit button
    const editbutton = document.createElement("button");
    editbutton.textContent = "Edit";
    editbutton.classList.add("edit-btn");

    // ---- Move button (To Do → Progress)
    const movebutton = document.createElement("button");
    movebutton.textContent = "Move →";
    movebutton.classList.add("move-btn");

    // ---- Complete button (Progress → Completed)
    const completebutton = document.createElement("button");
    completebutton.textContent = "Complete";
    completebutton.classList.add("complete-btn");

    // ---------------- Delete button ka kaam (Confirm + count) ---------------- //
    deletebutton.onclick = function () {
        const sure = confirm("Are you sure you want to delete this task?");
        if (!sure) return;

        const parent = taskadd.parentElement;

        if (parent === todolist) {
            let count = Number(counttask.textContent);
            counttask.textContent = count - 1;
        } else if (parent === progessbox) {
            let pcount = Number(progesscount.textContent);
            progesscount.textContent = pcount - 1;
        } else if (parent === completedbox) {
            let ccount = Number(completedcount.textContent);
            completedcount.textContent = ccount - 1;
        }

        taskadd.remove();
        saveTasks();
    };

    // ---------------- Edit button ka kaam (name + priority change) ---------------- //
    editbutton.onclick = function () {
        const newName = prompt("Edit your task name:", tasktext.textContent);
        if (!newName) return;

        const newPriorityInput = prompt("Edit Priority (low / medium / high):", priority);
        let newPriority = (newPriorityInput || "").toLowerCase();

        if (newPriority !== "low" && newPriority !== "medium" && newPriority !== "high") {
            newPriority = priority; // agar galat input diya to purani priority rakho
        }

        tasktext.textContent = newName;
        taskadd.dataset.priority = newPriority;

        // meta text update
        let pLabel = newPriority.toUpperCase();
        taskmeta.textContent = `Priority: ${pLabel} • Created: ${taskadd.dataset.createdAt}`;

        // priority color class update
        taskmeta.classList.remove("priority-low", "priority-medium", "priority-high");
        taskmeta.classList.add(`priority-${newPriority}`);

        saveTasks();
    };

    // ---------------- Move button ka kaam (Todo se Progress) ---------------- //
    movebutton.onclick = function () {
        const parent = taskadd.parentElement;

        if (parent === todolist) {
            let todocount = Number(counttask.textContent);
            let procount = Number(progesscount.textContent);

            counttask.textContent = todocount - 1;
            progesscount.textContent = procount + 1;

            progessbox.appendChild(taskadd);

            // Todo wala Move hatao, Progress wala Complete dikhao
            movebutton.remove();
            buttonWrapper.appendChild(completebutton);

            saveTasks();
        }
    };

    // ---------------- Complete button ka kaam (Progress se Completed) ---------------- //
    completebutton.onclick = function () {
        const parentNow = taskadd.parentElement;

        if (parentNow === progessbox) {
            let pcount2 = Number(progesscount.textContent);
            let ccount2 = Number(completedcount.textContent);

            progesscount.textContent = pcount2 - 1;
            completedcount.textContent = ccount2 + 1;

            completedbox.appendChild(taskadd);

            // Completed me aake Complete button hata do (optional)
            completebutton.remove();

            saveTasks();
        }
    };

    // ---- Card ke andar sab add karo
    taskadd.appendChild(tasktext);
    taskadd.appendChild(taskmeta);

    buttonWrapper.appendChild(editbutton);
    buttonWrapper.appendChild(deletebutton);

    // Status ke hisaab se buttons / column decide
    if (status === 'todo') {
        buttonWrapper.appendChild(movebutton);
        todolist.appendChild(taskadd);

        let count = Number(counttask.textContent);
        counttask.textContent = count + 1;
    } else if (status === 'progress') {
        buttonWrapper.appendChild(completebutton);
        progessbox.appendChild(taskadd);

        let pcount = Number(progesscount.textContent);
        progesscount.textContent = pcount + 1;
    } else if (status === 'completed') {
        completedbox.appendChild(taskadd);

        let ccount = Number(completedcount.textContent);
        completedcount.textContent = ccount + 1;
    }

    taskadd.appendChild(buttonWrapper);

    saveTasks(); // har change ke baad data save
}



// ----------------------- Add Task Button ka Function ----------------------------- //

function addtask() {
    const taskname = prompt("Add your Task here");
    if (!taskname) return;

    let priority = prompt("Set Priority (low / medium / high):", "low");
    priority = (priority || "").toLowerCase();

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
        priority = "low";
    }

    const createdAt = new Date().toLocaleString();

    // Naya task hamesha Todo me jayega
    createTask(taskname, 'todo', priority, createdAt);
}

if (taskaddbutton) {
    taskaddbutton.onclick = addtask;
}



// ----------------------- Local Storage : Save & Load ----------------------------- //

function saveTasks() {
    const allTasks = [];

    // Todo tasks
    const todoTasks = todolist.querySelectorAll('.task');
    todoTasks.forEach(task => {
        const name = task.querySelector('p').textContent;
        const priority = task.dataset.priority || 'low';
        const createdAt = task.dataset.createdAt || "";
        allTasks.push({ name: name, status: 'todo', priority: priority, createdAt: createdAt });
    });

    // Progress tasks
    const progressTasks = progessbox.querySelectorAll('.task');
    progressTasks.forEach(task => {
        const name = task.querySelector('p').textContent;
        const priority = task.dataset.priority || 'low';
        const createdAt = task.dataset.createdAt || "";
        allTasks.push({ name: name, status: 'progress', priority: priority, createdAt: createdAt });
    });

    // Completed tasks
    const completedTasks = completedbox.querySelectorAll('.task');
    completedTasks.forEach(task => {
        const name = task.querySelector('p').textContent;
        const priority = task.dataset.priority || 'low';
        const createdAt = task.dataset.createdAt || "";
        allTasks.push({ name: name, status: 'completed', priority: priority, createdAt: createdAt });
    });

    localStorage.setItem('kanbanTasks', JSON.stringify(allTasks));
}

function loadTasks() {
    const data = localStorage.getItem('kanbanTasks');
    if (!data) return;

    // Purane tasks / counts clear karo
    todolist.querySelectorAll('.task').forEach(t => t.remove());
    progessbox.querySelectorAll('.task').forEach(t => t.remove());
    completedbox.querySelectorAll('.task').forEach(t => t.remove());

    counttask.textContent = "0";
    progesscount.textContent = "0";
    completedcount.textContent = "0";

    const tasks = JSON.parse(data);

    tasks.forEach(item => {
        createTask(item.name, item.status, item.priority, item.createdAt);
    });
}

// Page load hote hi localStorage se data uthao
loadTasks();

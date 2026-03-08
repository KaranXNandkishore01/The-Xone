export const initTasks = () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const activeTasksList = document.getElementById('active-tasks');
    const completedTasksList = document.getElementById('completed-tasks');

    // Local state - load from localStorage if exists
    let tasks = [];
    try {
        const saved = localStorage.getItem('karansZoneTasks');
        if (saved) tasks = JSON.parse(saved);
    } catch (e) {
        console.error('Failed to load tasks', e);
    }

    const saveTasks = () => {
        localStorage.setItem('karansZoneTasks', JSON.stringify(tasks));
        // Dispatch custom event to notify report section
        document.dispatchEvent(new Event('tasksUpdated'));
    };

    const renderTasks = () => {
        activeTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = task.text;

            const btnGroup = document.createElement('div');

            if (!task.completed) {
                const completeBtn = document.createElement('button');
                completeBtn.className = 'action-btn';
                completeBtn.innerHTML = '✔';
                completeBtn.onclick = (e) => {
                    e.stopPropagation();
                    completeTask(task.id);
                };
                btnGroup.appendChild(completeBtn);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete';
            deleteBtn.innerHTML = '✖';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            };
            btnGroup.appendChild(deleteBtn);

            li.appendChild(textSpan);
            li.appendChild(btnGroup);

            // Click on text also completes it if active
            li.addEventListener('click', () => {
                if (!task.completed) completeTask(task.id);
            });

            if (task.completed) {
                completedTasksList.appendChild(li);
            } else {
                activeTasksList.appendChild(li);
            }
        });
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        if (!text) return;

        // Store task with timestamp for daily tracking
        const newTask = {
            id: Date.now(),
            text,
            completed: false,
            date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
        };

        tasks.unshift(newTask); // add to top
        taskInput.value = '';
        saveTasks();
        renderTasks();
    };

    const completeTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = true;
            task.completedDate = new Date().toISOString().split('T')[0];
            saveTasks();
            renderTasks();
        }
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    };

    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Initial render setup
    renderTasks();
};

export const getTaskStats = () => {
    let tasks = [];
    try {
        const saved = localStorage.getItem('karansZoneTasks');
        if (saved) tasks = JSON.parse(saved);
    } catch (e) { }
    return tasks;
};

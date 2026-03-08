import { getTaskStats } from './tasks.js';

export const initReport = () => {
    const totalTasksEl = document.getElementById('total-tasks-stat');
    const completedTasksEl = document.getElementById('completed-tasks-stat');
    const completionRateEl = document.getElementById('completion-rate-stat');
    const weeklyChartEl = document.getElementById('weekly-chart');

    const updateReport = () => {
        const tasks = getTaskStats();

        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        completionRateEl.textContent = `${rate}%`;

        // Generate Weekly Chart (Last 7 Days)
        weeklyChartEl.innerHTML = '';

        const today = new Date();
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push(d.toISOString().split('T')[0]);
        }

        // Count tasks per day
        const MaxHeightPx = 150;
        let maxTasksInDay = 1; // to normalize chart height

        const dailyCounts = last7Days.map(dateStr => {
            // Find tasks created or completed on this day
            const count = tasks.filter(t => t.date === dateStr || t.completedDate === dateStr).length;
            if (count > maxTasksInDay) maxTasksInDay = count;
            return { date: dateStr, count };
        });

        // Render bars
        dailyCounts.forEach(day => {
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-bar-container';

            const bar = document.createElement('div');
            bar.className = 'chart-bar';

            const heightPercentage = Math.max((day.count / maxTasksInDay) * 100, 2); // At least 2% to show it exists
            // Apply slight delay for animation effect
            setTimeout(() => {
                bar.style.height = `${day.count === 0 ? 4 : (heightPercentage / 100) * MaxHeightPx}px`;
            }, 100);

            const label = document.createElement('span');
            label.className = 'chart-label';
            // Format as "Mon", "Tue", etc
            const d = new Date(day.date);
            label.textContent = d.toLocaleDateString('en-US', { weekday: 'short' });

            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            weeklyChartEl.appendChild(barContainer);
        });
    };

    // Initial update
    updateReport();

    // Listen for task updates
    document.addEventListener('tasksUpdated', updateReport);
};

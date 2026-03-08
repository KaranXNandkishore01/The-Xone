import { initWebGL } from './webgl.js';
import { initTimer } from './timer.js';
import { initTasks } from './tasks.js';
import { initReport } from './report.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize background
    initWebGL();

    // Initialize feature modules
    initTimer();
    initTasks();
    initReport();

    // Handle Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active from all nav items and sections
            navItems.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active to clicked nav and corresponding section
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Handle 5-Star Rating
    const stars = document.querySelectorAll('.star');
    const ratingFeedback = document.getElementById('rating-feedback');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', function () {
            const val = this.getAttribute('data-value');
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= val) {
                    s.classList.add('hovered');
                } else {
                    s.classList.remove('hovered');
                }
            });
        });

        star.addEventListener('mouseout', function () {
            stars.forEach(s => s.classList.remove('hovered'));
        });

        star.addEventListener('click', function () {
            currentRating = this.getAttribute('data-value');

            stars.forEach(s => {
                if (s.getAttribute('data-value') <= currentRating) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });

            const messages = [
                "We'll do better! 🚀",
                "Thanks for the feedback! 🛠️",
                "Glad you like it! 😊",
                "Awesome! You're in the zone! 🔥",
                "Absolutely Futuristic! 🛸 Thank you!"
            ];
            ratingFeedback.textContent = messages[currentRating - 1];
        });
    });
});

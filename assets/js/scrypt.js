
// Word lists for animated text
const wordList1 = ["Flag.", "Purpose."];
const wordList2 = ["Live", "Explore", "Transform"];
const colorList2 = ["#1CB5CE", "#FCC100", "#A8599E", "#000000"];

// Get elements for animation
const el1 = document.getElementById("altWord1");
const el2 = document.getElementById("altWord2");

// Typing effect function for animated words
function typeEffect(element, words, index, delay = 150, colorList = null) {
    let word = words[index];
    let charIndex = 0;
    let isDeleting = false;

    // Set color if colorList is provided
    if (colorList) {
        element.style.color = colorList[index % colorList.length];
    }

    function type() {
        const currentText = word.substring(0, charIndex);
        element.textContent = currentText;

        if (!isDeleting && charIndex < word.length) {
            charIndex++;
            setTimeout(type, delay);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, delay / 2);
        } else {
            if (!isDeleting) {
                isDeleting = true;
                setTimeout(type, 1000);
            } else {
                isDeleting = false;
                index = (index + 1) % words.length;
                word = words[index];
                charIndex = 0;
                // Set color for the new word
                if (colorList) {
                    element.style.color = colorList[index % colorList.length];
                }
                setTimeout(() => typeEffect(element, words, index, delay, colorList), 500);
            }
        }
    }

    type();
}

// Counter animation function
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const target = +counter.getAttribute('data-target');
        const isDecimal = counter.getAttribute('data-decimal') === "true";
        let text = counter.innerText;
        if (prefix) text = text.replace(prefix, '');
        if (suffix) text = text.replace(suffix, '');
        let count = isDecimal ? parseFloat(text) : parseInt(text, 10);
        if (isNaN(count)) count = 0;
        const increment = isDecimal ? (target / 100) : Math.ceil(target / 100);

        function updateCount() {
            if (count < target) {
                count = isDecimal
                    ? (count + increment > target ? target : (count + increment))
                    : Math.min(count + increment, target);
                counter.innerText = `${prefix}${isDecimal ? count.toFixed(1) : count}${suffix}`;
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = `${prefix}${isDecimal ? target.toFixed(1) : target}${suffix}`;
            }
        }
        updateCount();
    });
}

// Reset counters to 0 (or 0.0 for decimals)
function resetCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const isDecimal = counter.getAttribute('data-decimal') === "true";
        counter.innerText = `${prefix}${isDecimal ? '0.0' : '0'}${suffix}`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Start typing effects for animated words
    typeEffect(el1, wordList1, 0);
    typeEffect(el2, wordList2, 0, 150, colorList2);

    // Intersection Observer for statistics section
    let statsStarted = false;
    const statsSection = document.getElementById('statistics-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!statsStarted) {
                        animateCounters();
                        statsStarted = true;
                    }
                } else {
                    resetCounters();
                    statsStarted = false;
                }
            });
        }, { threshold: 0.3 }); // 30% visible triggers the animation
        observer.observe(statsSection);
    }
});

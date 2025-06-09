document.addEventListener('DOMContentLoaded', () => {
    const addAssignmentButton = document.getElementById('addAssignment');
    const assignmentNameInput = document.getElementById('assignmentName');
    const assignmentGradeInput = document.getElementById('assignmentGrade');
    const assignmentsList = document.getElementById('assignmentsList');
    const gpaDisplay = document.getElementById('gpa');

    let entries = [];

    loadFromLocalStorage();

    addAssignmentButton.addEventListener('click', addAssignment);

    document.addEventListener('keydown', (event) => {
        if (event.key === 's' || event.key === 'S') {
            console.log(entries);
        }
    });

    function addAssignment() {
        const name = assignmentNameInput.value.trim();
        const grade = parseFloat(assignmentGradeInput.value);

        if (name && !isNaN(grade) && grade >= 0 && grade <= 5) {
            entries.push({ name, grade });
            saveToLocalStorage();
            renderEntries();
            calculateGPA();

            assignmentNameInput.value = '';
            assignmentGradeInput.value = '';
        }
    }

    function renderEntries() {
        assignmentsList.innerHTML = '';
        entries.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'entry';
            entryElement.innerHTML = `
                <span>${entry.name}: ${entry.grade}</span>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;
            assignmentsList.appendChild(entryElement);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteAssignment(index);
            });
        });
    }

    function deleteAssignment(index) {
        entries.splice(index, 1);
        saveToLocalStorage();
        renderEntries();
        calculateGPA();
    }

    function calculateGPA() {
        if (entries.length === 0) {
            gpaDisplay.textContent = '0.00';
            return;
        }

        const total = entries.reduce((sum, entry) => sum + entry.grade, 0);
        const gpa = total / entries.length;
        gpaDisplay.textContent = gpa.toFixed(2);
    }

    function saveToLocalStorage() {
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    function loadFromLocalStorage() {
        const savedEntries = localStorage.getItem('entries');
        if (savedEntries) {
            entries = JSON.parse(savedEntries);
            renderEntries();
            calculateGPA();
        }
    }
});

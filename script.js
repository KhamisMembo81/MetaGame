// ===== gamer-address.js =====
// PURE BASE JAVASCRIPT – no external dependencies, no font awesome
// Uses emoji icons from base HTML/CSS

// ---------- DATA ----------
let quests = JSON.parse(localStorage.getItem('gamerQuestLog')) || [];

// ---------- DOM ELEMENTS ----------
const gameInput = document.getElementById('gameInput');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const timeInput = document.getElementById('timeInput');
const addBtn = document.getElementById('addQuestBtn');
const questContainer = document.getElementById('questContainer');
const emptyMsg = document.getElementById('emptyMessage');
const questCounter = document.getElementById('questCounter');

// ---------- HELPER: ESCAPE HTML (XSS protection) ----------
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ---------- RENDER ALL QUESTS ----------
function renderQuests() {
    // Clear container
    questContainer.innerHTML = '';

    if (quests.length === 0) {
        emptyMsg.style.display = 'block';
        questContainer.style.display = 'none';
    } else {
        emptyMsg.style.display = 'none';
        questContainer.style.display = 'grid';

        quests.forEach((quest, index) => {
            const card = document.createElement('div');
            card.className = 'quest-card';

            // Priority styling and icons (base emoji)
            let priorityClass = '';
            let priorityIcon = '';
            if (quest.priority === 'High') {
                priorityClass = 'priority-high';
                
            } else if (quest.priority === 'mid') {
                priorityClass = 'priority-medium';
                priorityIcon = '⚡';
            } else {
                priorityClass = 'priority-low';
                priorityIcon = '🌿';
            }

            // Escape user content
            const safeGame = escapeHTML(quest.game);
            const safeTask = escapeHTML(quest.task);
            const safeTime = escapeHTML(quest.time && quest.time !== '—' ? quest.time : '—');

            // Build card – all icons are plain text/emoji, no external deps
            card.innerHTML = `
                <div class="quest-header">
                    <span class="game-tag"><span>🎮</span> ${safeGame}</span>
                    <span class="priority-badge ${priorityClass}">${priorityIcon} ${quest.priority}</span>
                </div>
                <div class="quest-body">
                    <span class="quest-task"><span>🎯</span> ${safeTask}</span>
                </div>
                <div class="quest-footer">
                    <span class="time-due"><span></span> ${safeTime}</span>
                    <button class="delete-btn" data-index="${index}"><span></span> delete</button>
                </div>
            `;

            questContainer.appendChild(card);
        });

        // Attach delete events
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = this.getAttribute('data-index');
                if (index !== null) deleteQuest(parseInt(index));
            });
        });
    }

    // Update counter
    const entryWord = quests.length === 1 ? 'entry' : 'entries';
    questCounter.textContent = ` ${quests.length} ${entryWord}`;
    
    // Persist
    localStorage.setItem('gamerQuestLog', JSON.stringify(quests));
}

// ---------- ADD NEW QUEST ----------
function addQuest() {
    const game = gameInput.value.trim();
    const task = taskInput.value.trim();
    const priority = prioritySelect.value;
    const time = timeInput.value.trim();

    if (!game) {
        alert('⚠️ Enter a game name!');
        gameInput.focus();
        return;
    }
    if (!task) {
        alert('⚠️ Enter a task!');
        taskInput.focus();
        return;
    }

    const newQuest = {
        game: game,
        task: task,
        priority: priority,
        time: time || '—'
    };

    quests.push(newQuest);
    renderQuests();

    // Clear inputs
    gameInput.value = '';
    taskInput.value = '';
    prioritySelect.value = 'Medium';
    timeInput.value = '';

    gameInput.focus();
}

// ---------- DELETE QUEST ----------
function deleteQuest(index) {
    if (index >= 0 && index < quests.length) {
        quests.splice(index, 1);
        renderQuests();
    }
}

// ---------- EVENT LISTENERS ----------
addBtn.addEventListener('click', addQuest);

// Enter key support
const enterFields = [gameInput, taskInput, timeInput, prioritySelect];
enterFields.forEach(field => {
    field.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addQuest();
        }
    });
});

// ---------- INITIAL RENDER ----------
renderQuests();
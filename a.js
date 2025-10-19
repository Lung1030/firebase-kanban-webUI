// --- 步驟 1: Firebase 初始化 ---
// 你的 Firebase 設定 (來自你的檔案) [cite: uploaded:a.js]
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // 貼上你的 apiKey
  authDomain: "YOUR_AUTH_DOMAIN", // 貼上你的 authDomain
  projectId: "YOUR_PROJECT_ID", // 貼上你的 projectId
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 取得 Firebase 服務的引用，方便後續呼叫
const auth = firebase.auth();
const db = firebase.firestore();

// --- 步驟 2: 取得 HTML 元素 ---
const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const authError = document.getElementById('auth-error');
const userInfo = document.getElementById('user-info');
const addTaskForm = document.querySelector('.add-task-form');
const taskTitleInput = document.getElementById('task-title-input');
const todoCardsContainer = document.getElementById('todo-cards');
const inprogressCardsContainer = document.getElementById('inprogress-cards');
const doneCardsContainer = document.getElementById('done-cards');

// ★ 新增功能：取得教學相關的元素
const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialTooltip = document.getElementById('tutorial-tooltip');
const tutorialCloseBtn = document.getElementById('tutorial-close-btn');

let currentUser = null; 
let unsubscribe = null;

// --- 步驟 3: 驗證邏輯 ---

registerBtn.addEventListener('click', async () => {
    try {
        const email = emailInput.value;
        await auth.createUserWithEmailAndPassword(email, passwordInput.value);
        authError.textContent = '';
        localStorage.setItem('rememberedEmail', email);
    } catch (error) {
        authError.textContent = `註冊失敗：${error.message}`;
    }
});

loginBtn.addEventListener('click', async () => {
    try {
        const email = emailInput.value;
        await auth.signInWithEmailAndPassword(email, passwordInput.value);
        authError.textContent = '';
        localStorage.setItem('rememberedEmail', email);
    } catch (error) {
        authError.textContent = `登入失敗：${error.message}`;
    }
});

logoutBtn.addEventListener('click', () => auth.signOut());

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        authContainer.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        userInfo.textContent = `你好, ${user.email}`;
        listenToTasks();
    } else {
        currentUser = null;
        authContainer.classList.remove('hidden');
        mainContainer.classList.add('hidden');
        userInfo.textContent = '';
        if (unsubscribe) unsubscribe();
        clearAllTasks();
    }
});

function checkRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) emailInput.value = rememberedEmail;
}
document.addEventListener('DOMContentLoaded', checkRememberedUser);

// --- 步驟 4: Firestore 資料庫邏輯 (CRUD) ---

addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    if (title && currentUser) {
        try {
            await db.collection('tasks').add({
                title: title,
                status: 'todo',
                userId: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            taskTitleInput.value = '';
        } catch (error) {
            console.error('新增任務失敗:', error);
        }
    }
});

function listenToTasks() {
    if (unsubscribe) unsubscribe();

    unsubscribe = db.collection('tasks')
        .where('userId', '==', currentUser.uid)
        .onSnapshot(snapshot => {
            // ★ 新增功能：教學觸發邏輯
            // 檢查這是不是使用者 DB 裡的第一筆任務，且教學沒顯示過
            if (snapshot.docs.length === 1 && !localStorage.getItem('tutorialShown')) {
                const firstTask = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
                clearAllTasks();
                renderTask(firstTask); // 先渲染唯一的卡片
                showDragTutorial(firstTask.id); // 然後觸發教學
            } else {
                // 正常渲染所有卡片
                clearAllTasks();
                snapshot.forEach(doc => {
                    const task = { id: doc.id, ...doc.data() };
                    renderTask(task);
                });
            }
        }, error => {
            console.error("監聽任務時發生錯誤:", error);
        });
}

function renderTask(task) {
    const taskCard = document.createElement('div');
    taskCard.id = task.id;
    taskCard.className = 'task-card';
    taskCard.draggable = true;
    taskCard.innerHTML = `
        <span class="task-card-title">${task.title}</span>
        <button class="delete-task-btn">✖</button>
    `;

    taskCard.querySelector('.delete-task-btn').addEventListener('click', async () => {
        if (confirm(`確定要刪除任務 "${task.title}" 嗎？`)) {
            try {
                await db.collection('tasks').doc(task.id).delete();
            } catch (error) {
                console.error('刪除任務失敗:', error);
            }
        }
    });
    
    taskCard.addEventListener('dragstart', handleDragStart);

    const container = task.status === 'todo' ? todoCardsContainer : 
                      task.status === 'inprogress' ? inprogressCardsContainer : 
                      doneCardsContainer;
    container.appendChild(taskCard);
}

function clearAllTasks() {
    todoCardsContainer.innerHTML = '';
    inprogressCardsContainer.innerHTML = '';
    doneCardsContainer.innerHTML = '';
}

// --- 步驟 5: 拖曳功能 ---
let draggedCard = null;
function handleDragStart(e) {
    draggedCard = e.target;
    // 拖曳時，順便關閉可能還開著的教學提示
    closeTutorial(); 
    setTimeout(() => e.target.classList.add('dragging'), 0);
}
const columns = document.querySelectorAll('.task-cards-container');
columns.forEach(column => {
    column.addEventListener('dragover', e => e.preventDefault());
    column.addEventListener('drop', async e => {
        e.preventDefault();
        if (draggedCard) {
            draggedCard.classList.remove('dragging');
            const targetColumn = e.currentTarget.closest('.kanban-column');
            const newStatus = targetColumn.dataset.status;
            try {
                await db.collection('tasks').doc(draggedCard.id).update({ status: newStatus });
            } catch (error) {
                console.error('更新任務狀態失敗:', error);
            }
            draggedCard = null;
        }
    });
});

// --- ★ 新增功能：引導式教學的函式 ---
function showDragTutorial(taskId) {
    // 使用 setTimeout 確保 DOM 元素已經渲染完成
    setTimeout(() => {
        const firstCard = document.getElementById(taskId);
        if (!firstCard) return;

        // 取得卡片的位置，用來定位提示框
        const cardRect = firstCard.getBoundingClientRect();
        
        // 設定提示框的位置
        tutorialTooltip.style.left = `${cardRect.left}px`;
        tutorialTooltip.style.top = `${cardRect.bottom + 15}px`;

        // 顯示遮罩和提示框
        tutorialOverlay.classList.remove('hidden');
        firstCard.classList.add('tutorial-highlight');

        // 標記教學已顯示，避免重複觸發
        localStorage.setItem('tutorialShown', 'true');

    }, 200); // 延遲 200 毫秒
}

// 關閉教學的事件監聽
tutorialCloseBtn.addEventListener('click', closeTutorial);
tutorialOverlay.addEventListener('click', (e) => {
    // 確保點擊的是遮罩本身，而不是裡面的提示框
    if(e.target === tutorialOverlay) {
        closeTutorial();
    }
});

function closeTutorial() {
    // 檢查教學視窗是否已經是隱藏的，如果是就不用再執行
    if(tutorialOverlay.classList.contains('hidden')) {
        return;
    }

    tutorialOverlay.classList.add('hidden');
    // 找到被高亮的卡片並移除高亮效果
    const highlightedCard = document.querySelector('.tutorial-highlight');
    if (highlightedCard) {
        highlightedCard.classList.remove('tutorial-highlight');
    }
}



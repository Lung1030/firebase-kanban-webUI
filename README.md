# firebase-kanban-webUI

# 🔥 Firebase 即時任務看板 (Firebase Kanban Board)

這是一個使用 HTML, CSS, JavaScript (Vanilla JS) 搭配 Google Firebase 後端服務 (Authentication & Firestore) 所打造的 Trello 風格即時任務看板。使用者可以註冊/登入帳號，並對自己的任務進行新增、拖曳狀態更新及刪除等操作。


---

## 🚀 主要功能 (Features)

* **使用者驗證:**
    * 使用 Firebase Authentication 實現 Email/密碼註冊與登入功能。
    * 登入狀態監聽：使用 `onAuthStateChanged` 即時反應使用者登入/登出狀態，切換顯示介面。
    * 記住 Email：利用 `localStorage` 記住上次登入的 Email，提升使用者體驗。
* **即時資料庫 (Firestore):**
    * 任務 CRUD：使用者可以新增 (Create)、讀取 (Read)、更新 (Update - 透過拖曳)、刪除 (Delete) 自己的任務卡片。
    * 即時同步：使用 Firestore 的 `onSnapshot` 功能，看板上的任務會即時反應資料庫的變更，無需手動刷新。
    * 使用者隔離：查詢時使用 `.where('userId', '==', currentUser.uid)` 確保使用者只能看到自己的任務資料。
* **看板互動:**
    * 拖曳功能：支援使用 HTML Drag and Drop API 將任務卡片在「待處理」、「進行中」、「已完成」三個狀態欄位之間拖曳移動。
    * 拖曳更新狀態：卡片被拖曳到新的欄位時，會自動更新該任務在 Firestore 中的 `status` 欄位。
* **前端介面:**
    * 響應式設計：使用 CSS Grid 和 Media Queries 實現基本的響應式佈局，在不同螢幕尺寸下皆可正常瀏覽。
    * 現代化 UI：採用漸層背景搭配玻璃擬態 (Glassmorphism) 風格，提升視覺美觀度。

---

## 🛠️ 使用技術 (Tech Stack)

* **前端 (Frontend):**
    * HTML5
    * CSS3 (含 Flexbox, Grid, 玻璃擬態)
    * JavaScript (ES6+, Vanilla JS, DOM Manipulation, Fetch API 概念應用於 Firebase SDK)
* **後端即服務 (Backend as a Service - BaaS):**
    * **Google Firebase**
        * Firebase Authentication (Email/Password)
        * Cloud Firestore (NoSQL 即時資料庫)
* **部署 (Deployment):**
    * GitHub Pages (用於託管前端靜態檔案)

---

## 🏗️ 系統架構

本專案採用**前後端分離**的**無伺服器 (Serverless)** 架構：

1.  **前端 (Client-Side):**
    * 由 `index.html`, `style.css`, `a.js` 組成。
    * 部署在 **GitHub Pages** 上，提供靜態網頁服務。
    * 使用 Firebase JavaScript SDK 直接與 Firebase 後端服務溝通。
2.  **後端 (Backend - 由 Firebase 提供):**
    * **Firebase Authentication** 處理使用者註冊、登入、登出及狀態管理。
    * **Cloud Firestore** 作為 NoSQL 資料庫，儲存所有使用者的任務資料，並提供即時更新能力。

**流程示意圖:**

[使用者] <---> [前端 (GitHub Pages: HTML/CSS/JS)] <---> [Firebase (Auth & Firestore)]

---

## 🚀 如何在本機運行 (Optional)

## 🚀 如何在本機運行 (How to Run Locally)

1.  **Clone 儲存庫:**
    ```bash
    git clone [https://github.com/](https://github.com/)[你的GitHub帳號]/[你的儲存庫名稱].git
    cd [你的儲存庫名稱]
    ```

2.  **建立 Firebase 專案:**
    * 前往 [Firebase 控制台](https://console.firebase.google.com/) 並建立一個新的 Firebase 專案。

3.  **啟用所需服務:**
    * 在你的新 Firebase 專案中，啟用 **Authentication (驗證)** 服務，並選擇 **「電子郵件/密碼」** 作為登入方式。
    * 啟用 **Firestore Database (資料庫)** 服務，並選擇 **「在測試模式中啟動」** (方便本地開發)。

4.  **取得你的 Firebase 設定碼:**
    * 在你的 Firebase 專案設定中 (Project settings -> General -> Your apps)，找到並複製你的 Web 應用程式的 `firebaseConfig` 物件。它會長得像這樣：
        ```javascript
        const firebaseConfig = {
          apiKey: "AIz...",
          authDomain: "your-project-id.firebaseapp.com",
          projectId: "your-project-id",
          // ... 其他設定
        };
        ```

5.  **替換佔位符:**
    * 打開專案中的 `a.js` 檔案。
    * 找到檔案最上方的 `firebaseConfig` 物件。
    * 將裡面 `apiKey`, `authDomain`, `projectId` 等佔位符的值，**替換成你剛剛複製的、屬於你自己專案的實際金鑰**。

6.  **用瀏覽器開啟:**
    * 直接在你的檔案總管中，用瀏覽器開啟 `index.html` 檔案。
    * 現在你應該可以在本地成功運行這個任務看板了！

---

感謝你的瀏覽！

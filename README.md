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

1.  Clone 此儲存庫。
2.  在專案根目錄建立 `a.js` 檔案 (若不存在)。
3.  前往 [Firebase Console](https://console.firebase.google.com/) 建立你自己的 Firebase 專案。
4.  啟用 **Authentication (Email/Password)** 和 **Firestore Database (測試模式)** 服務。
5.  在你的 Firebase 專案設定中，找到 "將 Firebase 新增至你的網路應用程式" 的設定碼 (`firebaseConfig` 物件)。
6.  將你自己的 `firebaseConfig` 複製貼上到 `a.js` 檔案的最上方，取代預設的配置。
7.  直接用瀏覽器開啟 `index.html` 檔案即可。

---

感謝你的瀏覽！

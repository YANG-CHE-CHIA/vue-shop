# vue-shop 電商系統前端介面

使用 **Vue 3 + Vite + Tailwind CSS** 開發的響應式電商管理介面作品，著重於跨裝置 RWD 切版還原、元件化架構拆分與前後端 API 串接封裝。

## 🔗 線上預覽與原始碼

- **GitHub 原始碼**：[https://github.com/YANG-CHE-CHIA/vue-shop](https://github.com/YANG-CHE-CHIA/vue-shop)

> **⚠️ 線上環境 API 連線說明**  
> 本專案串接之外部測試後端僅提供 `HTTP` 協定端點。由於 Vercel 線上環境強制採用 `HTTPS` 載入，受限於瀏覽器的 **Mixed Content** 安全政策，線上預覽版本之登入與資料請求會被瀏覽器攔截，主要用於展示 **RWD 響應式切版與前端互動介面**。  

---

## 🛠 技術棧（Tech Stack）

- **前端框架**：Vue 3（Composition API）
- **建置工具**：Vite
- **樣式切版**：Tailwind CSS（RWD 跨裝置響應式佈局）
- **HTTP 請求**：Axios（封裝 Request / Response 攔截器、Token 驗證帶入、統一錯誤提示與環境 `baseURL` 切換）
- **部署與自動化**：Vercel / GitHub Actions（支援依建置環境動態切換 `base` 路徑）

---

## ✨ 專案亮點與實作重點

1. **響應式切版與模組化元件**：依照不同螢幕尺寸規劃桌機與行動裝置佈局，將共用 UI 與業務區塊拆分為獨立可維護的 Vue 元件。
2. **Axios 請求層統一封裝**：集中管理 API 基礎路徑（區分 `DEV` 與 `PROD` 環境），於攔截器中自動注入認證 `token`、處理 `blob` 回應格式及錯誤訊息提示。
3. **跨平台部署路徑相容**：透過 `vite.config.js` 偵測建置環境變數，同時相容 GitHub Pages 子目錄（`/vue-shop/`）。

---

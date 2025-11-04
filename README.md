# 🚀 Plagiarism Checker Pro  
### **AI-powered plagiarism detection and intelligent content optimization tool**

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

---

## ✨ Overview  
**Plagiarism Checker Pro** is an advanced **AI-driven web app** that scans text or PDF documents across multiple sources to detect plagiarism.  
It also provides **AI-powered rewriting**, **academic tone enhancement**, and **detailed similarity analysis** — making it ideal for students, researchers, and professionals.

---

## 🔍 Features  

### 🧠 **AI-Powered Plagiarism Detection**
- Multi-source scanning using **Google Custom Search API**
- Support for **text and PDF** file uploads  
- **Real-time similarity** percentage and sentence-level report  
- Smart comparison with **academic & web databases**

### 🤖 **AI Content Optimization**
- Hybrid AI system (**IBM Watsonx** + custom algorithms)  
- Automatic content rewriting for better originality  
- Academic style and readability improvement  
- Intelligent fallback mechanism for consistent performance

---

## 🛠️ Tech Stack  

| Layer | Technology |
|-------|-------------|
| **Backend** | Node.js, Express, Multer, PDF-parse |
| **Frontend** | HTML5, Tailwind CSS, JavaScript |
| **AI Services** | IBM Watsonx, Google Custom Search API |


## 🔑 API Configuration  

### 🧩 Google Custom Search  
1. Go to [Google Cloud Console](https://console.cloud.google.com/)  
2. Create a new project and enable **Custom Search API**  
3. Create a Search Engine at [Google CSE](https://cse.google.com/cse/all)  
4. Get your **API Key** and **Search Engine ID (CX)**  

### 🧠 IBM Watsonx  
1. Sign up at [IBM Cloud](https://cloud.ibm.com/)  
2. Create a **Watsonx AI service instance**  
3. Retrieve your **API Key** and **Project ID**

---

## 📦 Installation & Setup  

### 1️⃣ Clone & Install  

git clone https://github.com/your-username/plagiarism-checker-pro.git
cd plagiarism-checker-pro
npm install
2️⃣ Environment Setup

Create a .env file in your root directory:

PORT=3000
VITE_GOOGLE_AI_API_KEY=your_google_api_key
GOOGLE_CX=your_google_search_engine_id
WATSONX_API_KEY=your_ibm_watsonx_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id

3️⃣ Run the App
npm start

## 🔧 API Endpoints

| Method | Endpoint         | Description                         |
|---------|------------------|-------------------------------------|
| **POST** | `/api/check-text` | Check text content for plagiarism    |
| **POST** | `/api/upload-pdf` | Upload and scan PDF documents       |
| **POST** | `/api/fix-text`   | AI-powered rewriting and optimization |



## 📊 Result Interpretation

| Similarity % | Meaning     | Action                  |
|---------------|-------------|--------------------------|
| **0–10%**     | Excellent   | Very original            |
| **11–40%**    | Good        | Mostly original          |
| **41–75%**    | Moderate    | Review and refine        |
| **76–100%**   | High        | Major rewriting needed   |

💡 How to Use

Upload or paste your content

Click “Check Plagiarism” to scan it

View detailed results and similarity breakdown

Click “Fix with AI” to generate improved, plagiarism-free content

Copy & use your refined version instantly

🧩 Future Enhancements

✍️ Browser Extension for quick content checking

🧾 Multi-language plagiarism support

📈 Plagiarism history dashboard

🌐 Integration with Google Docs & MS Word

📜 License

This project is licensed under the MIT License — feel free to use, modify, and share it.

👨‍💻 Author

Tanuj Jain
tanujjain1546@gmail.com

# ECM Guardian

## Smart Energy Machine Monitoring System for SMEs

ECM Guardian is a smart machine monitoring system designed for Small and Medium-sized Enterprises (SMEs).

The system monitors machine parameters, identifies machine conditions, displays monitoring status, records alerts, and sends email notifications when critical conditions are detected.

---

## 🚀 Live Application

**Frontend:**  
https://ecm-guardian-main.vercel.app

**Email Alert Backend:**  
https://ecm-mail-backend.vercel.app

**GitHub Repository:**  
https://github.com/manimaran0024/smart-energy-machine-monitoring

---

## ✨ Features

- Real-time machine monitoring
- Machine parameter monitoring
- Safe status detection
- Warning status detection
- Critical status detection
- Critical machine alerts
- Email notifications
- Alert history
- Machine performance monitoring
- Weekly performance reports
- PDF report generation
- Responsive dashboard
- Modern web interface

---

## 🟢 Machine Status

### Safe

The machine parameters are within the configured safe limits.

### Warning

The machine parameters are approaching configured limits and require attention.

### Critical

The machine parameters exceed the configured critical limits.

When a critical condition is detected, the system can generate an alert and send an email notification.

---

## 📧 Email Alert System

ECM Guardian uses a separate Node.js and Express backend for sending alert emails.

### Backend Location

```text
ecm-mail-backend/
```

### API Endpoint

```text
POST /send-alert
```

### Example Request

```json
{
  "to": "recipient@example.com",
  "subject": "ECM CRITICAL ALERT",
  "text": "Critical machine condition detected."
}
```

The frontend connects to the email backend using the environment variable:

```text
VITE_ALERT_BACKEND_URL
```

Production backend:

```text
https://ecm-mail-backend.vercel.app
```

Local backend:

```text
http://localhost:8000
```

---

## 🏗️ Project Structure

```text
smart-energy-machine-monitoring/
│
├── src/
│   ├── hooks/
│   │   └── use-ecm-stream.ts
│   ├── components/
│   ├── pages/
│   └── ...
│
├── ecm-mail-backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── screenshots/
│
├── public/
│
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

## 🛠️ Technologies Used

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Backend

- Node.js
- Express.js
- Nodemailer
- CORS

### Deployment

- GitHub
- Vercel

---

## 💻 Run the Frontend Locally

Clone the repository:

```bash
git clone https://github.com/manimaran0024/smart-energy-machine-monitoring.git
```

Enter the project directory:

```bash
cd smart-energy-machine-monitoring
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally run at:

```text
http://localhost:5173
```

---

## 📧 Run the Email Backend Locally

Open a second terminal.

Go to the backend:

```bash
cd ecm-mail-backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:8000
```

---

## 🔐 Environment Variables

The frontend uses:

```text
VITE_ALERT_BACKEND_URL
```

### Local Development

```text
VITE_ALERT_BACKEND_URL=http://localhost:8000
```

### Production

```text
VITE_ALERT_BACKEND_URL=https://ecm-mail-backend.vercel.app
```

### Security

Never commit passwords, Gmail App Passwords, API keys, or other sensitive credentials to GitHub.

Sensitive credentials should be stored using environment variables and configured through Vercel Environment Variables.

---

## 🔄 System Workflow

```text
Machine Data
     │
     ▼
ECM Monitoring
     │
     ▼
Parameter Evaluation
     │
     ├──────────────┐
     │              │
     ▼              ▼
   Safe          Warning
                    │
                    ▼
                 Critical
                    │
                    ▼
              Alert Generated
                    │
                    ▼
              Email Backend
                    │
                    ▼
             Email Notification
```

---

## 📊 Reports and History

The system provides:

- Alert history
- Machine status information
- Weekly performance reports
- PDF report generation
- Machine monitoring information

---

## ☁️ Deployment

The application is deployed using Vercel.

### Frontend

https://ecm-guardian-main.vercel.app

### Email Backend

https://ecm-mail-backend.vercel.app

### Deploy Frontend

```bash
vercel --prod
```

### Deploy Backend

Go to the backend directory:

```bash
cd ecm-mail-backend
```

Then:

```bash
vercel --prod
```

---

## 🔄 Git Workflow

After making changes:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Update project"
```

Push to GitHub:

```bash
git push origin main
```

If GitHub and Vercel are connected, new commits can automatically trigger a Vercel deployment.

---

## 📸 Screenshots

The project includes screenshots demonstrating:

- Safe Status Dashboard
- Warning Status Dashboard
- Critical Status Dashboard
- Alert History
- Weekly Performance Report
- PDF Report

Screenshots are available in the `screenshots/` directory.

---

## 📄 License

This project is licensed under the terms specified in the `LICENSE` file.

---

## 👨‍💻 Project

**ECM Guardian**

**Smart Energy Machine Monitoring System for SMEs**

GitHub Repository:

https://github.com/manimaran0024/smart-energy-machine-monitoring

Live Application:

https://ecm-guardian-main.vercel.app

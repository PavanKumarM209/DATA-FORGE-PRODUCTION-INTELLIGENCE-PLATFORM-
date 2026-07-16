# Data Forge: Production Intelligence Platform

## Overview

**Data Forge: Production Intelligence Platform** is a full-stack industrial dashboard designed to monitor production activities and key performance indicators (KPIs) in real time. The platform provides manufacturers with centralized visibility into production metrics, enabling data-driven decision-making and improved operational efficiency.

The application includes secure authentication, role-based access control, automated PDF report generation, and email-based report delivery, making it suitable for production monitoring and management environments.

---

# Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* MySQL

### Authentication & Security

* JWT Authentication
* Role-Based Access Control (RBAC)

### Reporting & Automation

* Server-Side Rendered (SSR) PDF Generation
* SMTP Email Automation

### Development Tools

* Git
* GitHub
* Docker
* VS Code
* Antigravity

---

# Features

* Real-time Production KPI Dashboard
* Secure User Authentication
* Role-Based Access Control (Admin/User)
* Production Data Management
* Interactive Dashboard & Analytics
* Automated PDF Report Generation
* Email Report Automation using SMTP
* RESTful API Architecture
* Responsive User Interface

---

# System Architecture

```
                  +----------------------+
                  |      React.js        |
                  |    Frontend UI       |
                  +----------+-----------+
                             |
                    RESTful API Calls
                             |
                  +----------v-----------+
                  |   Node.js + Express  |
                  |      Backend API     |
                  +----------+-----------+
                             |
                       SQL Queries
                             |
                  +----------v-----------+
                  |       MySQL          |
                  |      Database        |
                  +----------------------+

        Report Generation
               |
        SSR PDF Generator
               |
         SMTP Email Service
```

---

# Project Structure

```
data-forge/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
│
├── database/
│   └── schema.sql
│
├── docker-compose.yml
├── README.md
└── .gitignore
```


# Core Modules

* Dashboard Overview
* Production KPI Monitoring
* Machine Performance Tracking
* User Management
* Role-Based Access Control
* Report Generation
* Email Notification System
* Authentication & Authorization

---

# Key Functionalities

### Production Dashboard

* Displays real-time production metrics.
* Visualizes key manufacturing KPIs.
* Enables quick monitoring of operational performance.

### Authentication

* Secure Login
* JWT-based Authentication
* Session Management

### User Management

* Admin/User Roles
* Permission-based Access
* User Profile Management

### Report Generation

* Generate production reports in PDF format.
* Download reports directly.
* Schedule reports for email delivery.

### Email Automation

* SMTP Integration
* Automatic report sharing
* Notification support

---

# REST API Modules

```
Authentication APIs
Production APIs
Dashboard APIs
Report APIs
User Management APIs
```

---

# Database

The platform uses **MySQL** to manage:

* User Information
* Production Data
* KPI Records
* Machine Statistics
* Report History
* Role & Permission Data

---

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/PavanKumarM209/Data-Forge-Production-Intelligence-Platform.git
```

---

## Backend Setup

```bash
cd backend

npm install

npm start
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm start
```

---

## Database

Create a MySQL database and import the provided SQL schema.

Configure your database connection inside the backend configuration file.

---

# Future Enhancements

* Live Production Alerts
* Predictive Analytics using Machine Learning
* IoT Device Integration
* Power BI Integration
* Mobile Dashboard
* Export to Excel
* Cloud Deployment
* Multi-Plant Monitoring

---

# Learning Outcomes

This project strengthened practical experience in:

* Full-Stack Web Development
* React.js Development
* Node.js & Express.js
* RESTful API Development
* MySQL Database Design
* Authentication & Authorization
* Production Monitoring Systems
* Report Automation
* Industrial Dashboard Development

---

# Author

Developed by Pavan Kumar M

* LinkedIn: https://www.linkedin.com/in/pavan-kumar-m-680b5b257/
* GitHub: [https://github.com/PavanKumarM209](https://github.com/PavanKumarM209)



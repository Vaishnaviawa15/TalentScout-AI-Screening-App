
# TalentScout AI-Powered Pre HR Screening Assistant

TalentScout is an AI-powered conversational screening platform designed to conduct pre-HR technical and profile screening for technology roles. It simulates an intelligent, structured interview experience while ensuring clarity, fairness, and reviewability of candidate responses.

The system dynamically adapts questions based on role, experience level, and tech stack, and produces a structured Screening Summary that can be reviewed post-interaction.


## Problem Statement

Recruiters often spend significant time performing initial candidate screenings. TalentScout automates this stage by:

1.Collecting candidate profile information conversationally

2.Conducting adaptive technical questioning

3.Structuring responses for easy review

4.Ensuring a clean, professional user experience
## Tech Stack

**Frontend:** Next.js,React ,Typescript, TailwindCSS

**Backend:** Next.js API Routes, Gemini API for question generation, JSON-based persistence for screening data


## 🔁 Application Flow 

1.User lands on Home Page

2.Starts Screening

3.Conversational data collection

4.Technical evaluation (3 stages)

5.Responses saved via API

6.Screening Summary generated

7.Summary accessible via navigation
## Environment Variables

To run this project, you will need to add the GEMINI_API_KEY to your .env.local file

`GEMINI_API_KEY=your_api_key_here`


## Run Locally

Clone the project

```bash
  git clone git https://github.com/Vaishnaviawa15/TalentScout-AI-Screening-App
```

Go to the project directory

```bash
  cd TalentScout-AI-Screening-App
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```


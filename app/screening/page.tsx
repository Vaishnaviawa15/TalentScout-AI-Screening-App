"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, UserCircle, Briefcase, CheckCircle, Loader2 } from "lucide-react"
import { extractExperienceLevel } from "@/lib/extractors"


type Message = {
  role: "assistant" | "user"
  content: string
}

type CandidateData = {
  name?: string
  desiredRole?: string
  location?: string
  experience?: "Fresher" | "Experienced"
  rawExperienceInput?: string
  techStack?: string[]
  stage: string

  technicalStage?: "Conceptual" | "Practical" | "RealWorld"
  technicalQuestionCount?: number
  
  technicalResponses?: {
  stage: "Conceptual" | "Practical" | "RealWorld"
  question: string
  answer: string
  }[]
}

export default function TalentScoutPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Welcome to TalentScout's pre-screening process. I'm here to help us get to know you better. Let's start with your full name.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [candidateData, setCandidateData] = useState<CandidateData>({
    stage: "Basic Info",
  })

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage = inputValue.trim()
    setInputValue("")

    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsProcessing(true)

    setTimeout(async () => {
      let nextMessage = ""
      const updatedData = { ...candidateData }

      if (!candidateData.name) {
        updatedData.name = userMessage
        setCandidateData(updatedData)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Thank you! What position or role are you interested in?" },
        ])
        setIsProcessing(false)
        return
      } else if (!candidateData.desiredRole) {
        updatedData.desiredRole = userMessage
        setCandidateData(updatedData)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Great! Where are you currently located?" },
        ])
        setIsProcessing(false)
        return
      } else if (!candidateData.location) {
        updatedData.location = userMessage
        updatedData.stage = "Tech Stack"
        setCandidateData(updatedData)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Perfect! Now let's talk about your technical background. How many years of experience do you have ?",
          },
        ])
        setIsProcessing(false)
        return
      } else if (!candidateData.experience) {
        const extractedExperience = extractExperienceLevel(userMessage)
        updatedData.rawExperienceInput = userMessage
        updatedData.experience = extractedExperience
        setCandidateData(updatedData)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Excellent. What are your primary technical skills or tech stack? (e.g., React, Node.js, Python)",
          },
        ])
        setIsProcessing(false)
        return
      } else if (!candidateData.techStack) {
        updatedData.techStack = userMessage.split(",").map((s) => s.trim())
        // Initialize technical evaluation state
        updatedData.stage = "Technical Evaluation"
        updatedData.technicalStage = "Conceptual"
        updatedData.technicalQuestionCount = 0
        updatedData.technicalResponses = []

        setMessages((prev) => [...prev, {role: "assistant",content:"Great! Based on your role, experience level, and the technologies you've mentioned, I'll now ask you a few technical questions to better understand your problem-solving approach.",},])

        // Call backend API to get first technical question
        const response = await fetch("/api/technical-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roles: [updatedData.desiredRole],
            techStack: updatedData.techStack,
            experienceLevel: updatedData.experience,
            difficultyStage: updatedData.technicalStage,
          }),
        })

        const data = await response.json()
        setCandidateData(updatedData)
        setMessages((prev) => [...prev,{role: "assistant",content: data.question,},])
        setIsProcessing(false)
        return
      } else if (
        updatedData.stage === "Technical Evaluation" &&
        updatedData.technicalQuestionCount !== undefined &&
        updatedData.technicalQuestionCount < 3
      ) {
        if (!updatedData.technicalResponses) {
          updatedData.technicalResponses = []
        } 

        const lastAssistantMessage = messages
          .slice()
          .reverse()
          .find((m) => m.role === "assistant")

        if (lastAssistantMessage) {
          updatedData.technicalResponses.push({
            stage: updatedData.technicalStage!,
            question: lastAssistantMessage.content,
            answer: userMessage,
          })
        }

        updatedData.technicalQuestionCount += 1

        if (updatedData.technicalQuestionCount === 3) {
          updatedData.stage = "Complete"

          // ✅ Save screening for HR
          await fetch("/api/save-screening", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          })

          setCandidateData(updatedData)

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Thank you for your time! Your screening is complete. Our hiring team will review your responses.",
            },
          ])

          setIsProcessing(false)
          return

        } else {
        // Move difficulty stage
          if (updatedData.technicalQuestionCount === 1) {
            updatedData.technicalStage = "Practical"
          } else if (updatedData.technicalQuestionCount === 2) {
            updatedData.technicalStage = "RealWorld"
          }


          // Fetch next technical question
          const response = await fetch("/api/technical-question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roles: [updatedData.desiredRole],
              techStack: updatedData.techStack,
              experienceLevel: updatedData.experience,
              difficultyStage: updatedData.technicalStage,
            }),
          })

        const data = await response.json()
        setCandidateData(updatedData)
        setMessages((prev) => [...prev,{role: "assistant",content: data.question,},])
        setIsProcessing(false)
        return
      }}
    }, 1500)
  }


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url('/images/blue-20blurry-20light-20effect.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Left Sidebar - Candidate Summary Dashboard */}
      <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto relative z-10">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Candidate Dashboard</h2>
          <p className="text-sm text-gray-500">Live screening summary</p>
        </div>

        {/* Candidate Overview */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <UserCircle className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Candidate Overview</h3>
          </div>
          <div className="space-y-2 ml-6">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{candidateData.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Desired Role</p>
              <p className="text-sm text-gray-900">{candidateData.desiredRole || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm text-gray-900">{candidateData.location || "—"}</p>
            </div>
          </div>
        </div>

        {/* Screening Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Screening Progress</h3>
          </div>
          <div className="ml-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${candidateData.stage === "Basic Info" ? "bg-blue-600" : "bg-gray-300"}`}
              />
              <p className="text-sm text-gray-900">Basic Info</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-2 h-2 rounded-full ${candidateData.stage === "Tech Stack" ? "bg-blue-600" : "bg-gray-300"}`}
              />
              <p className="text-sm text-gray-900">Tech Stack</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-2 h-2 rounded-full ${candidateData.stage === "Technical Evaluation" ? "bg-blue-600" : "bg-gray-300"}`}
              />
              <p className="text-sm text-gray-900">Technical Evaluation</p>
            </div>
          </div>
        </div>

        {/* Captured Details */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Captured Details</h3>
          </div>
          <div className="space-y-3 ml-6">
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="text-sm text-gray-900">{candidateData.experience || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tech Stack</p>
              {candidateData.techStack && candidateData.techStack.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {candidateData.techStack.map((tech, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-900">—</p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-3xl h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Welcome to TalentScout</h1>
                <p className="text-sm text-gray-500">AI-powered pre-screening assistant</p>
              </div>
            </div>
          </div>

          {/* Chat Conversation Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 text-gray-900">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm">Processing response…</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your response here…"
                disabled={isProcessing}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isProcessing || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Footer & Trust Messaging */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                TalentScout uses AI for initial candidate screening. Responses are reviewed by the hiring team.
              </p>
              <a href="#" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

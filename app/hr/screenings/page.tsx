"use client"

import { useEffect, useState } from "react"

type TechnicalResponse = {
  stage: "Conceptual" | "Practical" | "RealWorld"
  question: string
  answer: string
}

type Screening = {
  name: string
  desiredRole: string
  experience: string
  techStack: string[]
  technicalResponses: TechnicalResponse[]
}

export default function HRScreeningsPage() {
  const [screenings, setScreenings] = useState<Screening[]>([])

  useEffect(() => {
    fetch("/api/screenings")
      .then((res) => res.json())
      .then(setScreenings)
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">HR – Candidate Screenings</h1>

      {screenings.length === 0 && (
        <p className="text-gray-500">No screenings available.</p>
      )}

      <div className="space-y-6">
        {screenings.map((candidate, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{candidate.name}</h2>
            <p className="text-sm text-gray-600">
              {candidate.desiredRole} • {candidate.experience}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {candidate.techStack.map((tech, i) => (
                <span key={i} className="text-xs bg-blue-100 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              {candidate.technicalResponses.map((resp, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm font-medium">
                    {resp.stage} Question
                  </p>
                  <p className="text-sm text-gray-700">{resp.question}</p>
                  <p className="mt-1 text-sm">
                    <strong>Answer:</strong> {resp.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

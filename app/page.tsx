import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
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

      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">TalentScout</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/screening">
                <Button variant="ghost" className="text-sm">
                  Start Screening
                </Button>
              </Link>
              <Link href="/hr/screenings">
                <Button variant="ghost" className="text-sm">
                  Summary
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 text-balance">TalentScout</h1>
            <p className="text-xl text-gray-600 text-balance">AI-powered pre-HR screening for technology roles</p>
          </div>

          {/* Introduction Section */}
          <div className="max-w-2xl mx-auto">
            <p className="text-base text-gray-700 leading-relaxed text-pretty">
              TalentScout helps candidates complete an initial screening through a guided conversational process. This
              screening allows our hiring team to better understand your background before proceeding to further
              interview stages.
            </p>
          </div>

          {/* Screening Overview Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  The screening is conversational and designed to be completed in just a few minutes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  You'll answer questions about your background, experience, and technical skills
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  All responses are reviewed by our hiring team within 2-3 business days
                </p>
              </div>
            </div>
          </div>

          {/* Primary Call-to-Action */}
          <div className="pt-4">
            <Link href="/screening">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base rounded-xl">
                Start Screening
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            TalentScout uses AI for initial candidate screening. Responses are reviewed by the hiring team.
          </p>
          <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  )
}

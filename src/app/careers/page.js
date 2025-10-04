"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Briefcase, MapPin, Clock, Calendar, Users, ChevronRight } from "lucide-react"
import AnimatedLoader from "@/app/components/ui/animated-loader"

export default function CareersPage() {
  const [careers, setCareers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/common/careers`)
        const data = await response.json()

        if (data.success) {
          setCareers(data.data.careers || [])
        }
      } catch (error) {
        console.error("Failed to fetch careers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareers()
  }, [])

  const departments = ["All", ...new Set(careers.map(career => career.department))]
  const filteredCareers = selectedDepartment === "All"
    ? careers
    : careers.filter(career => career.department === selectedDepartment)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AnimatedLoader size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl mb-8 text-white/90">
              Help us revolutionize food delivery in Africa. We&apos;re looking for passionate people to join our mission.
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                <span>{careers.length} Open Positions</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                <span>Multiple Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {careers.length === 0 ? (
          /* No Open Positions */
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Open Positions Right Now
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We don&apos;t have any openings at the moment, but we&apos;re always growing!
              Check back soon or send us your resume for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.location.href = 'mailto:careers@conzooming.com'}
              >
                Send Your Resume
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-red-500 rounded-xl transition-all"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Department Filter */}
            <div className="mb-8 flex flex-wrap gap-3 justify-center">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  className={`rounded-xl transition-all ${
                    selectedDepartment === dept
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md"
                      : "border-2 border-gray-200 hover:border-red-300"
                  }`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>

            {/* Job Listings */}
            <div className="grid gap-6 max-w-5xl mx-auto">
              {filteredCareers.map((career) => (
                <Card
                  key={career.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-red-200 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => window.location.href = `/careers/${career.id}`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                            {career.title}
                          </h2>
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                            {career.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-sm font-medium">{career.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{career.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              Posted {new Date(career.postedDate).toLocaleDateString()}
                            </span>
                          </div>
                          {career.applicationsCount > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">{career.applicationsCount} applicants</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    <p className="text-gray-700 mb-6 line-clamp-3">
                      {career.description}
                    </p>

                    {career.salaryRange && career.salaryRange.min && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-lg inline-block">
                        <span>
                          {career.salaryRange.currency} {career.salaryRange.min.toLocaleString()} - {career.salaryRange.max.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {career.applicationDeadline && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-orange-700 bg-orange-50 px-4 py-2 rounded-lg inline-block">
                        <Clock className="w-4 h-4" />
                        <span>
                          Apply by {new Date(career.applicationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCareers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No positions found in {selectedDepartment}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

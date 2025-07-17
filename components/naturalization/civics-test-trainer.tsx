"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Timer,
  Eye,
  Volume2,
  RotateCcw,
  Award,
  TrendingUp,
  Brain,
  Target,
} from "lucide-react"

interface CivicsQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: "easy" | "medium" | "hard"
  visualAid?: string
  explanation: string
  aslVideoUrl?: string
}

interface TestSession {
  id: string
  startTime: Date
  endTime?: Date
  questions: CivicsQuestion[]
  answers: number[]
  score: number
  timeSpent: number
  accommodationsUsed: string[]
}

export default function CivicsTestTrainer() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [testSession, setTestSession] = useState<TestSession | null>(null)
  const [questions, setQuestions] = useState<CivicsQuestion[]>([])
  const [extendedTime, setExtendedTime] = useState(true)
  const [visualAids, setVisualAids] = useState(true)
  const [aslVideos, setAslVideos] = useState(true)

  // Mock civics questions with deaf-friendly accommodations
  useEffect(() => {
    setQuestions([
      {
        id: "1",
        question: "What is the supreme law of the land?",
        options: [
          "The Declaration of Independence",
          "The Constitution",
          "The Bill of Rights",
          "The Articles of Confederation",
        ],
        correctAnswer: 1,
        category: "Constitution",
        difficulty: "easy",
        explanation:
          "The Constitution is the supreme law of the United States. It establishes the framework of government and defines the rights of citizens.",
        aslVideoUrl: "/videos/constitution-explanation.mp4",
      },
      {
        id: "2",
        question: "How many amendments does the Constitution have?",
        options: ["25", "26", "27", "28"],
        correctAnswer: 2,
        category: "Constitution",
        difficulty: "medium",
        explanation: "The Constitution has 27 amendments. The first 10 amendments are called the Bill of Rights.",
        aslVideoUrl: "/videos/amendments-explanation.mp4",
      },
      {
        id: "3",
        question: "What did the Declaration of Independence do?",
        options: [
          "Announced our independence from Great Britain",
          "Declared our independence from France",
          "Declared our independence from Spain",
          "Announced our independence from Mexico",
        ],
        correctAnswer: 0,
        category: "History",
        difficulty: "easy",
        explanation: "The Declaration of Independence announced our independence from Great Britain in 1776.",
        aslVideoUrl: "/videos/declaration-explanation.mp4",
      },
      {
        id: "4",
        question: "Who wrote the Declaration of Independence?",
        options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "John Adams"],
        correctAnswer: 2,
        category: "History",
        difficulty: "medium",
        explanation: "Thomas Jefferson was the primary author of the Declaration of Independence.",
        aslVideoUrl: "/videos/jefferson-explanation.mp4",
      },
      {
        id: "5",
        question: "What is freedom of religion?",
        options: [
          "You can practice any religion, or not practice a religion",
          "You must practice Christianity",
          "You can only practice one religion",
          "Religion is not allowed",
        ],
        correctAnswer: 0,
        category: "Rights",
        difficulty: "easy",
        explanation:
          "Freedom of religion means you can practice any religion, or choose not to practice any religion at all.",
        aslVideoUrl: "/videos/religious-freedom-explanation.mp4",
      },
    ])
  }, [])

  const startTest = () => {
    const session: TestSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      questions: questions.slice(0, 5), // Take first 5 questions for demo
      answers: [],
      score: 0,
      timeSpent: 0,
      accommodationsUsed: [],
    }

    if (extendedTime) session.accommodationsUsed.push("Extended Time")
    if (visualAids) session.accommodationsUsed.push("Visual Aids")
    if (aslVideos) session.accommodationsUsed.push("ASL Videos")

    setTestSession(session)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const submitAnswer = () => {
    if (!testSession || selectedAnswer === null) return

    const updatedAnswers = [...testSession.answers]
    updatedAnswers[currentQuestion] = selectedAnswer

    setTestSession({
      ...testSession,
      answers: updatedAnswers,
    })

    setShowResult(true)
  }

  const nextQuestion = () => {
    if (!testSession) return

    if (currentQuestion < testSession.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      finishTest()
    }
  }

  const finishTest = () => {
    if (!testSession) return

    const correctAnswers = testSession.answers.filter(
      (answer, index) => answer === testSession.questions[index].correctAnswer,
    ).length

    const score = Math.round((correctAnswers / testSession.questions.length) * 100)
    const endTime = new Date()
    const timeSpent = Math.round((endTime.getTime() - testSession.startTime.getTime()) / 1000 / 60) // minutes

    setTestSession({
      ...testSession,
      endTime,
      score,
      timeSpent,
    })
  }

  const resetTest = () => {
    setTestSession(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  if (!testSession) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              Civics Test Trainer
            </h2>
            <p className="text-muted-foreground">Practice civics questions with deaf-specific accommodations</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Test Configuration
            </CardTitle>
            <CardDescription>Configure your accommodations and test preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="extended-time"
                  checked={extendedTime}
                  onChange={(e) => setExtendedTime(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="extended-time" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Extended Time (50% more)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="visual-aids"
                  checked={visualAids}
                  onChange={(e) => setVisualAids(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="visual-aids" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visual Aids & Diagrams
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="asl-videos"
                  checked={aslVideos}
                  onChange={(e) => setAslVideos(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="asl-videos" className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  ASL Explanation Videos
                </Label>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Brain className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                This practice test includes 5 questions covering Constitution, History, and Rights. All accommodations
                mirror what you'll receive during your actual naturalization test.
              </AlertDescription>
            </Alert>

            <Button onClick={startTest} className="w-full" size="lg">
              <BookOpen className="mr-2 h-4 w-4" />
              Start Practice Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (testSession.endTime) {
    const passedTest = testSession.score >= 60
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Test Results
            </CardTitle>
            <CardDescription>Your practice test performance with accommodations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${passedTest ? "text-green-600" : "text-red-600"}`}>
                {testSession.score}%
              </div>
              <div className="space-y-2">
                {passedTest ? (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    PASSED
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 text-white">
                    <XCircle className="mr-1 h-3 w-3" />
                    NEEDS IMPROVEMENT
                  </Badge>
                )}
                <div className="text-sm text-muted-foreground">
                  {
                    testSession.answers.filter((answer, index) => answer === testSession.questions[index].correctAnswer)
                      .length
                  }{" "}
                  out of {testSession.questions.length} correct
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-3 border rounded-lg">
                <div className="font-medium text-sm">Time Spent</div>
                <div className="text-2xl font-bold text-blue-600">{testSession.timeSpent}m</div>
                <div className="text-xs text-muted-foreground">
                  {extendedTime ? "With extended time" : "Standard time"}
                </div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="font-medium text-sm">Accommodations Used</div>
                <div className="text-lg font-bold text-purple-600">{testSession.accommodationsUsed.length}</div>
                <div className="text-xs text-muted-foreground">{testSession.accommodationsUsed.join(", ")}</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="font-medium text-sm">Readiness Level</div>
                <div className={`text-lg font-bold ${passedTest ? "text-green-600" : "text-orange-600"}`}>
                  {passedTest ? "Ready" : "Needs Practice"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {passedTest ? "Continue studying" : "Focus on weak areas"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-medium text-sm">Question Review</div>
              {testSession.questions.map((question, index) => {
                const userAnswer = testSession.answers[index]
                const isCorrect = userAnswer === question.correctAnswer
                return (
                  <div key={question.id} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{question.question}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Your answer: {question.options[userAnswer]}
                          {!isCorrect && (
                            <span className="text-green-600 ml-2">
                              (Correct: {question.options[question.correctAnswer]})
                            </span>
                          )}
                        </div>
                        {!isCorrect && (
                          <div className="text-xs text-blue-600 mt-1 bg-blue-50 p-2 rounded">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-2">
              <Button onClick={resetTest} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Take Another Test
              </Button>
              <Button className="flex-1">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Study Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = testSession.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / testSession.questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Civics Test in Progress
          </h2>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {testSession.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-500 text-white">
            <Timer className="mr-1 h-3 w-3" />
            Extended Time
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Question {currentQuestion + 1}
          </CardTitle>
          <CardDescription>
            Category: {question.category} • Difficulty: {question.difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-medium">{question.question}</div>

          {aslVideos && question.aslVideoUrl && (
            <Alert className="border-purple-200 bg-purple-50">
              <Volume2 className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <Button variant="link" className="p-0 h-auto text-purple-800">
                  Watch ASL explanation video for this question
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showResult && (
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg ${
                  selectedAnswer === question.correctAnswer
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === question.correctAnswer ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      selectedAnswer === question.correctAnswer ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                {selectedAnswer !== question.correctAnswer && (
                  <div className="text-sm text-red-700 mb-2">
                    The correct answer is: <strong>{question.options[question.correctAnswer]}</strong>
                  </div>
                )}
                <div className="text-sm text-gray-700">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </div>

              <Button onClick={nextQuestion} className="w-full">
                {currentQuestion < testSession.questions.length - 1 ? "Next Question" : "Finish Test"}
              </Button>
            </div>
          )}

          {!showResult && (
            <Button onClick={submitAnswer} disabled={selectedAnswer === null} className="w-full">
              Submit Answer
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

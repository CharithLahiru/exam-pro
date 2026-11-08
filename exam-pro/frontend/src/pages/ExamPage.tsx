import { useState } from "react";

// Sample questions data - replace with your actual data
const questionsData = {
  OL: [
    {
      id: 1,
      question: "What is the capital of Sri Lanka?",
      options: ["Colombo", "Kandy", "Galle", "Jaffna"],
      correctAnswer: 0,
      explanation:
        "Sri Jayawardenepura Kotte is the official capital, but Colombo is the commercial capital and largest city.",
      subject: "Geography",
      difficulty: "Easy",
    },
    {
      id: 2,
      question: "Which of the following is a prime number?",
      options: ["15", "21", "23", "27"],
      correctAnswer: 2,
      explanation:
        "23 is a prime number as it is only divisible by 1 and itself. Prime numbers have exactly two factors.",
      subject: "Mathematics",
      difficulty: "Medium",
    },
    {
      id: 3,
      question: "What is photosynthesis?",
      options: [
        "Process of breaking down food",
        "Process by which plants make food using sunlight",
        "Process of respiration",
        "Process of cell division",
      ],
      correctAnswer: 1,
      explanation:
        "Photosynthesis is the process by which green plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.",
      subject: "Science",
      difficulty: "Easy",
    },
  ],
  AL: [
    {
      id: 1,
      question: "What is the derivative of sin(x)?",
      options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
      correctAnswer: 0,
      explanation:
        "The derivative of sin(x) with respect to x is cos(x). This is a fundamental derivative in calculus.",
      subject: "Combined Mathematics",
      difficulty: "Medium",
    },
    {
      id: 2,
      question: "Which gas is most abundant in Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correctAnswer: 2,
      explanation:
        "Nitrogen makes up approximately 78% of Earth's atmosphere, making it the most abundant gas.",
      subject: "Chemistry",
      difficulty: "Easy",
    },
  ],
  Grade5: [
    {
      id: 1,
      question: "What is 12 × 8?",
      options: ["84", "96", "104", "92"],
      correctAnswer: 1,
      explanation:
        "12 × 8 = 96. You can solve this by adding 12 eight times or using multiplication tables.",
      subject: "Mathematics",
      difficulty: "Easy",
    },
    {
      id: 2,
      question: "Which is the longest river in Sri Lanka?",
      options: ["Kelani", "Mahaweli", "Kalu", "Gin"],
      correctAnswer: 1,
      explanation:
        "The Mahaweli River is the longest river in Sri Lanka, spanning approximately 335 kilometers.",
      subject: "Geography",
      difficulty: "Easy",
    },
  ],
};

export default function ExamPage({ category = "OL" }: { category?: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<any[]>([]);
  const [examStarted, setExamStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = (questionsData as Record<string, any[]>)[category] || questionsData.OL;

  const startExam = () => {
    setExamStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnsweredQuestions([]);
    setShowResult(false);
  };

  const handleAnswerSelect = (index: number) => {
    if (!showExplanation) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer before submitting!");
      return;
    }

    const isCorrect =
      selectedAnswer === questions[currentQuestion].correctAnswer;

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionId: questions[currentQuestion].id,
        selectedAnswer,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
      setExamStarted(false);
    }
  };

  const getCategoryTitle = () => {
    const titles = {
      OL: "Ordinary Level (O/L)",
      AL: "Advanced Level (A/L)",
      Grade5: "Grade 5 Scholarship",
    };
    return (titles as Record<string, string>)[category] || "Exam";
  };

  if (!examStarted && !showResult) {
    return (
      <div style={styles.container}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>
            {getCategoryTitle()} Practice Exam
          </h1>
          <p style={styles.welcomeText}>
            Welcome to your practice exam! This test contains {questions.length}{" "}
            multiple-choice questions.
          </p>
          <div style={styles.instructions}>
            <h3 style={styles.instructionsTitle}>Instructions:</h3>
            <ul style={styles.instructionsList}>
              <li>Read each question carefully</li>
              <li>Select one answer for each question</li>
              <li>Click "Submit Answer" to check your response</li>
              <li>Review the explanation after each question</li>
              <li>Click "Next Question" to proceed</li>
            </ul>
          </div>
          <button style={styles.startButton} onClick={startExam}>
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = ((score / questions.length) * 100).toFixed(1);
    const passed = Number(percentage) >= 50;

    return (
      <div style={styles.container}>
        <div style={styles.resultCard}>
          <div
            style={{
              ...styles.resultIcon,
              color: passed ? "#10b981" : "#ef4444",
            }}
          >
            {passed ? "🎉" : "📚"}
          </div>
          <h1 style={styles.resultTitle}>
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </h1>
          <div style={styles.scoreDisplay}>
            <div style={styles.scoreNumber}>
              {score}/{questions.length}
            </div>
            <div style={styles.scorePercentage}>{percentage}%</div>
          </div>
          <div style={styles.resultDetails}>
            <div style={styles.resultItem}>
              <span style={styles.resultLabel}>Correct Answers:</span>
              <span style={{ ...styles.resultValue, color: "#10b981" }}>
                {score}
              </span>
            </div>
            <div style={styles.resultItem}>
              <span style={styles.resultLabel}>Wrong Answers:</span>
              <span style={{ ...styles.resultValue, color: "#ef4444" }}>
                {questions.length - score}
              </span>
            </div>
            <div style={styles.resultItem}>
              <span style={styles.resultLabel}>Total Questions:</span>
              <span style={styles.resultValue}>{questions.length}</span>
            </div>
          </div>
          <div style={styles.resultActions}>
            <button style={styles.retryButton} onClick={startExam}>
              Retry Exam
            </button>
            <button
              style={styles.homeButton}
              onClick={() => (window.location.href = "/exam-pro")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.examCard}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <h2 style={styles.categoryBadge}>{getCategoryTitle()}</h2>
            <div style={styles.questionCounter}>
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{ ...styles.progressFill, width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div style={styles.questionSection}>
          <div style={styles.questionMeta}>
            <span style={styles.subjectTag}>{question.subject}</span>
            <span
              style={{
                ...styles.difficultyTag,
                backgroundColor:
                  question.difficulty === "Easy"
                    ? "#dcfce7"
                    : question.difficulty === "Medium"
                    ? "#fef3c7"
                    : "#fee2e2",
                color:
                  question.difficulty === "Easy"
                    ? "#166534"
                    : question.difficulty === "Medium"
                    ? "#92400e"
                    : "#991b1b",
              }}
            >
              {question.difficulty}
            </span>
          </div>
          <h3 style={styles.questionText}>{question.question}</h3>
        </div>

        <div style={styles.optionsSection}>
          {question.options.map((option: string, index: number) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrectAnswer = showExplanation && isCorrect;
            const showWrongAnswer = showExplanation && isSelected && !isCorrect;

            return (
              <div
                key={index}
                style={{
                  ...styles.optionCard,
                  backgroundColor: showCorrectAnswer
                    ? "#d1fae5"
                    : showWrongAnswer
                    ? "#fee2e2"
                    : isSelected
                    ? "#dbeafe"
                    : "#fff",
                  borderColor: showCorrectAnswer
                    ? "#10b981"
                    : showWrongAnswer
                    ? "#ef4444"
                    : isSelected
                    ? "#3b82f6"
                    : "#e5e7eb",
                  cursor: showExplanation ? "not-allowed" : "pointer",
                  opacity:
                    showExplanation && !isSelected && !isCorrect ? 0.6 : 1,
                }}
                onClick={() => handleAnswerSelect(index)}
              >
                <div style={styles.optionContent}>
                  <div
                    style={{
                      ...styles.optionNumber,
                      backgroundColor: showCorrectAnswer
                        ? "#10b981"
                        : showWrongAnswer
                        ? "#ef4444"
                        : isSelected
                        ? "#3b82f6"
                        : "#f3f4f6",
                      color:
                        isSelected || showCorrectAnswer || showWrongAnswer
                          ? "#fff"
                          : "#6b7280",
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span style={styles.optionText}>{option}</span>
                  {showCorrectAnswer && (
                    <span style={styles.correctIcon}>✓</span>
                  )}
                  {showWrongAnswer && <span style={styles.wrongIcon}>✗</span>}
                </div>
              </div>
            );
          })}
        </div>

        {showExplanation && (
          <div style={styles.explanationCard}>
            <h4 style={styles.explanationTitle}>
              {selectedAnswer === question.correctAnswer
                ? "✓ Correct!"
                : "✗ Incorrect"}
            </h4>
            <p style={styles.explanationText}>{question.explanation}</p>
          </div>
        )}

        <div style={styles.actionButtons}>
          {!showExplanation ? (
            <button style={styles.submitButton} onClick={handleSubmit}>
              Submit Answer
            </button>
          ) : (
            <button style={styles.nextButton} onClick={handleNext}>
              {currentQuestion < questions.length - 1
                ? "Next Question →"
                : "Finish Exam"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "2rem 1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "3rem",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  welcomeTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "1rem",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: "1.1rem",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "2rem",
  },
  instructions: {
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  instructionsTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "1rem",
  },
  instructionsList: {
    color: "#4b5563",
    paddingLeft: "1.5rem",
    lineHeight: "1.8",
  },
  startButton: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  examCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    maxWidth: "800px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  header: {
    marginBottom: "2rem",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  categoryBadge: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#3b82f6",
  },
  questionCounter: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    transition: "width 0.3s ease",
  },
  questionSection: {
    marginBottom: "2rem",
  },
  questionMeta: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  subjectTag: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    borderRadius: "4px",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  difficultyTag: {
    padding: "0.25rem 0.75rem",
    borderRadius: "4px",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  questionText: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: "1.6",
  },
  optionsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  optionCard: {
    padding: "1rem",
    border: "2px solid",
    borderRadius: "8px",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  optionContent: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  optionNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    fontSize: "1rem",
    color: "#1f2937",
  },
  correctIcon: {
    color: "#10b981",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  wrongIcon: {
    color: "#ef4444",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  explanationCard: {
    backgroundColor: "#f0f9ff",
    border: "2px solid #3b82f6",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  explanationTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#1f2937",
  },
  explanationText: {
    color: "#4b5563",
    lineHeight: "1.6",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "center",
  },
  submitButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  nextButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "3rem",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  resultIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  resultTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "2rem",
  },
  scoreDisplay: {
    marginBottom: "2rem",
  },
  scoreNumber: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: "0.5rem",
  },
  scorePercentage: {
    fontSize: "1.5rem",
    color: "#6b7280",
  },
  resultDetails: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.75rem 0",
    borderBottom: "1px solid #e5e7eb",
  },
  resultLabel: {
    color: "#6b7280",
    fontWeight: "500",
  },
  resultValue: {
    fontWeight: "600",
    color: "#1f2937",
  },
  resultActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  retryButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  homeButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

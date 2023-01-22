import React from "react"
import Quiz from "./Quiz"
import he from "he"

export default function App() {
    const quizCount = 5
    const [playing, setPlaying] = React.useState(false)
    const [quizes, setQuizes] = React.useState([])
    const [scoreText, setScoreText] = React.useState("")
    const [answersChecked, setAnswersChecked] = React.useState(false)

    React.useEffect(() => {
        async function getQuiz() {
            const res = await fetch(`https://opentdb.com/api.php?amount=${quizCount}&difficulty=easy`)
            const data = await res.json()
            
            const decode = await data.results.map((item) => {
                return {
                            question: he.decode(item.question),
                            correctAnswer: he.decode(item.correct_answer),
                            incorrectAnswers: item.incorrect_answers.map(element => he.decode(element))
                        }
            })
            
            const results = await decode.map((item,index) => {
                const answers = []
                
                for (let i = 0; i < item.incorrectAnswers.length; i ++) {
                    answers.push(item.incorrectAnswers[i])
                }
                answers.splice(Math.floor(Math.random() * answers.length), 0, item.correctAnswer)
                
                return {...item, 
                        id: index + 1,
                        answers: answers, 
                        selectedAnswer: ""}
            })
            
            setQuizes(results)
            
        }
        
        getQuiz()
        
    }, [playing])
    

    // keep track of which answers are picked
    function selectAnswer(id, answer) {
        setQuizes(prevQuizes => prevQuizes.map(
            (item) => {
                if (item.id === id) {
                    return {...item, selectedAnswer: answer}
                } else {
                    return item
                }
            })
        )
    }
    
    function handleClick() {
        if (answersChecked) {
            setPlaying(false)
            setAnswersChecked(false)
            setScoreText("")
        } else {
            let score = 0
            
            for (let i = 0; i < quizCount; i ++) {
                if (quizes[i].correctAnswer === quizes[i].selectedAnswer) {
                    score += 1
                }
            }
            
            setScoreText(`You scored ${score}/${quizCount} correct anwers`)
            
            setAnswersChecked(true)
        }
    }
    
    const quizElements = quizes.map((quiz) => {
        return (
                <Quiz 
                    key={quiz.id}
                    id={quiz.id}
                    question={quiz.question}
                    answers={quiz.answers}
                    correctAnswer={quiz.correctAnswer}
                    selectAnswer={selectAnswer}
                    selectedAnswer={quiz.selectedAnswer}
                    answersChecked={answersChecked}
                />
        )
    })

    return (
        <main>
            {playing ? 
                <div>
                    <div className="quiz--container">
                        {quizElements}
                    </div>
                    <div className="score--container">
                        {scoreText}
                        <button 
                            onClick={handleClick} 
                            className="score--button"
                        >{`${answersChecked ? "Play again" : "Check answers"}`}
                        </button>
                    </div>
                </div>
             : 
                <div className="intro--container">
                    <h1 className="intro--title">Quizzical</h1>
                    <p className="intro--description">Let's get Quizzical!</p>
                    <button className="intro--button" onClick={() => setPlaying(true)}>Start quiz</button>
                </div>
             }
        </main>
    )
}
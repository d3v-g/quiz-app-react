import React from  "react"

export default function Quiz({question, answers, selectAnswer, id, selectedAnswer, correctAnswer, answersChecked}) {
    // after checkAnswer function has run, change correct answer and incorrect answer color
    // for all the wrong answers, if they were previously selected, change colour to red
    const answersElements = answers.map((item) => {
        return (
            <div 
                className={`quiz--answer 
                    ${answersChecked ? 
                        (item === correctAnswer ? 
                            "quiz--answer--correct" : 
                            (item === selectedAnswer ? "quiz--answer--incorrect" : "quiz--answer--unselected")) 
                        :
                        (item === selectedAnswer && "quiz--answer--selected")
                        }
                    `}
                key={item}
                onClick={() => selectAnswer(id, item)}
            >{item}</div>
        )
    })
    
    return (
        <div>
            <p className="quiz--question">{question}</p>
            <div className="quiz--answers--container">
                {answersElements}
            </div>
            <hr className="quiz--line"/>
        </div>
    )
}
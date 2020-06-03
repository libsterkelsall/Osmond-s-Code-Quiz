var viewScoresSpan = document.querySelector("#view-scores");
var userScoreSpan = document.querySelector("#user-score");
var timeLeftSpan = document.querySelector("#time-left");
var startButton = document.querySelector("#startQuiz");
var questionItem = document.querySelector("#question");
var choices = document.querySelector("#choices");
var result = document.querySelector("#result");
var endQuizBlock = document.querySelector("#endQuiz");

var userScore = 0;
var timerLimit = 30;
var timeLeft = timerLimit;
var myTimer;
var timerEnd = false;

viewScoresSpan.addEventListener("click", function (event) {
   // alert("High score is " + localStorage.highScore + " by " + localStorage.initials);
   if(localStorage.getItem("initialsAndScores") === null ||
    localStorage.getItem("initialsAndScores") === 'undefined')  {
       alert("No scores saved... yet!");
       return;
   }
   var alertScores = JSON.parse(localStorage.initialsAndScores);
   var alertScoreDisplay = "";
   for (var i = 0; i < alertScores.length; i++) {
        alertScoreDisplay = alertScoreDisplay +
        "\n" + alertScores[i].score + " by " + alertScores[i].initials;
   }
   alert(alertScoreDisplay);
}
);

var questionsArray = [
    q1 = {
        question: "What is the HTML tag under which one can write the JavaScript code?",
        choices: ["javascript",
            "scripted",
            "script",
            "js"],
        answer: "script"
    },
    q2 = {
        question: "Which of the following is the correct syntax to display a text in an alert box using JavaScript?",
        choices: ["alertbox",
            "msg",
            "msgbox",
            "alert"],
        answer: "alert"
    },
    q3 = {
        question: "What is the correct syntax for referring to an external script?",
        choices: ["script src",
            "script href",
            "script ref",
            "script name"],
        answer: "script src"
    },
    q4 = {
        question: "Which of the following is not a reserved word in JavaScript?",
        choices: ["interface",
            "throws",
            "program",
            "short"],
        answer: "program"
    },
    q5 = {
        question: "What is the syntax for creating a function in JavaScript named as compute?",
        choices: ["function = compute()",
            "function compute()",
            "function := compute()",
            "function : compute()"],
        answer: "function compute()"
    },
    q6 = {
        question: "What is the JavaScript syntax for printing values in Console?",
        choices: ["print(someValue)",
            "console.log(someValue);",
            "console.print(someValue);",
            "print.console(someValue);"],
        answer: "console.log(someValue);"
    },
    q6 = {
        question: "What is the method in JavaScript used to remove the whitespace at the beginning and end of any string?",
        choices: ["strip()",
            "stripped()",
            "trim()",
            "trimmed()"],
        answer: "trim()"
    }
];

var questionsAnswered = [];

startButton.addEventListener("click", function (event) {
    event.preventDefault();
    hideEndQuizBlock();
    viewScoresSpan.style.display = "none";
    userScore = 0;
    timeLeft = timerLimit;
    questionItem.textContent = "";
    startButton.style.display = "none";
    myTimer = setInterval(startTimer, 1000);
    pickRandomQuestion();
}
);

function startTimer() {
    timeLeft--;
    timeLeftSpan.innerHTML = timeLeft;
    if (timeLeft === 0) {
        endQuiz();
    }
}

function endQuiz() {
    //Bonus for completing the quiz
    if (timeLeft > 0) {
        userScore = userScore + timeLeft;
    }
    clearInterval(myTimer);
    rebuildQuestionsArray();
    while (choices.hasChildNodes()) {
        choices.removeChild(choices.firstChild);
    };
    viewScoresSpan.style.display = "block";
    displayEndQuizBlock();
}

function displayEndQuizBlock() {
    questionItem.textContent = "Your final score is: " + userScore + ". Enter your initials to save your score.";
    result.textContent = "";
    endQuizBlock.style.display = "block";
    var initials = document.createElement("input");
    initials.setAttribute("type", "text");
    endQuizBlock.appendChild(initials);
    var saveScore = document.createElement("button");
    saveScore.innerHTML = "Submit";
    endQuizBlock.appendChild(saveScore);
    timeLeftSpan.innerHTML = timerLimit;
    startButton.style.display = "block";
    saveScore.addEventListener("click", function (event) {
        event.preventDefault();
        //Clear previous initials and score
        var initialsAndScoreInput = {
            initials: "",
            score: 0
        };
        // Create score object from submission
        initialsAndScoreInput = {
            initials: initials.value.trim(),
            score: userScore
        };
        if (initialsAndScoreInput.initials == "") {
            alert("Initials cannot be blank.");
            return;
        };
        //Create or add local storage initialsAndScores
        if (localStorage.getItem("initialsAndScores") === null ||
        localStorage.getItem("initialsAndScores") === 'undefined')  {
            var initialsAndScoreInputArray = [];
            initialsAndScoreInputArray.push(initialsAndScoreInput);
            localStorage.setItem("initialsAndScores",JSON.stringify(initialsAndScoreInputArray));
        }
        else {
            var initialsAndScoreInputArray = JSON.parse(localStorage.initialsAndScores); //retrieve existing initialsAndScores
            initialsAndScoreInputArray.push(initialsAndScoreInput);
            localStorage.setItem("initialsAndScores",JSON.stringify(initialsAndScoreInputArray));
        }
        hideEndQuizBlock();
    }
    );
}

function hideEndQuizBlock() {
    questionItem.textContent = "";
    var child = endQuizBlock.lastElementChild;
    while (child) {
        endQuizBlock.removeChild(child);
        child = endQuizBlock.lastElementChild;
    };
    userScoreSpan.innerHTML = 0;
    timeLeftSpan.innerHTML = timerLimit;
}

function pickRandomQuestion() {
    //Clear previous question and choices
    if (questionItem === "") {
        return;
    };
    //Randomly pick a question
    var questionNumber = [Math.floor(Math.random() * questionsArray.length)];
    var question = questionsArray[questionNumber];
    questionItem.innerHTML = question.question;
    //Display the choices
    for (var c = 0; c < questionsArray[questionNumber].choices.length; c++) {
        var choice = (questionsArray[questionNumber].choices[c]);
        var li = document.createElement("li");
        li.textContent = choice;
        choices.appendChild(li);
        var correctAnswer = (questionsArray[questionNumber].answer);
        //Add event listener to choice when it is clicked
        li.addEventListener("click", function (event) {
            result.textContent = "";
            var userChoice = event.target.innerHTML;
            checkAnswer(userChoice, correctAnswer);
        }
        )
    };
    questionsAnswered.push(question);
    questionsArray.splice(questionNumber, 1);
    console.log(questionsArray.length);
}

function checkAnswer(userChoice, correctAnswer) {
    if (userChoice == correctAnswer) {
        result.textContent = "You are correct!";
        userScore++;
        userScoreSpan.textContent = userScore;
    } else {
        result.textContent = "Sorry, wrong answer!";
        timeLeft = timeLeft - 5;
        timeLeftSpan.innerHTML = timeLeft;
    }

    var choices = document.getElementById("choices");
    while (choices.hasChildNodes()) {
        choices.removeChild(choices.firstChild);
    }
    if (questionsArray.length == 0 ||
        timeLeft <= 0) {
        endQuiz();
    } else pickRandomQuestion();
}

function rebuildQuestionsArray() {
    questionsArray = questionsArray.concat(questionsAnswered);
    questionsAnswered = [];
}
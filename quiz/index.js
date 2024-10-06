function main () {
  //set local variables
  
  //track current question
  let currentQuestion = 0;
  
  //# of questions player has answered correct
  let score = 0;
  
  //enum of states the program can be in
  var StateEnum = {
    LOADING: 1,
    START: 2,
    QUESTION: 3,
    POPUP: 4,
    END: 5,
  };
  
  //set state to loading 
  let state = StateEnum.LOADING;
  
  //make a copy of the question data so that we can randomize it when we load the quiz
  let questionData = questionDataList.slice(0);
  
  //--------------functions in main
  
  //----this function shows the start screen and loads the click event for the start button
  function displayStartScreen () {
    state = StateEnum.START;
    
    //make sure other pages are invisible
    //set css to diplay 
    console.log("setting up start screen");
    console.log("start - score:"+score+ "  question:"+currentQuestion);
 
    //$("#quiz-page").css("display", "none");
    // $("#end-page").css("display", "none");
    //$("#start-page").css("display", "block");

    $("#start-page").addClass("show-section").removeClass("hide-section");
    $("#quiz-page").addClass("hide-section").removeClass("show-section");
    $("#results-popup").removeClass("show-section-table").addClass("hide-section");

    let startButtonHandler = function () {
      event.preventDefault();
      $("#js-play").unbind("click", startButtonHandler);
      console.log("clicked play");
      displayQuizScreen();
    };
     
    $("#js-play").click(startButtonHandler);

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


  //----this function displays the Quiz screen with a question for the first time
  //----it also sets up click events for answer choices. -this is only called on initial start
  function displayQuizScreen(){
    
    state = StateEnum.QUESTION;
    
    //run update info to make sure the score and question number are correct
    //especially if this is a reset from a previous quiz
    updateInfo();
    
    console.log("displayquiz score:"+score+ "  question:"+currentQuestion);
    console.log("setting up quiz screen");

    $("#start-page").removeClass("show-section").addClass("hide-section");
    $("#quiz-page").addClass("show-section").removeClass("hide-section");
    $("#results-popup").removeClass("show-section-table").addClass("hide-section");

    displayQuestion(getQuestionData(currentQuestion));

    $(".js-answers").on("click", 'button', function (event) {
      event.preventDefault();
      
      if(state === StateEnum.POPUP) return;

      let chosenAnswer = parseInt( $(event.currentTarget).attr("data-answer") ); 
      
      displayAnswerCheckPopUp(questionData[currentQuestion].correctAnswer === chosenAnswer  );
    });

    document.body.scrollTop = 0; // Safari requires a different command
    document.documentElement.scrollTop = 0;
  }

  //this function updates the quiz screen with new questions and answers
  function updateQuizScreen(){
    
    state = StateEnum.QUESTION;
    
    currentQuestion++;
    
    updateInfo();
    
    displayQuestion(getQuestionData(currentQuestion));
    
    $("#results-popup").removeClass("show-section-table").addClass("hide-section");
    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  
  
  //this function shows the results pop up window telling the player if they were right
  // it also sets the event listener for the click event to move to the next question
  function displayAnswerCheckPopUp(correctCheck){
    
    state = StateEnum.POPUP;
  
    console.log("setting up popup");
    
    //display the popup
    $("#results-popup").addClass("show-section-table").removeClass("hide-section");
   
    //decide what message to post for correct or incorrect
    if(correctCheck) {
      console.log("correct!!" );
      $(".pop-up").attr("class", "pop-up pop-up-correct");
              
      //create array of random positive words - then radomly select one
      let wordArray = ["Awesome", "Super", "Fabulous", "Epic", "Excellent"];
              
      let randomWord = wordArray[Math.floor(Math.random()*wordArray.length)];
      $(".result-message").text(`${randomWord}!!  You got it right!`);
      $(".correct-answer-text").text(""); 
              
      score++; 
              
    }
    else { 
      $(".pop-up").attr("class", "pop-up");
                
      let correctAnswerText = questionData[currentQuestion].answers[ questionData[currentQuestion].correctAnswer ]; 
                
      //create array of negative words - then radomly select one
      let wordArray = ["Boooo", "Bummer", "Sorry", "Ouch", ];
                    
      let randomWord = wordArray[Math.floor(Math.random()*wordArray.length)];
                    
      console.log("false!!" + questionData[currentQuestion].correctAnswer);
                   
      $(".result-message").text(`${randomWord}!!  You were incorrect!`);
      $(".correct-answer-text").text(`The correct answer was: "${correctAnswerText}"`); 
    }

    let nextButtonHandler = function () {
      event.preventDefault();
      $("#js-next").unbind("click", nextButtonHandler);
      console.log("clicked next");
      console.log("next q is"+ (currentQuestion+1));

      if ((currentQuestion+1) >= questionData.length) { 
        console.log ("ran out of questions");
        displayEndScreen(); 
      } else {
          console.log ("lets go to the next question");
          updateQuizScreen();
        }
    };

    $("#js-next").click(nextButtonHandler);

  }
  
  //this function updates the score and question number text at the top of the screen
  function updateInfo(){
    
    $(".left-info-box").text("Score: "+score+" out of "+currentQuestion);
    $(".right-info-box").text("Question: "+(currentQuestion+1)+"/10");
    
  }
  
  
  //this function displays the end screen that shows the final score and lets player try again
  function displayEndScreen(){
    
    state = StateEnum.END;
    
    console.log("setting up end screen");
    
    $("#quiz-page").removeClass("show-section").addClass("hide-section");
    $("#results-popup").removeClass("show-section-table").addClass("hide-section");
    $("#end-page").removeClass("hide-section").addClass("show-section");

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    
    let resultsMessage = ""; 
    
    if(score > 5) {
      //player got a passing score
      //set results page img to positive lift off gif
      $("#js-results-img").attr('src', 'https://media.giphy.com/media/mi6DsSSNKDbUY/giphy.gif');
      $("#js-image").attr('alt', 'Shuttle Launching');
      
      //set top message to positive statement
      $("#js-results-mission-status").text("Mission Complete! Let's see how you did...");
      
      //set background of boxes to light color to signal positive result
      $(".question-box").attr("class", "box col-12 question-box");
      $(".welcome-box").attr("class", "box col-12 welcome-box");
      $(".question-box-question").attr("class", "question-box-question");
      
      resultsMessage = "Great Job!"; 
      } else {
          //player got %50 or less correct
          //set a negative gif of astronaut floating away
          $("#js-results-img").attr('src', 'https://media.giphy.com/media/SB6ILXmfTkdk4/giphy.gif');
          $("#js-image").attr('alt', 'Astronaut drifting away');
              
          //set negative result top message
          $("#js-results-mission-status").text("Mission Failed. Let's see how you did...");
              
          //set background of boxes to dark color to signal positive result
          $(".question-box").attr("class", "box col-12 question-box end-page-fail");
          $(".welcome-box").attr("class", "box col-12 welcome-box end-page-fail");
          $(".question-box-question").attr("class", "question-box-question end-page-fail-text");

          resultsMessage = "Better luck next time!";
        };
      
    //display bottom results section with message and score  
    $("#js-results").html(`<p class="end-page-result">Results</p><p>You got ${score} questions correct out of 10!<br /> ${resultsMessage}</p>`);

    let endButtonHandler = function () {
      event.preventDefault();
      $("#js-restart").unbind("click", endButtonHandler);
      console.log("clicked restart");
      resetQuiz();
      updateQuizScreen();
     };
     
     $("#js-restart").click(endButtonHandler);


  }
  
  //this function resets the quiz variables and give the player a new starting question
  function resetQuiz(){
    
    state = StateEnum.LOADING;
    
    //randomize questions again
    questionData.sort( ()=> Math.random() * 2 - 1);
    
    //reset page sections and display first quiz question
    $("#start-page").removeClass("show-section").addClass("hide-section");
    $("#quiz-page").addClass("show-section").removeClass("hide-section");
    $("#results-popup").removeClass("show-section-table").addClass("hide-section");
    $("#end-page").removeClass("show-section").addClass("hide-section");
    //make sure question box colors are set back to normal since they share the 
    //class used on the end page
    $(".question-box").attr("class", "col-12 question-box");
    $(".question-box-question").attr("class", "question-box-question");
      
    //reset score
    score = 0;
    //reset currentQuestion to -1 since it later increments to zero at the start 
    //of the quiz
    currentQuestion = -1; 
  }

  //this function pulls the requested question object from the data var
  function getQuestionData(questionNumber){
    //grab the current question from the data var
    return questionData[questionNumber]; 
  }

  //this function updates the question text on the quiz page screen
  function displayQuestion(question){
    //this is where we will access the dom and put the question, answer choices in for the viewer to see
    
    $("#js-question").text(question.question);
    $(".js-image").attr('src', question.image);
    $(".js-image").attr('alt', question.alt);
    $(".js-answer1").text(question.answers[0]); 
    $(".js-answer2").text(question.answers[1]); 
    $(".js-answer3").text(question.answers[2]); 
    $(".js-answer4").text(question.answers[3]); 
    
  }
  
  //-----------end of function block
    
  //randomize question order at the start of the quiz
  questionData.sort( ()=> Math.random() * 2 - 1);
  
  //call the start screen function to begin
  displayStartScreen();
}

//on page load - start program's main function
$(function() {
  main();
});

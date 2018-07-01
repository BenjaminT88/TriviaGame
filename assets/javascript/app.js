var qAmount;
var qDifficulty;
var queryURL;
var correctGiphyURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=celebrate";
var incorrectGiphyURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=confused";
var currentDB = [];
var second = 30;
var countDownInterval;
var qCount = 0;
var timerP = $("<p class='msg'>");
var questionP = $("<p class='msg'>");
var choices = [];
var answer = "";
var newGIF;
var correctCount = 0;
var incorrectCount = 0;

$(document).on("click", "#startGame", function(){
    event.preventDefault();
    if ($("#game").html() == ""){
        qAmount = $("#qAmount").val();
        qDifficulty = $("#qDifficulty").val();
        queryURL = "https://opentdb.com/api.php?amount=" + qAmount + "&category=17&difficulty=" + qDifficulty + "&type=multiple";
        qCount ++;
        $.ajax({
            url: queryURL,
            }).then(function(result){
            currentDB = result.results;
            timerP.html("Time Remaining: <span id='second'>30</span> seconds");
            questionP.html(qCount + ": " + currentDB[0].question);
            $("#game").append(timerP, questionP);
            answer = currentDB[0].correct_answer;
            for (i=0; i<currentDB[0].incorrect_answers.length; i++){
                choices.push(currentDB[0].incorrect_answers[i]);
            };
            choices.push(currentDB[0].correct_answer);
            choices.sort(function(){
                return 0.5 - Math.random();
            });
            for (i=0; i<choices.length; i++){
                var choiceBTN = $("<button class='choice'>").html(choices[i]);
                $("#game").append(choiceBTN);
            }
            $("#container").hide();
            countDownInterval = setInterval(countDown, 1000);
            });
    }
});

function gameOn(){
    timerP.html("Time Remaining: <span id='second'>30</span> seconds");
    questionP.html(qCount + ": " + currentDB[0].question);
    var choices = [];
    $("#game").append(timerP, questionP);
    answer = currentDB[0].correct_answer;
    for (i=0; i<currentDB[0].incorrect_answers.length; i++){
        choices.push(currentDB[0].incorrect_answers[i]);
    };
    choices.push(currentDB[0].correct_answer);
    choices.sort(function(){
        return 0.5 - Math.random();
    });
    for (i=0; i<choices.length; i++){
        var choiceBTN = $("<button class='choice'>").html(choices[i]);
        $("#game").append(choiceBTN);
    }
    $("#container").hide();
    countDownInterval = setInterval(countDown, 1000);
};

$(document).on("click", ".choice", function(){
    event.preventDefault();
    clearInterval(countDownInterval);
    $(".choice").remove();
    if ($(this).text() == answer){
        correctCount ++;
        questionP.html("Correct!");
        $.ajax({
            url:correctGiphyURL,
            }).then(function(response){
            newGIF = response.data.images.downsized_large.url;
            var newImg = $("<img>").attr("src", newGIF)
            $("#game").append(newImg);
            });
    }else{
        incorrectCount ++;
        questionP.html("NOOOOOOO!<br>The correct answer was " + answer);
        $.ajax({
            url:incorrectGiphyURL,
            }).then(function(response){
            newGIF = response.data.images.downsized_large.url;
            var newImg = $("<img>").attr("src", newGIF)
            $("#game").append(newImg);
            });
    }
        setTimeout(nextQuestion, 3500);
});

    function nextQuestion(){
        qCount ++;
        if (qCount != parseInt(qAmount) + 1){
            second = 30;
            currentDB.shift();
            $("#game").empty();
            gameOn();
        }else{
            $("#container").show();
            questionP.html("Game Over!<br>Your final score is:<br>Correct: " + correctCount + "<br>Incorrect: " + incorrectCount + "<br>Game resetting in 5 seconds.....");
            setTimeout(reload, 5000);
        }
    };

function countDown(){
    second --;
    if(second < 10 && second >= 0){
        $("#second").text("0" + second);
    }else if(second >= 10){
        $("#second").text(second);
    }else{
        clearInterval(countDownInterval);
        incorrectCount ++;
        $(".choice").remove();
        questionP.html("Time Out!<br>The correct answer was " + answer);
        $.ajax({
            url:incorrectGiphyURL,
            }).then(function(response){
            newGIF = response.data.images.downsized_large.url;
            var newImg = $("<img>").attr("src", newGIF)
            $("#game").append(newImg);
            });
        setTimeout(nextQuestion, 2500);
    }
};

function reload(){
    location.reload();
}
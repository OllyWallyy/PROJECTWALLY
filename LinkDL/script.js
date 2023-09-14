
var currentLine = "";
var typeSpeed = 70;
var pauseLength = 1000;


var cursor = document.getElementById("cursor");
var animate = document.getElementsByClassName("animate");
var input = document.getElementById("inputcmd");
var output = document.getElementById("output");


input.addEventListener("keypress", keypressInput);
document.getElementById("terminal-window").addEventListener("click", openKeyboard);


Array.from(animate).forEach(function (element) {
  element.classList.add("hide");
});


var temp = setTimeout(printCharacters, typeSpeed);


function printCharacters() {

  if (currentLine.length == 0) {
    cursor.classList.remove("blink");

 
    currentLine = animate[0].textContent.split("");
    currentLine.reverse();

 
    animate[0].innerHTML = "";
    animate[0].classList.remove("hide");
    animate[0].appendChild(cursor);
  }


  animate[0].appendChild(document.createTextNode(currentLine.pop()));
  animate[0].appendChild(cursor);


  if (currentLine.length == 0) {
    animate[0].classList.remove("animate");
    animate = document.getElementsByClassName("animate");
    cursor.classList.add("blink");

    if (animate.length > 0) {
      setTimeout(printCharacters, pauseLength);
    } else {
      input.parentNode.insertBefore(cursor, input.nextSibling);
      input.focus();
    }
  } else {
    setTimeout(printCharacters, typeSpeed);
  }
}

function keypressInput(e) {
  if (e.keyCode == 13) {
    var command = input.value;
    output.textContent = proccessCMD(command);
    input.value = "";

    if (command === "OllyWallyy") {
      output.textContent = "Accepted...";
      setTimeout(function () {
        output.textContent = "Welcome! Redirecting to W . A . L . L . Y...";
        setTimeout(function () {
          window.location.href = "welcome.html";
        }, 2000); 
      }, 1000); 
    }

    e.preventDefault();
  }
}

function proccessCMD(cmd) {
  cmd = cmd.trim().toLowerCase();
  if (cmd == "--help") {
    return "There are no commands aside from '--help' for normal users";
  }
  return "unknown command. type '--help' for a list of commands.";
}

// open iOS keyboard
function openKeyboard() {
  input.focus();
}

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


    e.preventDefault();
  }
}

function proccessCMD(cmd) {
  cmd = cmd.trim().toLowerCase();
  if (cmd === "linkdl") {
    redirectingLinkDL();
    return "REDIRECTING..."; 
  } else if (cmd === "--help") {
    return [
      "-- help > help command",
      " LinkDL > Redirect to LinkDL",
      " Test Site > Redirect to Test Site",
      " ToggleM > Opens Up Menu GUI"
    ];
  } else if (cmd === "test site") {
    redirectingTestSite();
    return "REDIRECTING...";
  } else if (cmd === "togglem") {
    var buttonContainer = document.getElementById("button-container");
    var isMenuVisible = !buttonContainer.classList.contains("hide");
    buttonContainer.classList.toggle("hide");
    if (isMenuVisible) {
      return "";
    } else {
      return "Alternate Menu Toggled"; 
    }
  }
  return "Unknown command. Type '--help' for a list of commands.";
}






function redirectingLinkDL() {
  output.textContent = "REDIRECTING...";
  setTimeout(function() {
    output.textContent = ""; // Clear the output
    window.open("https://linkdl.ollywallyy.repl.co/", "_blank");
  }, 1000);
}

function redirectingTestSite() {
  output.textContent = "REDIRECTING...";
  setTimeout(function() {
    output.textContent = ""; // Clear the output
    window.open("https://test.ollywallyy.repl.co", "_blank");
  }, 1000);
}







// open iOS keyboard
function openKeyboard() {
  input.focus();
}
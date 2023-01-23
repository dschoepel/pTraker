import zxcvbn from "zxcvbn";

function scoreText(password) {
  var strength = {
    0: "Worst: ",
    1: "Bad: ",
    2: "Weak: ",
    3: "Good: ",
    4: "Strong: ",
  };

  var result = zxcvbn(password);
  let text = "";
  let warning = "";
  if (result.feedback.warning.length > 0) {
    warning = result.feedback.warning.endsWith(".")
      ? warning
      : result.feedback.warning + ".";
  }
  result.feedback.suggestions.forEach((suggestion) => {
    text = " " + suggestion.endsWith(".") ? suggestion : suggestion + ". ";
  });
  if (password !== "") {
    text = strength[result.score] + "  " + warning + " " + text;
  }
  return text;
}

const PasswordService = {
  scoreText,
};

export default PasswordService;

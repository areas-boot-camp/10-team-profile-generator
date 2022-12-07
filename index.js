// Requirements:
// https://courses.bootcampspot.com/courses/2188/assignments/38645?module_item_id=748634
//
// AS A manager
// I WANT to generate a webpage that displays my team's basic info
// SO THAT I have quick access to their emails and GitHub profiles
//
// GIVEN a command-line application that accepts user input:
// [ ] WHEN I am prompted for my team members and their information
//     THEN an HTML file is generated that displays a nicely formatted team roster based on user input
// [ ] WHEN I click on an email address in the HTML
//     THEN my default email program opens and populates the TO field of the email with the address
// [ ] WHEN I click on the GitHub username
//     THEN that GitHub profile opens in a new tab
// [x] WHEN I start the application
//     THEN I am prompted to enter the team manager’s name, employee ID, email address, and office number
// [x] WHEN I enter the team manager’s name, employee ID, email address, and office number
//     THEN I am presented with a menu with the option to add an engineer or an intern or to finish building my team
// [x] WHEN I select the engineer option
//     THEN I am prompted to enter the engineer’s name, ID, email, and GitHub username, and I am taken back to the menu
// [x] WHEN I select the intern option
//     THEN I am prompted to enter the intern’s name, ID, email, and school, and I am taken back to the menu
// [ ] WHEN I decide to finish building my team
//     THEN I exit the application, and the HTML is generated
//
// Todos:
// [x] Add unit tests.
// [x] Add classes and sub-classes.
// [x] Add HTML template.
// [ ] Add code to use HTML template to generate final HTML file.
// [x] Refactor the code so there‘s only one prompt (not counting the continue-or-finish prompt) and "manager", "developer", or "intern" is passed as a variable.

// Import the Inquirer and File System modules.
const inquire = require("inquirer")
const fs = require("fs")

// Import the Manager, Developer, and Intern classes.
const Manager = require("./lib/Employee/Manager")
const Developer = require("./lib/Employee/Developer")
const Intern = require("./lib/Employee/Intern")

// Generate prompts for an employee role.
function generatePrompts(employeeRole) {
  let uniqueEmployeePrompt
  let uniqueEmployeePromptName
  if (employeeRole === "Manager") {
    uniqueEmployeePrompt = "office number"
    uniqueEmployeePromptName = "office"
  } else if (employeeRole === "Developer") {
    uniqueEmployeePrompt = "GitHub username"
    uniqueEmployeePromptName = "github"
  } else if (employeeRole === "Intern") {
    uniqueEmployeePrompt = "school"
    uniqueEmployeePromptName = "school"
  }
  employeeRole = employeeRole.toLowerCase()
  const prompts = [
    { message: `Enter the ${employeeRole}’s name.`,
      type:    "input",
      name:    "name",
      validate(answer) {
        if (!answer) { return `Please enter the ${employeeRole}’s name.` }
        else { return true }
      },
    },
    { message: `Enter the ${employeeRole}’s employee ID.`,
      type:    "input",
      name:    "id",
      validate(answer) {
        if (!answer) { return `Please enter the ${employeeRole}’s employee ID.` }
        else { return true }
      },
    },
    { message: `Enter the ${employeeRole}’s email address.`,
      type:    "input",
      name:    "email",
      validate(answer) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(answer)) { return `Please enter a valid email address.`}
        else { return true }
      },
    },
    { message: `Enter the ${employeeRole}’s ${uniqueEmployeePrompt}.`,
      type:    "input",
      name:    `${uniqueEmployeePromptName}`,
      validate(answer) {
        if (!answer) { return `Please enter the ${employeeRole}’s ${uniqueEmployeePrompt}.` }
        else { return true }
      },
    },
  ]
  return prompts
}

// Start the app and prompt the user for the manager’s information.
function startTheApp() {
  inquire
  .prompt(generatePrompts("Manager"))
  .then((answers) => {
    const manager = new Manager(answers.name, answers.id, answers.email, answers.office)
    // Print a success message.
    console.log("Great! On to the next step:")
    // Read the template file and save it to a new variable.
    let template = fs.readFileSync("./src/index.html", "utf8")
    // Replace placeholders with the user’s answers.
    for (const [key, value] of Object.entries(manager)) { template = template.replaceAll(`{${key}}`, value) }
    // Replace the role and icon placeholders with the appropriate values.
    template = template.replace("{role}", manager.getRole())
    template = template.replace("{icon}", manager.getIcon())
    // Write the new file to the dist folder.
    fs.writeFileSync("./dist/index.html", template)
    // Prompt the user to continue or finish.
    promptToContinueOrFinish()
  })
}

// Declare the continue or finish prompt.
const continueOrFinishPrompt = [
  { message: "Choose a role to add to the team. Or if you’re done, choose “Finish.”",
    type:    "list",
    choices: ["Developer", "Intern", "Finish"],
    name:    "role",
  },
]

// Prompt the user to continue or finish.
function promptToContinueOrFinish() {
  inquire
  .prompt(continueOrFinishPrompt)
  .then((answer) => {
    console.log(answer) // **
    if (answer.role === "Developer") {
      promptForDeveloperInformation()
    } else if (answer.role === "Intern") {
      promptForInternInformation()
    } else if (answer.role === "Finish") {
      console.log("Done!") // **
    }
  })
}

// Prompt the user for the developer’s information.
function promptForDeveloperInformation() {
  inquire
  .prompt(generatePrompts("Developer"))
  .then((answers) => {
    const developer = new Developer(answers.name, answers.id, answers.email, answers.github)
    console.log(developer) // **
    promptToContinueOrFinish()
  })
}

// Prompt the user for the intern’s information.
function promptForInternInformation() {
  inquire
  .prompt(generatePrompts("Intern"))
  .then((answers) => {
    const intern = new Intern(answers.name, answers.id, answers.email, answers.school)
    console.log(intern) // **
    promptToContinueOrFinish()
  })
}

startTheApp()


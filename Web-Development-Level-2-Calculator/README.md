# Web Development Level 2 - Calculator

## Overview

A simple, responsive calculator built using HTML, CSS, and JavaScript. It provides a clean interface for performing basic arithmetic operations using either the mouse or keyboard.

## Features

- Addition, subtraction, multiplication, and division.
- Decimal number support.
- Clear all input using the AC button.
- Delete the last entered digit using the DEL button.
- Keyboard support for faster calculations.
- Input validation to prevent duplicate decimal points.
- Division-by-zero error handling.
- Number length limitation to keep input manageable.
- Responsive layout for different screen sizes.
- Color-coded calculator buttons for easier use.

## Technologies Used

- **HTML5** - Structures the calculator interface.
- **CSS3** - Provides styling, layout, and responsive design.
- **JavaScript (ES6)** - Handles calculations, input validation, and user interactions.

## Project Structure

```text
Web-Development-Level-2-Calculator/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
    ├── calculator-desktop.png
    └── calculator-mobile.png
```

## Getting Started

### Prerequisites

You only need a modern web browser, such as Google Chrome, Microsoft Edge, or Firefox.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KhalidWayu/OIBSIP.git
   ```

2. Open the calculator project folder:

   ```bash
   cd OIBSIP/Web-Development-Level-2-Calculator
   ```

3. Open `index.html` in your web browser.

Alternatively, open the project folder in Visual Studio Code and use the Live Server extension.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `0–9` | Enter numbers |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `.` | Decimal point |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` | Clear calculator |

## Testing

The calculator was tested with the following operations:

| Test | Expected Result |
|---|---|
| 5 + 3 | 8 |
| 9 - 4 | 5 |
| 6 × 7 | 42 |
| 20 ÷ 4 | 5 |
| 2.5 + 1.5 | 4 |
| 8 ÷ 0 | Error |
| AC button | Resets display to 0 |
| DEL button | Deletes the last digit |

Mouse and keyboard interactions were also tested.

## Screenshots

Screenshots of the calculator interface will be included here.

- Desktop view: `screenshots/calculator-desktop.png`
- Mobile view: `screenshots/calculator-mobile.png`

## Author

Developed as part of the OIBSIP Web Development Level 2 project.

## License

This project is available for educational and personal use.

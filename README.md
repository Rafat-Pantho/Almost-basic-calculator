# 🧮 Advanced Calculator

A sophisticated C-based calculator that follows proper mathematical order of operations (PEMDAS/BODMAS) with support for decimal numbers, negative values, and multiple operators.

## ✨ Features

- **✅ Order of Operations**: Follows PEMDAS/BODMAS rules correctly
- **✅ Multiple Operators**: Supports `+`, `-`, `*`, `/`, `%`, `^`
- **✅ Decimal Numbers**: Handles floating-point calculations (`3.14`, `15.5`)
- **✅ Negative Numbers**: Supports negative values (`-5`, `3+-2`)
- **✅ Whitespace Tolerance**: Ignores spaces in expressions
- **✅ Error Handling**: Comprehensive error detection and reporting
- **✅ Left-to-Right Evaluation**: Correct processing of same-precedence operators

## 🚀 Quick Start

### Prerequisites

- GCC compiler
- Math library support (`-lm` flag)

### Compilation

```bash
gcc "almost calculator.c" -o calculator.exe -lm
```

### Usage

```bash
./calculator.exe
```

Then enter your mathematical expression when prompted.

## 📝 Examples

| **Expression** | **Result** | **Explanation** |
|----------------|------------|-----------------|
| `2 + 3 * 4` | `14` | Multiplication first: `2 + (3 * 4)` |
| `45 + 45 * 5 / 3` | `120` | Left-to-right for same precedence: `45 + ((45 * 5) / 3)` |
| `10 / 2 * 3 + 1` | `16` | Left-to-right: `((10 / 2) * 3) + 1` |
| `15.5 + 2.3 * 4` | `24.7` | Decimal support |
| `-5 + 3` | `-2` | Negative number support |
| `2 ^ 3 + 1` | `9` | Exponentiation: `(2 ^ 3) + 1` |
| `10 % 3` | `1` | Modulo operation |

## 🎯 Operator Precedence

The calculator follows standard mathematical precedence rules:

1. **`^`** - Exponentiation (highest precedence, right-to-left)
2. **`*`, `/`, `%`** - Multiplication, Division, Modulo (left-to-right)
3. **`+`, `-`** - Addition, Subtraction (lowest precedence, left-to-right)

## 🔧 How It Works

### Architecture

The calculator uses a **two-phase approach**:

1. **Parsing Phase**: Converts input string into structured data
   - Extracts numbers (including decimals and negatives)
   - Identifies operators and their positions
   - Validates expression format

2. **Evaluation Phase**: Processes operations by precedence
   - **Pass 1**: Handles exponentiation (`^`) right-to-left
   - **Pass 2**: Handles multiplication, division, modulo (`*`, `/`, `%`) left-to-right
   - **Pass 3**: Handles addition, subtraction (`+`, `-`) left-to-right

### Key Data Structures

```c
typedef struct {
    double numbers[MAX_SIZE];    // Array of parsed numbers
    char operators[MAX_SIZE];    // Array of operators
    int count;                   // Number of operators
} expression;
```

### Algorithm Highlights

- **Dynamic Array Shrinking**: Arrays shrink as operations are completed
- **Left-to-Right Processing**: Same-precedence operators processed correctly
- **Robust Parsing**: Uses `strtod()` for accurate number conversion
- **Error Detection**: Comprehensive validation and error reporting

## 🛠️ Error Handling

The calculator provides detailed error messages:

- **Division by Zero**: `Error: Division by zero or invalid operation`
- **Invalid Format**: `Error: Invalid expression format`
- **Unknown Errors**: `Error: Unknown error occurred`

## 📁 Project Structure

```text
Almost-basic-calculator/
├── almost calculator.c    # Main calculator source code
├── calculator.exe        # Compiled executable
├── debug.c              # Debug utilities (if present)
├── debug2.c             # Advanced debug utilities (if present)
└── README.md            # This file
```

## 🧪 Testing

### Basic Operations

```bash
echo "2+3*4" | ./calculator.exe
# Expected: 14

echo "10-6/2" | ./calculator.exe  
# Expected: 7
```

### Complex Expressions

```bash
echo "45+45*5/3" | ./calculator.exe
# Expected: 120

echo "2^3*4+1" | ./calculator.exe
# Expected: 33
```

### Edge Cases

```bash
echo "5/0" | ./calculator.exe
# Expected: Error: Division by zero or invalid operation

echo "-5+3*2" | ./calculator.exe
# Expected: 1
```

## 💡 Technical Details

### Compilation Flags

- **`-lm`**: Links math library for `pow()`, `fmod()`, `isnan()` functions
- **Standard C**: Compatible with C99 and later standards

### Memory Usage

- **Static Arrays**: Uses fixed-size arrays (`MAX_SIZE = 1000`)
- **Low Memory Footprint**: Minimal dynamic memory allocation
- **Safe Bounds**: Array bounds checking included

### Precision

- **Double Precision**: Uses `double` for all calculations
- **Decimal Display**: Results displayed with `%.10g` format for clean output

## 🔄 Version History

### Current Version

- ✅ Proper order of operations implementation
- ✅ Decimal and negative number support  
- ✅ Comprehensive error handling
- ✅ Left-to-right evaluation for same-precedence operators

### Previous Version Issues (Fixed)

- ❌ Left-to-right evaluation without precedence
- ❌ No decimal number support
- ❌ Incorrect array shifting in evaluation
- ❌ Limited error handling

## 🤝 Contributing

Feel free to contribute by:

- Adding parentheses support `()`
- Implementing additional functions (`sin`, `cos`, `log`)
- Adding scientific notation support
- Improving error messages
- Adding more comprehensive tests

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 👨‍💻 Author

### Rafat-Pantho

- GitHub: [@Rafat-Pantho](https://github.com/Rafat-Pantho)
- Repository: [Almost-basic-calculator](https://github.com/Rafat-Pantho/Almost-basic-calculator)

---

*Built with ❤️ and proper mathematical principles!* 🧮✨

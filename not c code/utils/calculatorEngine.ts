/**
 * Token types for parsing
 */
type TokenType = 'NUMBER' | 'OPERATOR' | 'LPAREN' | 'RPAREN';

interface Token {
  type: TokenType;
  value: string;
}

/**
 * Validates if a character is a digit or decimal point
 */
const isNumberChar = (char: string): boolean => /[\d.]/.test(char);

/**
 * Validates if a character is an operator
 */
const isOperator = (char: string): boolean => /[+\-*/%^]/.test(char);

/**
 * Precedence levels for operators
 */
const getPrecedence = (op: string): number => {
  switch (op) {
    case '+':
    case '-':
      return 1;
    case '*':
    case '/':
    case '%':
      return 2;
    case '^':
      return 3;
    default:
      return 0;
  }
};

/**
 * Tokenize the input string into a list of processable tokens.
 * Handles negative numbers correctly based on context.
 */
const tokenize = (expression: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  
  // Remove spaces
  const cleanExpr = expression.replace(/\s+/g, '');
  
  while (i < cleanExpr.length) {
    const char = cleanExpr[i];

    if (isNumberChar(char)) {
      let numStr = char;
      i++;
      while (i < cleanExpr.length && isNumberChar(cleanExpr[i])) {
        numStr += cleanExpr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
    } else if (isOperator(char)) {
      // Check for unary minus:
      // It's a negative number if it's '-' AND (it's at the start OR previous was operator/lparen)
      if (char === '-') {
        const prevToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
        const isUnary = !prevToken || prevToken.type === 'OPERATOR' || prevToken.type === 'LPAREN';
        
        if (isUnary) {
          // Check if there is a number after this minus
          if (i + 1 < cleanExpr.length && (isNumberChar(cleanExpr[i + 1]) || cleanExpr[i + 1] === '(')) {
             // Actually, for standard shunting yard, unary minus is often treated as operator 'u-' or 
             // we can just stick it to the number if it's a direct number.
             // If it precedes a parenthesis -(3+2), it's trickier.
             // For simplicity in this engine, let's treat it as a number multiplier -1 * ...
             // BUT, the simplest way for "Basic" calculator logic is binding it to the number if possible.
             
             // Let's consume the number immediately if possible
             if (i + 1 < cleanExpr.length && isNumberChar(cleanExpr[i+1])) {
                let numStr = '-';
                i++; // Skip '-'
                while (i < cleanExpr.length && isNumberChar(cleanExpr[i])) {
                    numStr += cleanExpr[i];
                    i++;
                }
                tokens.push({ type: 'NUMBER', value: numStr });
                continue;
             }
          }
        }
      }
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
    } else if (char === '(') {
      // Implicit multiplication handling: 2(3) -> 2*(3)
      if (tokens.length > 0 && tokens[tokens.length - 1].type === 'NUMBER') {
          tokens.push({ type: 'OPERATOR', value: '*' });
      }
      tokens.push({ type: 'LPAREN', value: char });
      i++;
    } else if (char === ')') {
      tokens.push({ type: 'RPAREN', value: char });
      i++;
    } else {
      // Unknown char, skip
      i++;
    }
  }
  return tokens;
};

/**
 * Shunting-yard algorithm to convert Infix to Reverse Polish Notation (RPN)
 */
const toRPN = (tokens: Token[]): Token[] => {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      outputQueue.push(token);
    } else if (token.type === 'OPERATOR') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === 'OPERATOR'
      ) {
        const topOp = operatorStack[operatorStack.length - 1];
        const tokenPrec = getPrecedence(token.value);
        const topPrec = getPrecedence(topOp.value);

        // ^ is right associative, others are left
        const isRightAssoc = token.value === '^';
        
        if (
          (!isRightAssoc && tokenPrec <= topPrec) ||
          (isRightAssoc && tokenPrec < topPrec)
        ) {
          outputQueue.push(operatorStack.pop()!);
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'LPAREN') {
        operatorStack.pop(); // Discard left parenthesis
      } else {
        throw new Error("Mismatched Parentheses");
      }
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op.type === 'LPAREN') {
        throw new Error("Mismatched Parentheses");
    }
    outputQueue.push(op);
  }

  return outputQueue;
};

/**
 * Evaluate RPN list
 */
const evaluateRPN = (rpn: Token[]): number => {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'OPERATOR') {
      if (stack.length < 2) throw new Error("Invalid Expression");
      
      const b = stack.pop()!;
      const a = stack.pop()!;
      
      let result = 0;
      switch (token.value) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': 
          if (b === 0) throw new Error("Division by Zero");
          result = a / b; 
          break;
        case '%': 
            if (b === 0) throw new Error("Modulo by Zero");
            result = a % b; 
            break;
        case '^': result = Math.pow(a, b); break;
        default: throw new Error("Unknown Operator");
      }
      stack.push(result);
    }
  }

  if (stack.length !== 1) throw new Error("Invalid Expression");
  return stack[0];
};

export const calculate = (expression: string): { result: number | null; error: string | null } => {
  try {
    if (!expression.trim()) return { result: 0, error: null };
    const tokens = tokenize(expression);
    const rpn = toRPN(tokens);
    const result = evaluateRPN(rpn);
    
    // Check for NaN or Infinity that might have slipped through
    if (!isFinite(result)) return { result: null, error: "Result Undefined" };
    
    return { result, error: null };
  } catch (err: any) {
    return { result: null, error: err.message || "Error" };
  }
};
// A calculator that follows proper arithmetic rules (order of operations)
// Supports: +, -, *, /, % with proper precedence and parentheses

#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

typedef long long ll;
typedef unsigned int ui;

#define f(i, n) for (ui i = 0; i < n; i++)
#define MAX_SIZE 1000

typedef struct store_result{
    double result_of_calc;
    int invalid;    
}store_result;

typedef struct {
    double numbers[MAX_SIZE];
    char operators[MAX_SIZE];
    int count;
} expression;

double operation(double num1, double num2, char op) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 == 0) return NAN; // Return NaN for division by zero
            return num1 / num2;
        case '%':
            if (num2 == 0) return NAN;
            return fmod(num1, num2);
        case '^':
            return pow(num1, num2);
        default:
            return 0;
    }
}

int get_precedence(char op) {
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
}

// Parse the input string into numbers and operators
int parse_expression(const char *input, expression *expr) {
    int i = 0, num_count = 0;
    const char *ptr = input;
    
    // Skip leading whitespace
    while (*ptr && isspace(*ptr)) ptr++;
    
    while (*ptr) {
        // Parse number (including decimals)
        if (isdigit(*ptr) || *ptr == '.') {
            char *endptr;
            expr->numbers[num_count] = strtod(ptr, &endptr);
            ptr = endptr;
            num_count++;
        }
        // Handle negative numbers at the beginning or after operators
        else if (*ptr == '-' && (ptr == input || strchr("+-*/%(", *(ptr-1)))) {
            char *endptr;
            expr->numbers[num_count] = strtod(ptr, &endptr);
            ptr = endptr;
            num_count++;
        }
        // Parse operator
        else if (strchr("+-*/%^", *ptr)) {
            expr->operators[i] = *ptr;
            i++;
            ptr++;
        }
        // Skip whitespace
        else if (isspace(*ptr)) ptr++;
        else return -1; // Invalid character
        
        // Skip whitespace
        while (*ptr && isspace(*ptr)) ptr++;
    }
    
    expr->count = i;
    return (num_count == i + 1) ? 0 : -1; // Should have one more number than operators
}

// Evaluate expression following order of operations
double evaluate_expression(expression *expr, int *error) {
    if (expr->count == 0) return expr->numbers[0];
    
    // Create working copies
    double nums[MAX_SIZE];
    char ops[MAX_SIZE];
    int op_count = expr->count;
    
    for (int i = 0; i <= expr->count; i++) nums[i] = expr->numbers[i];
    for (int i = 0; i < expr->count; i++) ops[i] = expr->operators[i];
    
    // First pass: Handle ^ (exponentiation) - right to left
    for (int i = op_count - 1; i >= 0; i--) {
        if (get_precedence(ops[i]) == 3) {
            double result = operation(nums[i], nums[i+1], ops[i]);
            
            if (isnan(result)) {
                *error = -1;
                return 0;
            }
            
            // Replace the operation with its result
            nums[i] = result;
            
            // Shift remaining numbers and operators
            for (int j = i + 1; j < op_count; j++) {
                nums[j] = nums[j + 1];
                ops[j] = ops[j + 1];
            }
            op_count--;
        }
    }
    
    // Second pass: Handle *, /, % (left to right)
    int i = 0;
    while (i < op_count) {
        if (get_precedence(ops[i]) == 2) {
            double result = operation(nums[i], nums[i+1], ops[i]);
            
            if (isnan(result)) {
                *error = -1;
                return 0;
            }
            
            // Replace the operation with its result
            nums[i] = result;
            
            // Shift remaining numbers and operators left
            for (int j = i + 1; j < op_count; j++) nums[j] = nums[j + 1];
            for (int j = i; j < op_count - 1; j++) ops[j] = ops[j + 1];
            op_count--;
            // Stay at the same index to process next operator at this position
        } 
        else i++;
    }
    
    // Third pass: Handle +, - (left to right)
    i = 0;
    while (i < op_count) {
        if (get_precedence(ops[i]) == 1) {
            double result = operation(nums[i], nums[i+1], ops[i]);
            
            if (isnan(result)) {
                *error = -1;
                return 0;
            }
            
            // Replace the operation with its result
            nums[i] = result;
            
            // Shift remaining numbers and operators left
            for (int j = i + 1; j < op_count; j++) nums[j] = nums[j + 1];
            for (int j = i; j < op_count - 1; j++) ops[j] = ops[j + 1];
            op_count--;
            // Stay at the same index to process next operator at this position
        } 
        else i++;
    }

    return nums[0];
}

void resulting(store_result *res, const char *user_input) {
    expression expr;
    res->invalid = 0;
    res->result_of_calc = 0;
    
    // Parse the input
    if (parse_expression(user_input, &expr) != 0) {
        res->invalid = -2; // Parsing error
        return;
    }
    
    // Evaluate the expression
    int error = 0;
    res->result_of_calc = evaluate_expression(&expr, &error);
    
    if (error != 0) res->invalid = error;
}

int main() {
    char input_by_user[MAX_SIZE];
    
    printf("Advanced Calculator (supports +, -, *, /, %%, ^ with proper precedence)\n");
    printf("Enter expression: ");
    
    if (fgets(input_by_user, sizeof(input_by_user), stdin) == NULL) {
        printf("Error reading input\n");
        return 1;
    }
    
    // Remove newline if present
    size_t len = strlen(input_by_user);
    if (len > 0 && input_by_user[len-1] == '\n') input_by_user[len-1] = '\0';

    store_result res;
    res.result_of_calc = 0;
    res.invalid = 0;

    resulting(&res, input_by_user);

    switch (res.invalid) {
        case -1:
            printf("Error: Division by zero or invalid operation\n");
            break;
        case -2:
            printf("Error: Invalid expression format\n");
            break;
        case 0:
            printf("Result: %.10g\n", res.result_of_calc);
            break;
        default:
            printf("Error: Unknown error occurred\n");
            break;
    }

    return 0;
}

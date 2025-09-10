#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define MAX_SIZE 1000

typedef struct {
    double numbers[MAX_SIZE];
    char operators[MAX_SIZE];
    int count;
} expression;

double operation(double num1, double num2, char op) {
    switch (op) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num1 / num2;
        case '%': return fmod(num1, num2);
        case '^': return pow(num1, num2);
        default: return 0;
    }
}

int get_precedence(char op) {
    switch (op) {
        case '+': case '-': return 1;
        case '*': case '/': case '%': return 2;
        case '^': return 3;
        default: return 0;
    }
}

int parse_expression(const char *input, expression *expr) {
    int i = 0, num_count = 0;
    const char *ptr = input;
    
    while (*ptr && isspace(*ptr)) ptr++;
    
    while (*ptr) {
        if (isdigit(*ptr) || *ptr == '.') {
            char *endptr;
            expr->numbers[num_count] = strtod(ptr, &endptr);
            ptr = endptr;
            num_count++;
        }
        else if (*ptr == '-' && (ptr == input || strchr("+-*/%(", *(ptr-1)))) {
            char *endptr;
            expr->numbers[num_count] = strtod(ptr, &endptr);
            ptr = endptr;
            num_count++;
        }
        else if (strchr("+-*/%^", *ptr)) {
            expr->operators[i] = *ptr;
            i++;
            ptr++;
        }
        else if (isspace(*ptr)) {
            ptr++;
        }
        else {
            return -1;
        }
        while (*ptr && isspace(*ptr)) ptr++;
    }
    
    expr->count = i;
    return (num_count == i + 1) ? 0 : -1;
}

void print_state(double nums[], char ops[], int op_count) {
    printf("Numbers: ");
    for (int i = 0; i <= op_count; i++) {
        printf("%.2f ", nums[i]);
    }
    printf("\nOperators: ");
    for (int i = 0; i < op_count; i++) {
        printf("'%c' ", ops[i]);
    }
    printf("\n");
}

double evaluate_expression(expression *expr, int *error) {
    if (expr->count == 0) return expr->numbers[0];
    
    double nums[MAX_SIZE];
    char ops[MAX_SIZE];
    int op_count = expr->count;
    
    for (int i = 0; i <= expr->count; i++) {
        nums[i] = expr->numbers[i];
    }
    for (int i = 0; i < expr->count; i++) {
        ops[i] = expr->operators[i];
    }
    
    printf("Initial state:\n");
    print_state(nums, ops, op_count);
    
    // Handle *, /, % (left to right)
    int i = 0;
    while (i < op_count) {
        if (get_precedence(ops[i]) == 2) {
            printf("\nProcessing: %.2f %c %.2f\n", nums[i], ops[i], nums[i+1]);
            double result = operation(nums[i], nums[i+1], ops[i]);
            printf("Result: %.2f\n", result);
            
            nums[i] = result;
            
            // Shift remaining numbers and operators
            for (int j = i + 1; j < op_count; j++) {
                nums[j] = nums[j + 1];
                ops[j] = ops[j + 1];
            }
            op_count--;
            
            printf("After operation:\n");
            print_state(nums, ops, op_count);
        } else {
            i++;
        }
    }
    
    // Handle +, - (left to right)
    i = 0;
    while (i < op_count) {
        if (get_precedence(ops[i]) == 1) {
            printf("\nProcessing: %.2f %c %.2f\n", nums[i], ops[i], nums[i+1]);
            double result = operation(nums[i], nums[i+1], ops[i]);
            printf("Result: %.2f\n", result);
            
            nums[i] = result;
            
            for (int j = i + 1; j < op_count; j++) {
                nums[j] = nums[j + 1];
                ops[j] = ops[j + 1];
            }
            op_count--;
            
            printf("After operation:\n");
            print_state(nums, ops, op_count);
        } else {
            i++;
        }
    }
    
    return nums[0];
}

int main() {
    char input[MAX_SIZE] = "45+45*5/3";
    expression expr;
    
    printf("Input: %s\n", input);
    
    if (parse_expression(input, &expr) == 0) {
        int error = 0;
        double result = evaluate_expression(&expr, &error);
        printf("\nFinal result: %.2f\n", result);
    } else {
        printf("Parsing failed!\n");
    }
    
    return 0;
}

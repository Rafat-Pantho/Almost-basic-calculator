// Debug version to see what's being parsed
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
        else if (isspace(*ptr)) {
            ptr++;
        }
        else {
            return -1; // Invalid character
        }
        
        // Skip whitespace
        while (*ptr && isspace(*ptr)) ptr++;
    }
    
    expr->count = i;
    return (num_count == i + 1) ? 0 : -1; // Should have one more number than operators
}

int main() {
    char input[MAX_SIZE] = "45+45*5/3";
    expression expr;
    
    printf("Input: %s\n", input);
    
    if (parse_expression(input, &expr) == 0) {
        printf("Parsed successfully!\n");
        printf("Numbers: ");
        for (int i = 0; i <= expr.count; i++) {
            printf("%.2f ", expr.numbers[i]);
        }
        printf("\nOperators: ");
        for (int i = 0; i < expr.count; i++) {
            printf("'%c' ", expr.operators[i]);
        }
        printf("\nCount: %d\n", expr.count);
    } else {
        printf("Parsing failed!\n");
    }
    
    return 0;
}

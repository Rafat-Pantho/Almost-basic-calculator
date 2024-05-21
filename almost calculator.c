#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

typedef long long ll;
typedef unsigned int ui;

#define f(i, n) for (ui i = 0; i < n; i++)
#define MAX_SIZE 1000

ll operation(ll num1, ll num2, char op) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num2 ? num1 / num2 : -1;
        default:
            return 0;
    }
}

ll resulting(const char *user_input) {
    ll numbers[MAX_SIZE] = {0};
    ui i = 0;
    char operators[MAX_SIZE] = {0};

    // Separating numbers and operators
    for (const char *ptr = user_input; *ptr != '\0'; ptr++) {
        if (isdigit(*ptr)) {
            numbers[i] = numbers[i] * 10 + (*ptr - '0');
        } else {
            operators[i] = *ptr;
            i++;
        }
    }

    f(j, i) {
        ll the_calculated = operation(numbers[0], numbers[j + 1], operators[j]);
        if (the_calculated == -1) return -1;
        numbers[0] = the_calculated;
    }

    return numbers[0];
}

int main() {
    char input_by_user[MAX_SIZE];
    scanf("%[^\n]", input_by_user);
    
    ll result = resulting(input_by_user);
    if (result == -1) {
        printf("Error: Division by zero\n");
    }
    else {
        printf("%lld\n", result);
    }

    return 0;
}

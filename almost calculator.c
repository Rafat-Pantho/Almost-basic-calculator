// A code that reads the user input integers and operators as one single text

#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

typedef long long ll;
typedef unsigned int ui;

#define f(i, n) for (ui i = 0; i < n; i++)
#define MAX_SIZE 100000

typedef struct store_result{
    double result_of_calc;
    int invalid;
}store_result;

double operation(double num1, double num2, char op) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
        default:
            return 0;
    }
}

void resulting(store_result *res,const char *user_input) {
    double numbers[MAX_SIZE] = {0};
    ui i = 0;
    char operators[MAX_SIZE] = {0};

    // Separating numbers and operators
    for (const char *ptr = user_input; *ptr != '\0'; ptr++) {
        if (isdigit(*ptr)) numbers[i] = numbers[i] * 10 + (*ptr - '0');
        else {
            operators[i] = *ptr;
            i++;
        }
    }

    f(j, i) {
        if (numbers[j+1]==0 && operators[j]=='/'){
            res->invalid=-1;
            return;
        }
        numbers[0]=operation(numbers[0],numbers[j+1],operators[j]);
    }
    res->result_of_calc=numbers[0];
}

int main() {
    char input_by_user[MAX_SIZE];
    scanf("%[^\n]", input_by_user);

    store_result res;

    res.result_of_calc=0;
    res.invalid=0;

    resulting(&res, input_by_user);

    if (res.invalid == -1) printf("Error: Division by zero\n");
    else  printf("%g\n", res.result_of_calc);

    return 0;
}

// Almost basic calculator
// Can do basic calculations


#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

typedef long long int ll;
typedef unsigned int ui;

#define f(i, n) for (ui i = 0; i < n; i++)
#define max 10000000

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

ll resulting(char *user_input){
    ll numbers[max]={0};
    ui i = 0;
    char operators[max];

    // separating numbers and operators
    for(char *ptr = user_input;*ptr!='\0';ptr++){
        if(isdigit(*ptr))numbers[i]=numbers[i]*10+(*ptr-'0');
        else{
            operators[i]=*ptr;
            i++;
        }
    }

    f(j,i) {
        ll the_calculated = operation(numbers[0], numbers[j + 1], operators[j]);
        if (the_calculated==-1) return -1;
        numbers[0]=the_calculated;
    }

    return numbers[0];
}

int main(){
    char iput_by_user[max];
    scanf("%[^\n]s",iput_by_user);
    
    printf("%lld",resulting(iput_by_user));
    
    return 0;
}

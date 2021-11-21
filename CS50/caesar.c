#include <stdio.h>
#include <cs50.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, string argv[])
{

    if ( argc == 2 )
    {
        int key = atoi(argv[1]);
        
        int cipher = key % 26;
        
        for ( int j = 0; j <= (strlen(argv[1])); j++)
        {
            if (isalpha( argv[1][j]))
            {
                printf("Usage: ./caesar key \n");
                // Return early for badly formed argument
                return 1;
            }
        }
        string plain = get_string("plaintext: ");
        int n = strlen(plain);
        

            for ( int i=0; i<n; i++ )
            {

                if ( plain[i]>='A' && plain[i]<='Z' )
                {
                    if ( plain[i] + cipher <= 'Z')
                    {
                        plain[i] += cipher;
                    }
                    else
                    {
                        plain[i] = 'A' + cipher - 1 + plain[i] - 'Z' ;
                    }
                }

                else if ( plain[i] >= 'a' && plain[i] <= 'z' )
                {
                    if (plain[i] + cipher <= 'z')
                    {
                        plain[i] += cipher ;
                    }

                    else
                    {
                        plain[i] = 'a' + cipher - 1 + plain[i] - 'z' ;
                    }

                }

            }
        
            
            printf("ciphertext:%s\n", plain);
            return 0;

    }
    printf("Usage: ./caesar key\n");
    return 1;
}

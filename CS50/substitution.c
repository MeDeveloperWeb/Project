#include <stdio.h>
#include <cs50.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, string argv[])
{
    if (argc == 2 && strlen(argv[1]) == 26)
    {
        string upper_key = argv[1] ;
        char lower_key[26] ;

        string upcase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        char lowcase[26] ;


        for (int i = 0 ; i < 26 ; i++)
        {
            upper_key[i] = toupper(upper_key[i]);
            lower_key[i] = tolower(upper_key[i]);
            lowcase[i]   = tolower(upcase[i]);

        }
        
        for (int i = 0 ; i < 26 ; i++)
        {
            for (int j = i + 1 ; j < 26 ; j++)
            {
                if (upper_key[i] == upper_key[j])
                {
                    printf("Enter valid key.\n");
                    return 1 ;
                }

            }
            if (upper_key[i]<'A' || upper_key[i]>'Z')
            {
                    printf("Enter valid key.\n");
                    return 1 ;
            }
        }
        string plain = get_string("plaintext:");

        for (int i = 0 ; i < strlen(plain) ; i++)
        {
           for (int j = 0 ; j < 26 ; j++)
           {
                if (plain[i] == upcase[j])
                {
                    plain[i] = upper_key[j] ;
                    break;
                }
                if (plain[i] == lowcase[j])
                {
                    plain[i] = lower_key[j] ;
                    break;
                }
                
           }
        }

        printf("ciphertext: %s\n", plain);
        return 0;
    }
    printf("Enter valid key.\n");
    return 1 ;
}

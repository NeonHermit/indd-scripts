## InDesign scripts and some GREP patterns:
<br />

Place the scripts in the user scripts folder with the exeption of the helperUtil folder (and replace the paths in the script).  
Tested with Adobe InDesign CC2020 on Windows.

* BatchReplaceText - [Batch replace text](https://github.com/NeonHermit/indd-scripts/tree/main/BatchReplaceText)  
* Batch Relink - [BatchRelink](https://github.com/NeonHermit/indd-scripts/tree/main/BatchRelink)
* Fractions - [Fractions](https://github.com/NeonHermit/indd-scripts/tree/main/Fractions)  
* LaTeX to InDesign - [LaTextoIndd](https://github.com/NeonHermit/indd-scripts/tree/main/LaTextoIndd)  


### GREP patterns: 

* Change from a) to a. [when a) is on a newline before or after a tab character]:  
    Find:
    ```regex
    (?<=\<[\l\u])\)
    ```
    Replace:
    ```regex
    .
    ```  

* Decimal point to decimal comma:  
    Find:
    ```regex 
    (\d)(\.)(\d)
    ```
    Replace:
    ```regex
    $1,$3
    ```  

* Space after comma:  
    Find:
    ```regex
    (,)(\w)
    ```
    Replace:
    ```regex
    $1 $2
    ```

* Commas followed by letters:  
    Find:
    ```regex
    ,(?=[\u\l])
    ```
    Replace:
    ```regex
    $0
    ```

* Any comma after which a number or whitespace does not follow:  
    Find:
    ```regex
    ,(?=[^\s\d])
    ```
    Replace:
    ```regex
    malce e somnitelen receptot!
    ```

* Remove any space at the beginning of a paragraph:  
    Find:
    ```regex
    ^ +?(.)
    ```
    Replace:
    ```regex
    $1
    ```

* Delete tabs at the beginning of a newline:  
    Find:
    ```regex
    ^\t(.)
    ```
    Replace:
    ```regex
    $1
    ```  

* Find a number followed by a letter and add a space (e.g., 10g -> 10 g):  
    Find:
    ```regex
    (\d)([\l\u])
    ```

    Replace:
    ```regex
    $1 $2
    ```
# intro-app-dev-2021-s1-project-1-ZachariahPepper
intro-app-dev-2021-s1-project-1-ZachariahPepper created by GitHub Classroom

# URL's to application and API:
URL to react app on Heroku: https://app-dev-library.herokuapp.com  

# Development Setup
## API
After cloning the repository, go to your C: Drive and open your client (In my case Laragon) and create a folder named www.
open www and move the practical folder from the cloned repo to the www folder. from here open your client and press the start button,
then click the database button and open the laragon session, from here right click where it says laragon > create new > database.
close the window and now click the terminal button, change to the api root directory by entering the command ```cd practical```
From here enter the command ```composer install``` and wait for the process to finish. Then enter the command ```php artisan migrate```
to run the migrations and then enter command ```php artisan db:seed``` to seed the database with data. the command ```code .``` can be entered
to begin development. to view the data enter ```php artisan serve``` in the terminal.  

## React App  
After cloning the repository, open the folder with visual studio code, then open a new terminal and enter ```npm install```  
after the install has finished development can begin. to view the app simply type ```npm start``` in the terminal and a new window will open in the browser  

# How to run tests:
There are only tests for the API, not React app.  
In your chosen client, open the terminal and enter the command ".\vendor\bin\phpunit" or "php artisan test"  

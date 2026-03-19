# Prompt History

1. Context: a web-page that shows the user a graph for average 100 m times for pool swim sessions from Strava. The user should have the possiblity to enter a Strava activity id (e.g. 17775830712) and the system should use the Strava API v3 to GET the activity (https://developers.strava.com/docs/reference/) Aestethic: a clean dashboard layout with a graph showing a date on the x-axis and average 100 m time on the y-axis Stack: Typescript for frontend, Kotlin for backend, persistence layer should be a file Experience: calm, focused and distraction-free

2. I get a 404 and 'activity not found' when adding an activity. What is the error? Wrong token? There is nothing in the logs

3. where can I see the logs?

4. i get "Strava API error for activity 17775830712: Activity not found on Strava", print the raw error message from Strava

5. i get Strava API 404: {"message":"Resource Not Found","errors":[{"resource":"Activity","field":"","code":"not found"}]}, but the activity exists (https://www.strava.com/activities/17621499386)

7. Unexpected special floating-point value Infinity. By default, non-finite floating point values are prohibited because they do not conform JSON specification. It is possible to deserialize them using 'JsonBuilder.allowSpecialFloatingPointValues = true' Current output: [ { "id": 17621499386, "name": "Tøyenbadet 1500m", "date": "2026-03-06", "avgPace100m": Infinity

8. how can i permanently change the scope of the access_token to read_all?

9. how do i change my refresh token at https://www.strava.com/settings/api

10. i have a refresh token with scope read_all, how can I save it so that this app always uses it?

11. i want to save these in an .env file

12. some activities need to be manually edited as the distance may not be correct. Create the possibility to click an activity in the graph and make it possible to edit the distance. Then re-draw the graph and persist the edited value

13. I can not see the edit field

14. clicking an activity yields an empty page

15. new pace is not calculated correctly

16. make it possible to delete an activity from the graph

17. show the distance when hovering over a data point

18. when clicking a data point, add a field showing the URL, e.g. https://www.strava.com/activities/649702336

19. create the repo at github.com with an MIT license

20. the dates on the graph should be ISO 8601. Oldest dates to the left

21. save all my prompts in this session in a prompt history file in this repo. All my future prompts should also go into that file

22. add a dependabot github action that automatically updates both frontend and backend dependencies

23. update the Getting started section in README.md to show the reduced need to enter TOKEN and SECRET on the CLI when starting the backend

24. merge all Pull Requests

25. fix frontend npm install

26. adjust the x-axis to visualize the time difference between activities

27. undo

28. labels on x-axis should be vertical

29. make the x-axis longer so that all labels are visible

30. increase chart width

31. in Routes.kt, the logger used is not the one configured

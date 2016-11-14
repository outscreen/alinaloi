# alinaloi

###Frontend: 
Angular app for alinaloi.com in 'public' folder.

###Node:
Robots battle model in 'modules' folder. No front-end yet, all results are presented to user in JSON format. 

###Router (modules/core/router):
Takes json configuration of routes from modules/web/_folder_name_/routes.json and registers them as hapi.js routes.
Properties:
* method - request method
* path - request path
* isAbsolute - is path absolute (starting from '/'). If falsy, the path will be '/_folder_name_/_path_'
* controller - name of hadler. Handlers are stored in modules/web/_folder_name_/controller.js
* session - if session is required for this route. If true, upon request check if sessionKey cookie is present. If sessionKey is present, finds session object in Mongo, sets instance of Session to request.session. If sessionKey is absent, sets default session to requestion.session and sets sessionKey cookie upon reply. 

###Session (modules/core/session):
Provides mechanism for session object retrival/update. Retrieves session object upon request, sets instance of Session to request.session. Stores keys that we set/update in _set object, deleted in _unset object. In case upon reply we have something to set/unset, update session object in Mongo.

###User flow:
When user accesses GET /robots (modules/web/robots/battle), check if there is a robot id in user session. 
- If no robot id found, create a new robot and add it to battle.
- If robot id found, check if robot is in Battle.allActiveRobots. 
- If yes, it means that the battle is not completed, return robot info and a script that should update the page in a while to get updated data. 
- If robot is not found in allActiveRobots, it means that the battle is completed and robot should be searched in Mongo. Get info from Mongo and show to user.


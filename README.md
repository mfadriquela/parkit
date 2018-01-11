############################################################################################

Initial setup

Note: Skip step 1 and 2 if you already installed phonegap and git client on your desktop

1. Install phonegap application. Click the link and follow the guide.
    http://docs.phonegap.com/getting-started/1-install-phonegap/desktop/

2. Install tortoisegit. Click the link and download the latest installer. Double click on the installer file and follow the instructions. The 
    installer will take care of the rest. Make sure to install the git bash as well.
    https://tortoisegit.org/download/

    Note: Don't forget to install git bash. It is a command line tool used to execute git commands.

3. Open git bash and go to your project directory. Execute "git clone https://github.com/mfadriquela/parkit.git"

    This will create a directory named parkit, pull the codes from the repo and place it inside the parkit directory

4. using git bash again, go to parkit directory and execute "git checkout dev"

    This will change the working branch to dev.
    We will use dev branch during development and once
    the version is ready for production, will put a tag and merge it to master branch

    You may now start improving the codes.

############################################################################################


############################################################################################

How to push my changes to the repo

Note:
    Before doing any changes, make sure that your local copy is up to date. Execute  "git pull" first.

1. Once your done with your changes, open git bash.

2. Execute "git status".
    This will display the files that you've changed or updated.

3. Execute "git add <file1> <file2> ..." 
    This will add the selected files to the list of files that will be committed 
    If you want to add all the files that you've changed, execute "git add ."

4. Execute "git commit"
    This will add the committed files to the list of files that will be published

5. Execute "git push"
    This will push the published files to the repository

############################################################################################


############################################################################################
How to run parkit on desktop

1. Open phonegap desktop application.

2. Click the "+" icon and select "open existing project".

3. Browse and select parkit folder.

4. The parkit application should be automatically started.
    If not, click the play button to start the application.
    This will start the server and you should see a message
    at the bottom saying "Server is running on http://<ipaddress>:<port>"

5. Open your favorite browser and navigate to the said url

6. You should now see the parkit application

############################################################################################


############################################################################################
How to run parkit on mobile

Note: 
    Make sure that parkit is running on phonegap desktop
    Skip step 1 if you already installed phonegap on your mobile


1. Download and install the phonegap developer app on your mobile.

2. Open the phonegap mobile app. It will ask for ip address and port.
    Use the ip address and port displayed on the phonegap desktop.

3. Tap the connect button.
    It will connect to the phonegap desktop and download all needed files.
    Once done, it should display the parkit application

############################################################################################


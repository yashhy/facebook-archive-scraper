# facebook-archive-scrapper
Facebook (fb) Archive Scrapper. Convert your facebook data to JSON. Helps scrapping your downloaded FB Archive data (zip) and spits out a JSON file with a stunning User Interface.

> Note: This is not Facebook website scrapper. Its Facebook Archive Scrapper. 

# Setting things up :
#### 1. Clone the repo.
#### 2. Login to Facebook in Desktop.
#### 3. Under options choose settings.

![Step 1](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/1.png "Go To Settings")

#### 4. Choose General tab on the left and click "Download a copy"

![Step 2](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/2.png "General Tab > Download a copy")

#### 5. You will be asked to enter your password again.
#### 6. After entering your password, your redirected to the below screen. Click "Download your information"

![Step 3](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/3.png "Download your information")

#### 7. Request My Download dialog, click "Start my Archive"

![Step 4](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/4.png "Start my Archive")

#### 8. Depending upon the Facebook data it may take ~30 mins to 1 hour. Once your Archive is ready you will be notified. Click on the notification.

![Step 5](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/5.png "Notification")

#### 9. On cliking You will be redirected to "Download Archive" screen. Click "Download Archive"

![Step 6](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/6.png "Download Archive")

#### 10. After download, unzip it and paste it inside [profiles](https://github.com/yashhy/facebook-archive-scrapper/tree/master/profiles) folder. I already have a sample FB Archived profile for you. 

***

# Running the Scrapper :

Open your terminal on root folder of the project.

1. `npm install`
2. `npm run scrap-n-display`

After running this you would see the progress of scrapping each profiles in terminal. 

![Progress](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/progress.png "Progress")

Once done the site is up and running at http://127.0.0.1:8888

# Output :

> ![OP-1](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/op-1.png "Output 1")

> ![OP-2](https://raw.githubusercontent.com/yashhy/facebook-archive-scrapper/master/img/tuts/op-2.png "Output 2")

> JSON output will be generated in `master.json` and `gender.json` under root folder.

# Todos :
 * Move angular js/css code to node_modules
 * ~~Tutorials in readme~~
 * 
# production_inventory
## Project Achievements:
Basic CRUD Functionality
- Create inventory items
- Edit Them
- Delete Them
- View a list of them

Categories items
- There are hard-coded 5 cities to choose from
- Each item is associated with a city

3rd Party API utilizing
- Use the API of OpenWeather, each product column shows the information on weather where the inventory is located

Additional function
- Push a button to export .csv file which contains product data

## How to use this project
1. Install node.js https://nodejs.org/en/
```
$ node -v
v16.14.0
```
2. clone the repository to a local drive
```
$ git clone https://github.com/SSun97/production_inventory.git
```
3. Go to repository folder and install dependencies, run the commands below
```
$ cd production_inventory
$ npm install
```
4. Make sure port 3000 on the local machine is avilable (example below showings port 3000 is occupied, need to terminate the Process ID (PID) 70695 before moving on)
```
$ lsof -i :3000 -S
COMMAND   PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    70695 ssun   24u  IPv6 0x91300bb1a86b6d7d      0t0  TCP *:hbci (LISTEN)
```
5. Run the server
```
$ npm start

> inventory_tracking@1.0.0 start
> node server.js
Server is running on port 3000
```
6. In the browser go to the address http://localhost:3000 

## Features added to the project
- The endpoint of the update/view page is using slug of product name instead of product id. It is more user-friendly.
- Names and description strings are trimmed before saving to the file.
- Modal pops up when successfully created or updated the product.
- Product name should be unique, if not, a modal is popped up with an error message.
- Showing weather icons of the city.
- The created report is named by the current day. The new report is replacing the old one on the same day. The previous report is stored in the folder /public/reports. 

## Things that can be done to improve this project
- Use a database like MongoDB instead of the file system. The author chose a file system to store data because it is easier to deploy on the local machine. It doesn't require the user to install the database or provide credentials for an online database.
- Improve security. [Here](https://www.linkedin.com/pulse/from-zero-trust-model-web-security-best-practices-suggestions-sun/?trackingId=2ehBRZb%2Bl90LJjavXg%2F1fA%3D%3D) is my article about this topic.
- Add a confirmation modal for deleting the item.
- Use front-end framework instead of Pug Template package to create front-end pages since Pug generates the HTML code from the server-side. When the I/O volume is high, the burden on the back-end API server will be high.

## Auther
Simon Sun: sunmingyu.97@gmail.com

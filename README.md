# Read me

## How to run:

1. Run `npm install`.
2. Run `node app.js`.

## How to test:

1. Execute the `drop_create_tables.sql` file in the database.
2. Run `node app.js`.
3. Open `http://localhost:3000/pages/register.html`.
4. Enter a name, email, and password. Check the admin checkbox, and then click "Register".
5. You'll be redirected to the login page. Login with the credentials you just created.
6. Go to `http://localhost:3000/pages/admin.html`.
7. Use the "Add category" field to add the categories "Blu-ray" and "4k Blu-ray".
8. Go to `http://localhost:3000/pages/bulk-upload.html`.
9. Upload the `bulk.json` file in the `other` folder. This will add three movies to the database.
10. Go to `http://localhost:3000/pages/disks.html`.
11. Select a disk and add it to cart.
12. Click "Checkou5" and then go to the orders page to view the order.

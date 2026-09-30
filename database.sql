CREATE DATABASE IF NOT EXISTS hallbook;
USE hallbook;

DROP VIEW IF EXISTS v_food_menu;
DROP VIEW IF EXISTS v_active_halls;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS booking_items;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS food_items;
DROP TABLE IF EXISTS decorations;
DROP TABLE IF EXISTS chair_packages;
DROP TABLE IF EXISTS function_halls;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE function_halls(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255),
  capacity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE chair_packages(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE decorations(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE food_items(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  food_type VARCHAR(20) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE bookings(
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id VARCHAR(30) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  event_date DATE NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_items(
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  item_type VARCHAR(30) NOT NULL,
  item_name VARCHAR(150) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_booking_items_booking
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE
);

CREATE TABLE payments(
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  payment_reference VARCHAR(60) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  paid_at TIMESTAMP NULL,
  CONSTRAINT fk_payments_booking
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE
);

INSERT INTO users(name,email,password_hash,role)
VALUES
('Admin','admin@hallbook.com','demo-admin-password','ADMIN'),
('Demo Customer','customer@hallbook.com','demo-customer-password','CUSTOMER');

INSERT INTO function_halls(name,description,capacity,price) VALUES
('Royal Grand Hall','Plain hall • 800 guests',800,45000),
('Crystal Palace','AC hall • 500 guests',500,38000),
('Green Garden Hall','Garden venue • 700 guests',700,55000),
('Pearl Banquet','Premium hall • 350 guests',350,30000),
('Lakshmi Convention','Large hall • 1200 guests',1200,70000),
('Sunrise Mini Hall','Small function • 200 guests',200,18000),
('Golden Crown Hall','Wedding hall • 600 guests',600,52000),
('Lotus Celebration Hall','AC • 450 guests',450,42000);

INSERT INTO chair_packages(name,description,quantity,price) VALUES
('Plastic Chair Pack 100','100 chairs',100,4000),
('Banquet Chair Pack 100','100 padded chairs',100,7500),
('Royal Chair Pack 100','Cushioned premium chairs',100,12000),
('Chiavari Chair Pack 100','Elegant wedding chairs',100,15000),
('White Cover Chair 100','White covers included',100,8000),
('Gold Chair 100','Gold finish chairs',100,14000),
('VIP Sofa Seating','10 sofa sets',10,18000),
('Kids Chair Pack 50','50 colorful chairs',50,2500);

INSERT INTO decorations(name,description,price) VALUES
('Classic Stage Decor','Backdrop + flowers + lights',18000),
('Royal Wedding Decor','Premium stage + floral setup',35000),
('Floral Entrance','Fresh-style floral entrance',12000),
('LED Stage Package','LED wall + stage lights',28000),
('Mandap Decoration','Traditional mandap setup',25000),
('Reception Backdrop','Elegant reception backdrop',14000),
('Balloon Decoration','Theme balloon package',8000),
('Premium Table Decor','Centerpieces + table styling',16000);

INSERT INTO food_items(name,food_type,description,price) VALUES
('Paneer Butter Masala','VEG','Catering portion • vegetarian',120),
('Kadai Paneer','VEG','Catering portion • vegetarian',125),
('Palak Paneer','VEG','Catering portion • vegetarian',130),
('Shahi Paneer','VEG','Catering portion • vegetarian',135),
('Veg Biryani','VEG','Catering portion • vegetarian',140),
('Jeera Rice','VEG','Catering portion • vegetarian',145),
('Gobi Manchurian','VEG','Catering portion • vegetarian',150),
('Veg Noodles','VEG','Catering portion • vegetarian',155),
('Masala Dosa','VEG','Catering portion • vegetarian',160),
('Idli Sambar','VEG','Catering portion • vegetarian',165),
('Medu Vada','VEG','Catering portion • vegetarian',170),
('Chole Bhature','VEG','Catering portion • vegetarian',175),
('Dal Tadka','VEG','Catering portion • vegetarian',180),
('Dal Makhani','VEG','Catering portion • vegetarian',185),
('Aloo Gobi','VEG','Catering portion • vegetarian',190),
('Veg Kurma','VEG','Catering portion • vegetarian',195),
('Mushroom Masala','VEG','Catering portion • vegetarian',200),
('Baby Corn Fry','VEG','Catering portion • vegetarian',205),
('Gobi 65','VEG','Catering portion • vegetarian',210),
('Vegetable Pulao','VEG','Catering portion • vegetarian',215),
('Curd Rice','VEG','Catering portion • vegetarian',220),
('Rasam','VEG','Catering portion • vegetarian',225),
('Sambar','VEG','Catering portion • vegetarian',230),
('Chapati','VEG','Catering portion • vegetarian',235),

('Chicken Biryani','NON_VEG','Catering portion • non-vegetarian',180),
('Mutton Biryani','NON_VEG','Catering portion • non-vegetarian',188),
('Chicken 65','NON_VEG','Catering portion • non-vegetarian',196),
('Chicken Tikka','NON_VEG','Catering portion • non-vegetarian',204),
('Butter Chicken','NON_VEG','Catering portion • non-vegetarian',212),
('Chicken Curry','NON_VEG','Catering portion • non-vegetarian',220),
('Mutton Curry','NON_VEG','Catering portion • non-vegetarian',228),
('Mutton Fry','NON_VEG','Catering portion • non-vegetarian',236),
('Fish Fry','NON_VEG','Catering portion • non-vegetarian',244),
('Fish Curry','NON_VEG','Catering portion • non-vegetarian',252),
('Prawn Masala','NON_VEG','Catering portion • non-vegetarian',260),
('Prawn Fry','NON_VEG','Catering portion • non-vegetarian',268),
('Chicken Kebab','NON_VEG','Catering portion • non-vegetarian',276),
('Chicken Lollipop','NON_VEG','Catering portion • non-vegetarian',284),
('Tandoori Chicken','NON_VEG','Catering portion • non-vegetarian',292),
('Egg Curry','NON_VEG','Catering portion • non-vegetarian',300),
('Egg Biryani','NON_VEG','Catering portion • non-vegetarian',308),
('Pepper Chicken','NON_VEG','Catering portion • non-vegetarian',316),
('Chilli Chicken','NON_VEG','Catering portion • non-vegetarian',324),
('Chicken Manchurian','NON_VEG','Catering portion • non-vegetarian',332),
('Mutton Biryani Special','NON_VEG','Catering portion • non-vegetarian',340),
('Fish Tikka','NON_VEG','Catering portion • non-vegetarian',348),
('Chicken Chettinad','NON_VEG','Catering portion • non-vegetarian',356),
('Mutton Korma','NON_VEG','Catering portion • non-vegetarian',364);

CREATE VIEW v_food_menu AS
SELECT id,name,food_type,description,price
FROM food_items
WHERE active=TRUE;

CREATE VIEW v_active_halls AS
SELECT id,name,description,capacity,price
FROM function_halls
WHERE active=TRUE;

SELECT 'Database created successfully' AS message;
SELECT COUNT(*) AS vegetarian_items FROM food_items WHERE food_type='VEG';
SELECT COUNT(*) AS non_vegetarian_items FROM food_items WHERE food_type='NON_VEG';

CREATE DATABASE IF NOT EXISTS pet_clinic;
USE pet_clinic;

CREATE TABLE Client (
  client_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(20)
);

CREATE TABLE Pet (
  pet_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  pet_name VARCHAR(100),
  species VARCHAR(50),
  breed VARCHAR(100),
  age INT,
  FOREIGN KEY (client_id) REFERENCES Client(client_id)
);

CREATE TABLE Product (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  stock_quantity INT
);

CREATE TABLE CartItem (
  cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  product_id INT,
  quantity INT,
  FOREIGN KEY (client_id) REFERENCES Client(client_id),
  FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE `Order` (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  total_price DECIMAL(10,2),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES Client(client_id)
);

CREATE TABLE OrderItem (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES `Order`(order_id),
  FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE Doctor (
  doctor_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  specialization VARCHAR(100)
);

CREATE TABLE Service (
  service_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2)
);

CREATE TABLE Appointment (
  appointment_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  pet_id INT,
  doctor_id INT,
  service_id INT,
  appointment_date DATETIME,
  status VARCHAR(50),
  FOREIGN KEY (client_id) REFERENCES Client(client_id),
  FOREIGN KEY (pet_id) REFERENCES Pet(pet_id),
  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id),
  FOREIGN KEY (service_id) REFERENCES Service(service_id)
);

CREATE TABLE MedicalNote (
  note_id INT PRIMARY KEY AUTO_INCREMENT,
  pet_id INT,
  doctor_id INT,
  note_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES Pet(pet_id),
  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
);

CREATE TABLE Payment (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  amount DECIMAL(10,2),
  method VARCHAR(50),
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES `Order`(order_id)
);

CREATE TABLE ChatbotMessage (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  message_text TEXT,
  response_text TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  prevmessage INT,
  FOREIGN KEY (client_id) REFERENCES Client(client_id),
  FOREIGN KEY (prevmessage) REFERENCES ChatbotMessage(message_id)
);

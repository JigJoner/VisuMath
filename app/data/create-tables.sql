
CREATE TABLE IF NOT EXISTS student(
    ID int NOT NULL AUTO_INCREMENT,
    userName VARCHAR(50),
    firstName VARCHAR(20),
    lastName VARCHAR(20),
    email VARCHAR(20),
    password VARCHAR(50),
    PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS post(
    ID int NOT NULL AUTO_INCREMENT,
    userID int NOT NULL, 
    date VARCHAR(12),
    time VARCHAR(15),
    text VARCHAR(500),
    views int NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (userID) REFERENCES student(ID) ON UPDATE CASCADE ON DELETE CASCADE
);
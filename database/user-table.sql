create table users(
     id serial primary key,
     login varchar(255) unique, 
     password varchar(255),
     diskSpace decimal default 8589934592,
     usedSpace decimal default 0
);
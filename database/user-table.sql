create table users(
     id serial primary key,
     login varchar(255) unique, 
     password varchar(255),
     diskSpace decimal default 52428800,
     usedSpace decimal default 0
);
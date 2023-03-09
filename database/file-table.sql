create table files(
     id serial primary key,
     name varchar(255),
     type varchar(255),
     link varchar(255),
     size decimal,
     path varchar(255),
     user_id integer,
     parent_id integer,
     foreign key (user_id) references users (id)
);
create table files(
     id serial primary key,
     name varchar(255),
     type varchar(255),
     link varchar(255),
     size decimal,
     user_id integer,
     parent_id decimal,
     foreign key (user_id) references users (id)
);
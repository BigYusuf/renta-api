
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4(),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    image VARCHAR(255),
    is_admin BOOLEAN DEFAULT false,
    social_login BOOLEAN DEFAULT false,
    social_provider BOOLEAN,
	created_at TIMESTAMP DEFAULT current_date,
    modified_at TIMESTAMP,
    deleted_at TIMESTAMP,
  	PRIMARY KEY(id)
);

CREATE TABLE tokens_master(
  token_type int,
  token_name VARCHAR(500) NOT NULL,
  token_desc VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,
  PRIMARY KEY(token_type)
);

--insert into tokens_master(token_type, token_name, token_desc) values( 1, 'EMAIL_CONF','Email confirmation');
--insert into tokens_master(token_type, token_name, token_desc) values( 2, 'PASS_RST','Password Reset');

CREATE TABLE tokens(
  token_id uuid DEFAULT uuid_generate_v4(),
  token_type int not null,
  id uuid,
  token VARCHAR(500),
  token_name VARCHAR(500) NOT NULL,
  token_desc VARCHAR(500) NOT NULL,
  consumed_at TIMESTAMP,
  consume_by DATE,
  created_at TIMESTAMP,
  PRIMARY KEY(token_id),
  CONSTRAINT FK_users_tokens FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE social(
  social_id uuid DEFAULT uuid_generate_v4(),
  id uuid,
  social_provider VARCHAR(255),
  social_provider_uid VARCHAR(255),
  social_provider_name VARCHAR(255),
  social_provider_email VARCHAR(255),
  social_date DATE DEFAULT current_date,
  PRIMARY KEY(social_id),
  CONSTRAINT FK_users_social FOREIGN KEY (id)
    REFERENCES users(id)
);

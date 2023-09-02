CREATE DATABASE IF NOT EXISTS test;
USE test;

CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  content TEXT NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);


/*  */
-- Insert sample post
INSERT INTO posts (title, content) 
VALUES ('Hello World', 'This is my first post!');

-- Insert sample comment
INSERT INTO comments (post_id, content)
VALUES (1, 'Great post!'); 

-- Get post and comments
SELECT 
  p.id, p.title, p.content, 
  c.id AS comment_id, c.content AS comment_content
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.id = 1;
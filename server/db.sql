CREATE TYPE priority_level AS ENUM ('Low', 'Medium', 'High');

CREATE TABLE priority(
id SERIAL PRIMARY KEY,
name priority_level NOT NULL
);

CREATE TABLE task(
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
title VARCHAR(50) NOT NULL CHECK (LENGTH(title) > 0),
description TEXT,
priority_id INTEGER,
FOREIGN KEY (priority_id) REFERENCES priority(id)
);

INSERT INTO priority (name) VALUES
('Low'),
('Medium'),
('High');

INSERT INTO task (title, description, priority_id) VALUES
('Buy groceries', 'Buy milk, eggs, and bread from the supermarket.', 2),
('Finish project report', 'Complete the final draft of the project report by Friday.', 3),
('Clean the house', 'Vacuum, dust, and mop the entire house.', 1),
('Prepare presentation', 'Prepare slides for the upcoming client meeting.', 3),
('Schedule meeting with team', 'Organize a meeting to discuss project milestones.', 2),
('Renew gym membership', 'Renew the gym membership for the next quarter.', 1);

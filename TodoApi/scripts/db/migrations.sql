CREATE SCHEMA IF NOT EXISTS tasks;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tasks.todos
(
    id UUID default uuid_generate_v4 () NOT NULL PRIMARY KEY,
    task TEXT NOT NULL,
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    deadline_date DATE NOT NULL,
    more_details TEXT,
    parent_todo_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') NOT NULL,
    FOREIGN KEY (parent_todo_id) REFERENCES tasks.todos(id)
);

-- seed some data. this doesn't have any subtasks yet, we can manually add them later
INSERT INTO tasks.todos (task, is_complete, deadline_date, more_details, parent_todo_id, created_at, updated_at)
VALUES
('Complete project documentation', FALSE, '2023-10-15', 'Finish writing the project documentation.', NULL, NOW(), NOW()),
('Review codebase', TRUE, '2023-09-10', 'Perform a thorough code review.', NULL, NOW(), NOW()),
('Update dependencies', FALSE, '2023-11-01', NULL, NULL, NOW(), NOW()),
('Finalize UI design', TRUE, '2023-08-25', 'Confirm the final designs with the design team.', NULL, NOW(), NOW()),
('Deploy to staging environment', FALSE, '2023-10-05', NULL, NULL, NOW(), NOW()),
('Conduct user testing sessions', FALSE, '2023-11-15', 'Schedule and conduct user testing.', NULL, NOW(), NOW()),
('Fix reported bugs', FALSE, '2023-12-01', NULL, NULL, NOW(), NOW()),
('Prepare presentation for stakeholders', TRUE, '2023-09-20', 'Include key findings and next steps.', NULL, NOW(), NOW()),
('Optimize database queries', FALSE, '2023-10-25', NULL, NULL, NOW(), NOW()),
('Renew SSL certificates', TRUE, '2023-09-30', 'Check all domain certificates.', NULL, NOW(), NOW()),
('Write a blog post on project learnings', FALSE, '2023-12-10', 'Share insights on the company blog.', NULL, NOW(), NOW()),
('Refactor login module', TRUE, '2023-08-05', 'Improve the code quality and security.', NULL, NOW(), NOW()),
('Design a new app icon', FALSE, '2023-11-20', 'Collaborate with the design team.', NULL, NOW(), NOW()),
('Set up CI/CD pipeline', TRUE, '2023-09-15', 'Automate the build and deployment process.', NULL, NOW(), NOW()),
('Implement feature toggles', FALSE, '2023-10-30', NULL, NULL, NOW(), NOW()),
('Conduct performance review meetings', TRUE, '2023-09-05', 'Review team performance and set goals.', NULL, NOW(), NOW()),
('Upgrade server hardware', FALSE, '2023-11-05', 'Assess current needs and procure new hardware.', NULL, NOW(), NOW()),
('Organize team building activities', TRUE, '2023-09-25', 'Plan both online and offline activities.', NULL, NOW(), NOW()),
('Clean up old project files', FALSE, '2023-12-15', NULL, NULL, NOW(), NOW()),
('Plan next quarter roadmap', TRUE, '2023-08-30', 'Outline key objectives and initiatives.', NULL, NOW(), NOW());


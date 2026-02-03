-- Migration script to add courses and course contents

-- 1. Create Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Course Contents Table
-- This table stores the modules and lessons for each course in JSON format
CREATE TABLE IF NOT EXISTS course_contents (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE UNIQUE,
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Initial Courses (Optional: seeding from existing hardcoded data)
INSERT INTO courses (name, description) VALUES 
('JS', 'JavaScript : Le Langage du Web'),
('Python', 'Python : Le Langage Polyvalent')
ON CONFLICT (name) DO NOTHING;

-- Note: We don't strictly need to migrate the JSON content right now 
-- as the frontend has fallbacks, but we could seed it here if needed.

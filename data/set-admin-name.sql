UPDATE users
SET name = 'Waqar'
WHERE email = 'waqarrkhokhar@gmail.com' OR role = 'Super Admin';

SELECT name, email, role FROM users ORDER BY created_at;

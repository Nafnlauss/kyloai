-- Set Leonardo as admin user
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'leonardovyguimaraes@proton.me';

-- If user doesn't exist yet, this will create it with admin role when they first register
-- The application will automatically set them as admin on first login
-- Add username column to profiles table
ALTER TABLE public.profiles ADD COLUMN username TEXT;

-- Add unique constraint for username (case-insensitive)
CREATE UNIQUE INDEX profiles_username_key ON public.profiles (LOWER(username));

-- Add check constraint for username format (alphanumeric, underscore, hyphen, 3-30 chars)
ALTER TABLE public.profiles ADD CONSTRAINT username_format 
CHECK (username ~ '^[a-zA-Z0-9_-]{3,30}$');
-- Permissions hardening migration
-- Adds pending-photo review columns so a *replacement* photo can be staged
-- without clobbering the live image, and so gyms get the same review flow as
-- equipment. Idempotent: safe to run more than once.

-- Equipment: stage replacement photos (photo_status / photo_uploaded_by / _at already exist)
ALTER TABLE public.equipment
    ADD COLUMN IF NOT EXISTS pending_image_url text;

-- Gyms: full photo-review column set (previously gym photos were instant + unreviewable)
ALTER TABLE public.gyms
    ADD COLUMN IF NOT EXISTS pending_image_url text,
    ADD COLUMN IF NOT EXISTS photo_status text,
    ADD COLUMN IF NOT EXISTS photo_uploaded_by uuid,
    ADD COLUMN IF NOT EXISTS photo_uploaded_at timestamp without time zone;

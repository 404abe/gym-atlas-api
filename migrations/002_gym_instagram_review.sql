-- Gym Instagram review migration
-- Lets community members suggest an Instagram handle for a gym that has none.
-- The suggestion is staged in pending_instagram and left for admin approval so
-- the live handle is never set without review. Mirrors the weight-stack flow.
-- Idempotent: safe to run more than once.

ALTER TABLE public.gyms
    ADD COLUMN IF NOT EXISTS pending_instagram text,
    ADD COLUMN IF NOT EXISTS instagram_status text,
    ADD COLUMN IF NOT EXISTS instagram_submitted_by uuid;

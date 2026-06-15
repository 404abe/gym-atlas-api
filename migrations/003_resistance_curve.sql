ALTER TABLE equipment
  ADD COLUMN IF NOT EXISTS resistance_curve JSONB;

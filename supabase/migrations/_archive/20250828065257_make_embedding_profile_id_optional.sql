-- Make profile_id column optional for more flexible embeddings storage
ALTER TABLE profile_embeddings
  ALTER COLUMN profile_id DROP NOT NULL;

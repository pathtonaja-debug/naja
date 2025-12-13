-- Clean up ALL duplicate habits (not just Prayer), keeping only the oldest one per user per name per category
DELETE FROM habits h
WHERE EXISTS (
    SELECT 1 
    FROM habits h2 
    WHERE h2.user_id = h.user_id 
      AND h2.name = h.name 
      AND h2.category = h.category
      AND h2.created_at < h.created_at
  );

-- Now create the unique index
CREATE UNIQUE INDEX IF NOT EXISTS habits_unique_name_per_user 
ON habits (user_id, name, category);
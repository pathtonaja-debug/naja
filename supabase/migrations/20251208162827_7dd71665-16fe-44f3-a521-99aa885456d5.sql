-- Fix: Add INSERT policy for notifications table
-- This allows users to create their own notifications (habit reminders, prayer alerts, etc.)

CREATE POLICY "Users can create their own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
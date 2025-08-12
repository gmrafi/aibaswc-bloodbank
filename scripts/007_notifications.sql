-- Create notifications table for real-time features
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('blood_request', 'donor_registered', 'donation_completed', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    blood_group TEXT,
    location TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON public.notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.clerk_user_id = auth.uid() 
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- Create function to automatically create notifications for blood requests
CREATE OR REPLACE FUNCTION create_blood_request_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for admins when blood request is created
    INSERT INTO public.notifications (
        type, 
        title, 
        message, 
        priority, 
        blood_group,
        metadata
    ) VALUES (
        'blood_request',
        'New Blood Request',
        'A new blood request has been submitted that requires attention.',
        CASE 
            WHEN NEW.urgency = 'urgent' THEN 'urgent'
            WHEN NEW.urgency = 'high' THEN 'high'
            ELSE 'medium'
        END,
        NEW.blood_group,
        jsonb_build_object(
            'request_id', NEW.id,
            'urgency', NEW.urgency,
            'quantity', NEW.quantity,
            'hospital', NEW.hospital
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for blood requests
CREATE TRIGGER blood_request_notification_trigger
    AFTER INSERT ON public.requests
    FOR EACH ROW
    EXECUTE FUNCTION create_blood_request_notification();

-- Create function to notify when donor registers
CREATE OR REPLACE FUNCTION create_donor_registration_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification when new donor profile is created
    IF NEW.blood_group IS NOT NULL THEN
        INSERT INTO public.notifications (
            type,
            title,
            message,
            priority,
            user_id,
            blood_group,
            metadata
        ) VALUES (
            'donor_registered',
            'New Blood Donor Registered',
            'A new donor has registered with blood group ' || NEW.blood_group || '.',
            'low',
            NEW.clerk_user_id,
            NEW.blood_group,
            jsonb_build_object(
                'donor_id', NEW.clerk_user_id,
                'department', NEW.department,
                'batch', NEW.batch
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for donor registrations
CREATE TRIGGER donor_registration_notification_trigger
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_donor_registration_notification();

-- Add comments for documentation
COMMENT ON TABLE public.notifications IS 'Real-time notifications for the blood bank system';
COMMENT ON COLUMN public.notifications.type IS 'Type of notification: blood_request, donor_registered, donation_completed, system';
COMMENT ON COLUMN public.notifications.priority IS 'Priority level: low, medium, high, urgent';
COMMENT ON COLUMN public.notifications.metadata IS 'Additional data specific to the notification type';
COMMENT ON COLUMN public.notifications.blood_group IS 'Blood group if relevant to the notification';
COMMENT ON COLUMN public.notifications.location IS 'Location if relevant to the notification';

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

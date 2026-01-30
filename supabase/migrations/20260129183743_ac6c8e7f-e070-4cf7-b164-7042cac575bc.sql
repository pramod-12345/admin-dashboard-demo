-- Create users table for the admin dashboard
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users only
CREATE POLICY "Authenticated users can view all users" 
ON public.users 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create users" 
ON public.users 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update users" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete users" 
ON public.users 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.users (name, email, phone, status) VALUES
  ('John Smith', 'john.smith@example.com', '+1 (555) 123-4567', true),
  ('Emily Johnson', 'emily.johnson@example.com', '+1 (555) 234-5678', true),
  ('Michael Davis', 'michael.davis@example.com', '+1 (555) 345-6789', false),
  ('Sarah Wilson', 'sarah.wilson@example.com', '+1 (555) 456-7890', true),
  ('David Brown', 'david.brown@example.com', '+1 (555) 567-8901', true),
  ('Lisa Anderson', 'lisa.anderson@example.com', '+1 (555) 678-9012', false),
  ('James Taylor', 'james.taylor@example.com', '+1 (555) 789-0123', true),
  ('Jennifer Martinez', 'jennifer.martinez@example.com', '+1 (555) 890-1234', true);
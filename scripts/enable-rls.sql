-- Enable RLS on all public tables
ALTER TABLE public.fibonrose_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pinksync_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asl_proficiency_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Fibonrose Identities Policies
CREATE POLICY "Users can view their own identities"
    ON public.fibonrose_identities
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own identities"
    ON public.fibonrose_identities
    FOR UPDATE
    USING (auth.uid() = user_id);

-- PinkSync Services Policies
CREATE POLICY "Authenticated users can view services"
    ON public.pinksync_services
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage services"
    ON public.pinksync_services
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- Projects Policies
CREATE POLICY "Users can view their own projects"
    ON public.projects
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Colors Policies (if this is a reference table)
CREATE POLICY "Anyone can view colors"
    ON public.colors
    FOR SELECT
    TO authenticated
    USING (true);

-- ASL Proficiency Tests Policies
CREATE POLICY "Users can view their own test results"
    ON public.asl_proficiency_tests
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can take tests"
    ON public.asl_proficiency_tests
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Credential Verification Policies
CREATE POLICY "Users can view their own verifications"
    ON public.credential_verification
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can submit verifications"
    ON public.credential_verification
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage verifications"
    ON public.credential_verification
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Trust Flags Policies
CREATE POLICY "Users can view their own trust flags"
    ON public.trust_flags
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage trust flags"
    ON public.trust_flags
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- Trust Relationships Policies
CREATE POLICY "Users can view their own trust relationships"
    ON public.trust_relationships
    FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = trusted_user_id);

CREATE POLICY "Users can create trust relationships"
    ON public.trust_relationships
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Trust Scores Policies
CREATE POLICY "Users can view their own trust scores"
    ON public.trust_scores
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage trust scores"
    ON public.trust_scores
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- Users Policies
CREATE POLICY "Users can view their own data"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND 'admin' = ANY(roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
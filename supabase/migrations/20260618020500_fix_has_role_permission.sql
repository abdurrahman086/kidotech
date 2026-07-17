
-- Grant EXECUTE on has_role to authenticated so RLS policies can use it
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

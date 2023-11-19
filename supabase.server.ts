import { createServerClient } from '@supabase/auth-helpers-remix';
import { createClient } from '@supabase/supabase-js';
import type { Database } from 'db_types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export default ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  return createServerClient<Database>(
    supabaseUrl as string,
    supabaseKey as string,
    {
      request,
      response,
    }
  );
};

import CreateServersupabase from 'supabase.server';

type ApiCall = {
  request: Request;
  response: Response;
};

export const getShifts = async ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: shift, error } = await supabase.from('shift').select(`*`);

  return shift;
};

export const getShift = async (id: number, { request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: shift, error } = await supabase
    .from('shift')
    .select(`*`)
    .eq('id', id)
    .single();

  return shift;
};

export const getActivities = async (
  shiftId: string,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: activities, error } = await supabase
    .from('activity')
    .select(`*`)
    .eq('shift', shiftId);

  return activities;
};

export const getWarningPoints = async (
  shiftId: string,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: warningPoints, error } = await supabase
    .from('warningpoint')
    .select(`*`)
    .eq('shift', shiftId);

  return warningPoints;
};

export const postShift = async ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  const { data: shift } = await supabase.from('shift').insert({}).select();

  return shift;
};

export const getUsername = async (
  id: string,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: profile, error } = await supabase
    .from('profile')
    .select(`username`)
    .eq('id', id)
    .single();

  return profile;
};

export const toogleBasic = async (
  id: number,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  await supabase.from('shift').update({ is_basic_done: true }).eq('id', id);
};

export const endShift = async (id: number, { request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .replace(/\.\d{3}/, '')
    .replace('Z', '+00:00');
  await supabase.from('shift').update({ end_at: formattedDate }).eq('id', id);
};

export const deleteShift = async (
  id: number,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  await supabase.from('shift').delete().eq('id', id);
};

export const login = async ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  const { email, password } = Object.fromEntries(await request.formData());
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email),
    password: String(password),
  });

  return error;
};

export const logout = ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  supabase.auth.signOut();
};

export const getSession = async ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
};

import { Database } from 'db_types';
import CreateServersupabase from 'supabase.server';

const formattedDate = (currentDate: Date) =>
  currentDate
    .toISOString()
    .replace(/\.\d{3}/, '')
    .replace('Z', '+00:00');

type ApiCall = {
  request: Request;
  response: Response;
};

export const getShifts = async ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: shift, error } = await supabase
    .from('shift')
    .select(`*, profiles(*)`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return shift;
};

export const getShift = async (id: number, { request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: shift, error } = await supabase
    .from('shift')
    .select(`*, profiles(*)`)
    .eq('id', id)
    .single();

  if (!shift)
    throw new Response('Shift not found', {
      status: 404,
      statusText: 'Not found',
    });

  if (error) throw new Error(error.message);

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
    .eq('shift', shiftId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return activities;
};

export const getAllActivities = async (
  shiftId: string,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: activities, error } = await supabase
    .from('activity')
    .select(`*, shift(*, profiles(*))`)
    .eq('shift', shiftId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return activities;
};

export const postShift = async (
  { request, response }: ApiCall,
  end: string,
  start: string
) => {
  const supabase = CreateServersupabase({ request, response });

  const { data: shift, error } = await supabase
    .from('shift')
    .insert({
      start_at: start,
      end_at: end,
    })
    .select();

  if (error) throw new Error(error.message);

  return shift;
};

export const postActivity = async (
  shiftId: number,
  values: any,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });

  const { data: activity, error } = await supabase
    .from('activity')
    .insert({
      ...values,
      shift: shiftId,
    })
    .select();

  if (error) throw new Error(error.message);

  return activity;
};

export const deleteActivity = async (
  activityId: number,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  const { error } = await supabase
    .from('activity')
    .delete()
    .eq('id', activityId);

  if (error) throw new Error(error.message);
};

export const updateActivity = async (
  activityId: number,
  values: any,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  const { data: activity, error } = await supabase
    .from('activity')
    .update({ ...values })
    .eq('id', activityId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return activity;
};

export const getActivity = async (
  activityId: number,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  const { data: activity, error } = await supabase
    .from('activity')
    .select('*')
    .eq('id', activityId)
    .single();

  if (error) throw new Error(error.message);

  if (!activity)
    throw new Response('warning not found', {
      status: 404,
      statusText: 'Not found',
    });

  return activity;
};

export const getActivityStateCount = async (
  { request, response }: ApiCall,
  state: Database['public']['Enums']['state']
) => {
  const supabase = CreateServersupabase({ request, response });
  const { error, count } = await supabase
    .from('activity')
    .select('*', { count: 'exact', head: true })
    .eq('state', state);

  if (error) throw new Error(error.message);

  return count;
};

export const getCurrentUserProfile = async (
  id: string,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  let { data: profile, error } = await supabase
    .from('profiles')
    .select(`*`)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  if (!profile)
    throw new Response('Profile not found', {
      status: 404,
      statusText: 'Not found',
    });

  return profile;
};

export const toogleBasic = async (
  id: number,
  checked: boolean,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  const { error } = await supabase
    .from('shift')
    .update({ is_basic_done: !checked })
    .eq('id', id);

  if (error) throw new Error(error.message);
};

export const toogleRoom = async (
  id: number,
  checked: boolean,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  const { error } = await supabase
    .from('shift')
    .update({ is_room_checked: !checked })
    .eq('id', id);

  if (error) throw new Error(error.message);
};

export const toogleAlarm = async (
  id: number,
  checked: boolean,
  { request, response }: ApiCall
) => {
  const supabase = CreateServersupabase({ request, response });
  const { error } = await supabase
    .from('shift')
    .update({ is_alarm_checked: !checked })
    .eq('id', id);

  if (error) throw new Error(error.message);
};

export const endShift = async (id: number, { request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  const currentDate = new Date();
  await supabase
    .from('shift')
    .update({ end_at: formattedDate(currentDate) })
    .eq('id', id);
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

export const signUp = async ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  const { email, password, fullName, username } = Object.fromEntries(
    await request.formData()
  );

  const { data, error } = await supabase.auth.signUp({
    email: String(email),
    password: String(password),
    options: {
      data: {
        username: String(username),
        full_name: String(fullName),
      },
    },
  });

  if (error) throw new Error(error.message);

  console.log(error);

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

export const getRecentIssues = async ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });
  const { data, error } = await supabase
    .from('activity')
    .select(`*, shift(*, profiles(*))`)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);

  return data;
};

export const upDatePassword = async ({ request, response }: ApiCall) => {
  const supabase = CreateServersupabase({ request, response });

  const { newPassword, password, email } = Object.fromEntries(
    await request.formData()
  );
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email),
    password: String(password),
  });

  if (!error) {
    const { data, error } = await supabase.auth.updateUser({
      password: String(newPassword),
    });

    console.log(error);

    if (error) throw new Error(error.message);
    return error;
  }
};

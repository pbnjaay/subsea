import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import Loader from '~/components/loader';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import {
  getCurrentUserProfile,
  getImageUrl,
  getSession,
  supabaseUploadHandler,
  updateProfile,
} from '~/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useRef } from 'react';
import { Download } from 'lucide-react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const session = await getSession({ request, response });
  const profile = await getCurrentUserProfile(session.user.id, {
    request,
    response,
  });

  const imageUrl = getImageUrl(`${profile.username}_profile.jpg`, {
    request,
    response,
  });
  return json({ imageUrl, profile }, { headers: response.headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const session = await getSession({ request, response });
  const profile = await getCurrentUserProfile(session.user.id, {
    request,
    response,
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    supabaseUploadHandler(`${profile.username}_profile.jpg`, {
      request,
      response,
    })
  );

  const imageUrl = getImageUrl(`${profile.username}_profile.jpg`, {
    request,
    response,
  });

  formData.set('avatar_url', imageUrl);
  const { fullName, username, avatar_url } = Object.fromEntries(formData);

  if (session) {
    updateProfile(
      session?.user.id,
      String(fullName),
      String(username),
      String(avatar_url),
      { request, response }
    );
  }

  return json({}, { headers: response.headers });
};

const ProfileForm = () => {
  const navigation = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { imageUrl, profile } = useLoaderData<typeof loader>();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          C'est ainsi que les autres vous verront sur le site.
        </p>
      </div>
      <Separator />
      <Form className="space-y-4" method="post" encType="multipart/form-data">
        <div className="flex flex-col gap-y-2">
          <Label className="font-medium" htmlFor="fullName">
            Nom complet
          </Label>
          <Input
            name="fullName"
            type="text"
            defaultValue={profile.full_name || ''}
            required
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label className="font-medium" htmlFor="username">
            Nom d'utilisateur
          </Label>
          <Input
            name="username"
            type="text"
            required
            defaultValue={profile.username || ''}
          />
        </div>
        <div className="flex">
          <input hidden name="avatar_url" ref={inputRef} type="file" />
          <Button
            className="flex items-center space-x-2"
            variant={'outline'}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <Download className="w-4 h-4" />
            <span>Téléverser une image</span>
          </Button>
          <Avatar className="ml-4">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex space-x-4">
          <Button type="submit">
            {navigation.state === 'submitting' ? <Loader /> : 'Enregistrer'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileForm;

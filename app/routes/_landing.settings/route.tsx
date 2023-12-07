import { Outlet, useNavigation } from '@remix-run/react';
import { useToast } from '~/components/ui/use-toast';
import Layout from './layout';

const ProfilePage = () => {
  const { toast } = useToast();
  const navigation = useNavigation();

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProfilePage;

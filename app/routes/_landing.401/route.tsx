import { useNavigate } from '@remix-run/react';
import React from 'react';
import { Button } from '~/components/ui/button';

const Unauthorize = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col space-y-4 justify-center items-center text-2xl font-semibold texpri">
      <p>401 | Unauthorized</p>
      <Button variant={'secondary'} onClick={() => navigate(-1)}>
        Retour
      </Button>
    </div>
  );
};

export default Unauthorize;

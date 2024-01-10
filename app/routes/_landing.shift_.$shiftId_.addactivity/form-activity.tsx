import { Form, useNavigate, useNavigation } from '@remix-run/react';
import Loader from '~/components/loader';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';

const FormActivity = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  return (
    <Card className="md:w-1/2 w-full">
      <CardHeader>
        <CardTitle>Ajouter une nouvelle activité</CardTitle>
        <CardDescription>
          Crée une activité rapidement en remplissant ce formulaire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form className="space-y-4" method="post">
          <div className="flex space-x-4">
            <Select name="system" required>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Système" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAT3">Sat3</SelectItem>
                <SelectItem value="MAINONE">Mainone</SelectItem>
                <SelectItem value="RAFIA">Rafia</SelectItem>
                <SelectItem value="ACE">Ace</SelectItem>
              </SelectContent>
            </Select>
            <Select name="type" required>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLAINTE">Plainte</SelectItem>
                <SelectItem value="CALL_ID">Call ID</SelectItem>
                <SelectItem value="SIGNALISATION">Signalisation</SelectItem>
                <SelectItem value="INCIDENT">Incident</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
            <Select name="state" required>
              <SelectTrigger>
                <SelectValue placeholder="Etat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Ouvert</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="CLOSED">Fermer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" />
          </div>
          <div className="space-x-2">
            <Button
              disabled={navigation.state === 'submitting'}
              type="submit"
              value="createActivity"
              name="_action"
            >
              {navigation.state === 'submitting' ? <Loader /> : 'Ajouter'}
            </Button>
            <Button
              type="button"
              variant={'secondary'}
              onClick={() => navigate(-1)}
            >
              Annuler
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormActivity;

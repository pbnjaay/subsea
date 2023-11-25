import { Form, useNavigate, useNavigation } from '@remix-run/react';
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

const FormWarning = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add new warning</CardTitle>
        <CardDescription>Create quickly a warning</CardDescription>
      </CardHeader>
      <CardContent>
        <Form className="space-y-4" method="post">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" required />
          </div>
          <div className="flex space-x-4">
            <Select name="system" required>
              <SelectTrigger>
                <SelectValue placeholder="System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sat3">Sat3</SelectItem>
                <SelectItem value="mainone">Mainone</SelectItem>
                <SelectItem value="rafia">Rafia</SelectItem>
                <SelectItem value="ace">Ace</SelectItem>
              </SelectContent>
            </Select>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="signalisation">Signalisation</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
              </SelectContent>
            </Select>
            <Select name="state" required>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in progress">In progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" />
          </div>
          <div className="space-x-2">
            <Button type="submit" value="createWarning" name="_action">
              {navigation.state === 'submitting' ? 'submitting' : 'submit'}
            </Button>
            <Button
              type="button"
              variant={'secondary'}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormWarning;

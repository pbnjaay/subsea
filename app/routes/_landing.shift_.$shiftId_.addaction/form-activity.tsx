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

const FormActivity = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add new activity</CardTitle>
        <CardDescription>Create quickly a activity</CardDescription>
      </CardHeader>
      <CardContent>
        <Form className="space-y-4" method="post">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" type="text" required />
          </div>
          <div className="flex space-x-4">
            <Select name="system" required>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claim">Claim</SelectItem>
                <SelectItem value="callID">Call ID</SelectItem>
                <SelectItem value="instance">Instance</SelectItem>
                <SelectItem value="other">Divers</SelectItem>
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

export default FormActivity;

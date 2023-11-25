import { Form } from '@remix-run/react';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

const EditFormActivity = ({ shiftId }: { shiftId: number }) => {
  return (
    <Form
      className="space-y-4"
      method="post"
      action={`/shift/${shiftId}/addactivity`}
    >
      <div className="space-y-2">
        <Label>Title</Label>
        <Input name="title" type="text" />
      </div>
      <div className="flex space-x-4">
        <Select name="system">
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
        <Select name="type">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="plainte">Plainte</SelectItem>
            <SelectItem value="callID">Call ID</SelectItem>
            <SelectItem value="instance">Instance</SelectItem>
            <SelectItem value="divers">Divers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea name="description" />
      <Button>Submit</Button>
    </Form>
  );
};

export default EditFormActivity;

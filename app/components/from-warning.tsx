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

const FormWarning = ({ shiftId }: { shiftId: number }) => {
  return (
    <Form
      className="space-y-4"
      method="post"
      action={`/shift/${shiftId}/addwarning`}
    >
      <div className="flex space-x-4">
        <Select>
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
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="signalisation">Signalisation</SelectItem>
            <SelectItem value="incident">Incident</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in progress">In progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea />
      <Button>Submit</Button>
    </Form>
  );
};

export default FormWarning;

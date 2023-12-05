import {
  Heading,
  Section,
  Text,
  Container,
  Head,
  Body,
  Preview,
  Row,
  Column,
  Html,
  Tailwind,
  Hr,
  Button,
} from '@react-email/components';
import React from 'react';

import { Activity } from '~/routes/_landing.shift_.$shiftId/action';
import { Profile } from '~/routes/_landing/header';
import { formateDate } from '~/services/utils';

interface Shift {
  created_at: string;
  end_at: string | null;
  start_at: string | null;
  id: number;
  is_alarm_checked: boolean | null;
  is_basic_done: boolean | null;
  is_room_checked: boolean | null;
  supervisor: string | null;
  profiles: Profile | null;
}

const Email = ({
  activities,
  shift,
}: {
  activities: Activity[] | null;
  shift: Shift | null;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Rapport d'activité centre des cables sous-marins</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Text>
              <span className="font-semibold">Agent:</span>{' '}
              {shift?.profiles?.full_name}
            </Text>
            <Text>
              <span className="font-semibold">Heure de debut:</span>{' '}
              {formateDate(new Date(shift?.start_at as string))}
            </Text>
            <Text>
              <span className="font-semibold">Heure de fin:</span>{' '}
              {formateDate(new Date(shift?.end_at as string))}
            </Text>
            <Text>
              <span className="font-semibold">Verification des alarmes:</span>{' '}
              <span>
                {shift?.is_alarm_checked ? 'Executées' : 'Non Executées'}
              </span>
            </Text>
            <Text>
              <span className="font-semibold">Basique quotidienne:</span>{' '}
              <span>
                {shift?.is_basic_done ? 'Executées' : 'Non Executées'}
              </span>
            </Text>
            <Text>
              <span className="font-semibold">
                Ronde salle technique en fin de vacation:
              </span>{' '}
              <span>
                {shift?.is_room_checked ? 'Executées' : 'Non Executées'}
              </span>
            </Text>
            <Section>
              <Heading className="text-black text-[24px] font-normal p-0 my-[0px] mx-0 mb-4">{`Liste des activités (${activities?.length})`}</Heading>
              {activities?.length ? (
                <ul>
                  {activities.map((activity, i) => (
                    <li>
                      <Text>{activity.title}</Text>
                      <Text>{activity.description}</Text>
                      <Text>Systeme: {activity.system}</Text>
                      <Text>Etat: {activity.state}</Text>
                      <Text>Type: {activity.type}</Text>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text>Pas d'incidents en cours</Text>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Email;

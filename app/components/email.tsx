import { Activity } from '@prisma/client';
import {
  Heading,
  Section,
  Text,
  Head,
  Body,
  Preview,
  Html,
} from '@react-email/components';
import { Shifts } from '~/routes/_landing.shift/columns';

import { formateDate } from '~/services/utils';

const Email = ({
  activities,
  shift,
}: {
  activities: Activity[] | undefined;
  shift: Shifts | null | undefined;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Rapport d'activité centre des cables sous-marins</Preview>
      <Body>
        <Text>
          <span style={{ fontWeight: 600 }}>Agent:</span>{' '}
          {shift?.supervisor?.fullName}
        </Text>
        {shift && (
          <>
            <Text>
              <span style={{ fontWeight: 600 }}>Heure de debut:</span>{' '}
              {formateDate(shift.startAt)}
            </Text>
            <Text>
              <span style={{ fontWeight: 600 }}>Heure de fin:</span>{' '}
              {formateDate(shift.endAt)}
            </Text>
          </>
        )}
        <Text>
          <span style={{ fontWeight: 600 }}>Verification des alarmes:</span>{' '}
          <span>{shift?.isAlarmChecked ? '✅' : '⛔'}</span>
        </Text>
        <Text>
          <span style={{ fontWeight: 600 }}>Basique quotidienne:</span>{' '}
          <span>{shift?.isBasicDone ? '✅' : '⛔'}</span>
        </Text>
        <Text>
          <span style={{ fontWeight: 600 }}>
            Ronde salle technique en fin de vacation:
          </span>{' '}
          <span>{shift?.isRoomChecked ? '✅' : '⛔'}</span>
        </Text>
        <Section>
          <Heading
            style={{
              fontSize: '24px',
              fontWeight: 400,
              padding: 0,
              marginTop: 0,
              marginBottom: '16px',
            }}
          >{`Liste des activités (${activities?.length})`}</Heading>
          {activities?.length ? (
            <ul>
              {activities.map((activity, i) => (
                <li>
                  <Text>Systeme: {activity.system}</Text>
                  <Text>Etat: {activity.state}</Text>
                  <Text>Type: {activity.type}</Text>
                  {activity.description && (
                    <Text>Description {activity.description}</Text>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <Text>Pas d'incidents en cours</Text>
          )}
        </Section>
      </Body>
    </Html>
  );
};

export default Email;

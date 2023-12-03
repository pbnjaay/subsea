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

const Email = (props: {
  activities: Activity[] | null;
  shift: Shift | null;
}) => {
  const { activities, shift } = props;
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
                <Container>
                  {activities.map((activity, i) => (
                    <Row key={i}>
                      <Row className="rounded-md mb-[20px]">
                        <Row>
                          <Column>
                            <Text className="text-[20px] m-0">
                              {activity.title}
                            </Text>
                          </Column>
                        </Row>
                        <Row>
                          {activity.description ? (
                            <Column>
                              <Text className="leading-[24px]">
                                {activity.description}
                              </Text>
                            </Column>
                          ) : (
                            <Column>
                              <Text>Pas de commentaire</Text>
                            </Column>
                          )}
                        </Row>
                        <Row>
                          <Column align="right" rowSpan={1}>
                            <span className="px-3 py-1 rounded bg-[#fa8a3d] text-white font-semibold text-[12px]">
                              {activity.system}
                            </span>
                          </Column>
                          <Column align="center" rowSpan={2}>
                            <span className="px-3 py-1 rounded bg-[#fa8a3d] text-white font-semibold text-[12px]">
                              {activity.type}
                            </span>
                          </Column>
                          <Column align="left" rowSpan={2}>
                            <span className="px-3 py-1 rounded bg-[#fa8a3d] text-white font-semibold text-[12px]">
                              {activity.state}
                            </span>
                          </Column>
                        </Row>
                      </Row>
                      {i < activities.length - 1 && (
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                      )}
                    </Row>
                  ))}
                </Container>
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

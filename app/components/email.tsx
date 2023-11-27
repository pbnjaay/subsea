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

const Email = (props: { activities: Activity[] | null }) => {
  const { activities } = props;
  return (
    <Html>
      <Head />
      <Preview>Rapport d'activité centre des cables sous-marins</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Text>Bonjour, </Text>
            <Section>
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[0px] mx-0 mb-4">{`Liste des activités (${activities?.length})`}</Heading>
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
                            <Button className="px-3 py-1 rounded bg-[#fa8a3d] text-white font-semibold text-[12px]">
                              {activity.system}
                            </Button>
                          </Column>
                          <Column align="center" rowSpan={2}>
                            <Button className="px-3 py-1 rounded bg-[#fa8a3d] text-white font-semibold text-[12px]">
                              {activity.type}
                            </Button>
                          </Column>
                          <Column align="left" rowSpan={2}>
                            <Button className="px-3 py-1 rounded bg-[#fa8a3d] text-white font-semibold text-[12px]">
                              {activity.state}
                            </Button>
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
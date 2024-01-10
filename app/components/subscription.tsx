import {
  Text,
  Container,
  Head,
  Body,
  Preview,
  Html,
} from '@react-email/components';

interface User {
  id: number;
  email: string;
  password: string;
  salt: string;
  fullName: string;
  isAdmin: boolean;
  username: string;
  createdAt: Date;
}

const SubscriptionEmail = ({ user }: { user: User }) => {
  return (
    <Html>
      <Head />
      <Preview>Informations de connexions</Preview>
      <Body>
        <Container>
          <Text>
            Bonjour {user.fullName} et bienvenue, Veuillez recevoir vos
            informations de connexions.
          </Text>
          <Text>
            <span>Non d'utilsateur:</span> {user.username}
          </Text>
          <Text>
            <span>Mot de passe:</span> {user.password}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default SubscriptionEmail;

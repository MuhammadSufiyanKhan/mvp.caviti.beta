import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface InvoiceEmailProps {
  planName?: string;
  amount?: string;
}

export const InvoiceEmail = ({
  planName = 'Launch Tier',
  amount = '$29.00',
}: InvoiceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Invoice for your Caviti.io subscription</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Invoice for Caviti.io</Heading>
          <Text style={paragraph}>
            Thank you for your business! Here are the details of your recent charge:
          </Text>
          <Section style={detailsContainer}>
            <Text style={detailText}>Plan: {planName}</Text>
            <Text style={detailText}>Total: {amount}</Text>
          </Section>
          <Button href="https://caviti.io/dashboard" style={button}>
            View your dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#0a0a0a',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  color: '#ffffff',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#ffffff',
  textAlign: 'center' as const,
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#a3a3a3',
  textAlign: 'center' as const,
};

const detailsContainer = {
  backgroundColor: '#171717',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const detailText = {
  fontSize: '18px',
  margin: '8px 0',
  color: '#ffffff',
  fontWeight: '600',
};

const button = {
  backgroundColor: '#ffffff',
  borderRadius: '5px',
  color: '#000',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  fontWeight: '600',
};

export default InvoiceEmail;

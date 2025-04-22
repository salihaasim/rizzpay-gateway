
# RizzPay OpenAI Integration

This directory contains documentation and utilities for OpenAI integration with RizzPay.

## Overview

RizzPay uses OpenAI to provide intelligent assistance through Aasimo AI, our documentation assistant. The integration leverages Supabase Edge Functions to securely call the OpenAI API without exposing credentials.

## Capabilities

Aasimo AI provides the following capabilities:
- Answer questions about RizzPay's payment systems
- Explain technical documentation
- Provide integration guidance
- Explain RizzPay's features and capabilities
- Assist with troubleshooting common issues

## How It Works

1. User queries are sent from the frontend to a Supabase Edge Function
2. The Edge Function securely calls OpenAI's API with our system prompt
3. Responses are formatted and returned to the frontend
4. The conversation history is maintained in the frontend session

## Implementation

The integration uses the following components:
- `supabase/functions/aasimo-ai/index.ts`: Edge function that calls OpenAI
- `src/components/admin/AasimoAI.tsx`: Frontend chat interface
- `src/pages/AdminAasimoAI.tsx`: Admin page wrapper for Aasimo AI

## Model Configuration

We currently use the following OpenAI model configuration:
- Model: gpt-4o-mini
- Temperature: 0.7
- System prompt: Specialized for RizzPay documentation assistance

## Security Considerations

- OpenAI API keys are stored as Supabase secrets
- All API communication happens server-side via Edge Functions
- User queries and model responses are not permanently stored

/* eslint-disable @typescript-eslint/naming-convention */
import { model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class AuthRedirectRequestDTO {
  @property({ type: 'string', required: false }) code?: string;
  @property({ type: 'string', required: true }) state: string;
  @property({ type: 'string', required: false }) error?: string;
  @property({ type: 'string', required: false }) session_state?: string;
  [key: string]: string | number | undefined;
}

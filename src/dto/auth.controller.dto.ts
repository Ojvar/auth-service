import { model, property } from '@loopback/repository';

@model()
export class AuthRedirectRequestDTO {
  @property({ type: 'string' }) code: string;
  @property({ type: 'string' }) state: string;
  @property({ type: 'string' }) error: string;
}

/* eslint-disable @typescript-eslint/naming-convention */
export class AuthRedirectDTO {
  [key: string]: unknown;
  code: string;
  client_info: string;
  state: string;
  session_state: string;
}

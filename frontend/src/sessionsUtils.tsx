export interface tokenForm {
    id: number;
    access_token: string;
    twoFaEnabled: boolean;
  }
  
export function setSessionToken(tokenObj: any) {
    sessionStorage.setItem('token', JSON.stringify(tokenObj));
  }
  
export function getSessionsToken() {
    const tokenObj = sessionStorage.getItem('token')
    try {
      return JSON.parse(tokenObj!);
    } catch (e) {
      return tokenObj;
    }
  }

export function removeSessionsToken() {
    sessionStorage.clear()
  }

export function isSessionTokenSet() {
  if (sessionStorage.getItem('token') === null) {
    return false
  }
  return true
}
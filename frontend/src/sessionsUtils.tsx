import jwtDecode from 'jwt-decode';
import { TokenInterface } from './components/messages/types';
import { tokenForm } from './interfaceUtils';

export function setSessionToken(tokenObj: any) {
    sessionStorage.setItem('token', JSON.stringify(tokenObj));
  }

export async function getSessionsToken() {
  const tokenStr = sessionStorage.getItem('token')
  const tokenObj = JSON.parse(tokenStr!)
  if (!tokenObj)
    return null;
  const tokenDecoded = jwtDecode(tokenObj.accessToken) as TokenInterface
  if (!tokenDecoded)
    return null;
  const accessTokenExp = tokenDecoded.exp;
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = accessTokenExp - now;

  if (timeLeft < 30) {
    const res = await fetch('http://localhost:3001/auth/refresh-token', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({refreshToken: tokenObj.refreshToken})
    });
    const result = await res.json();
      if (res.ok) {
          setSessionToken(result);
          return result
      }
      else
        window.location.reload();
  }
  return tokenObj;
}

export function getAccessSessionsPayload() {
    const tokenStr = sessionStorage.getItem('token')
    const tokenObj = JSON.parse(tokenStr!)
    const decodedAccessToken = jwtDecode(tokenObj.accessToken);
    try {
      return decodedAccessToken;
    } catch (e) {
      return null;
    }
}


export function removeSessionsToken() {
    sessionStorage.clear()
  }

export function isSessionTokenSet() {
  const tokenObj = sessionStorage.getItem('token')
  if (tokenObj === null)
    return false
  if (JSON.parse(tokenObj).accessToken)
    return true
}
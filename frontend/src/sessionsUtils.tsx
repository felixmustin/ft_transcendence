import jwtDecode from 'jwt-decode';
import { tokenForm } from './interfaceUtils';

export function setSessionToken(tokenObj: any) {
    sessionStorage.setItem('token', JSON.stringify(tokenObj));
  }

export async function getSessionsToken() {

  const tokenStr = sessionStorage.getItem('token')
  const tokenObj = JSON.parse(tokenStr!)
  if (!tokenObj)
    return null;
  const accessTokenExp = jwtDecode(tokenObj.accessToken).exp;
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = accessTokenExp - now;
  console.log("ici")
  console.log(timeLeft)
  if (timeLeft < 300) {
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
        console.log("Couldnt refresh token")
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
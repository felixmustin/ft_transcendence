export interface tokenForm {
  accessToken: string;
  refreshToken: string;
}
// export interface payloadForm {
//     id: number;
//     twoFaEnabled: boolean;
//     expiresIn: any;
//   }

export interface LoginForm {
    loginName: string;
    wordpass: string;
  }

export interface SignupForm {
    email: string;
    firstname: string;
    lastname: string;
    age: number;
  }

export interface Code2FA {
    code: string;
  }

export interface UsernameInput {
    username: string;
  }
  
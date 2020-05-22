interface IAuthUser {
  user_id: string;
  role: 'user' | 'agent';
}
export default interface ITokenProvider {
  generateToken({ user_id, role }: IAuthUser): string;
}

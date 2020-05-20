interface IAuthUser {
  user_id: string;
  role: 'user' | 'agent' | 'admin';
}
export default interface ITokenProvider {
  generateToken({ user_id, role }: IAuthUser): string;
}

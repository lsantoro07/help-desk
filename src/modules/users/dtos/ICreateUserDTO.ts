export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'agent';
}

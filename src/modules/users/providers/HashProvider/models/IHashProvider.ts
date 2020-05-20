export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(paylog: string, hashed: string): Promise<boolean>;
}

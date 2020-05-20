import ISendMailDTO from '../dtos/ISendMailDTO';
import ISendMultipleMailDTO from '../dtos/ISendMultipleMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private email: ISendMailDTO[] = [];

  private multipleEmail: ISendMultipleMailDTO[] = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.email.push(message);
  }

  public async sendMultipleMails(message: ISendMultipleMailDTO): Promise<void> {
    this.multipleEmail.push(message);
  }
}

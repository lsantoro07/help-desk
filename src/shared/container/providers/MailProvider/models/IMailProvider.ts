import ISendMailDTO from '../dtos/ISendMailDTO';
import ISendMultipleMailDTO from '../dtos/ISendMultipleMailDTO';

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
  sendMultipleMails(data: ISendMultipleMailDTO): Promise<void>;
}

// import { Request, Response } from 'express';
// import { container } from 'tsyringe';

// export default class ArticlesTicketController {
//   public async create(request: Request, response: Response): Promise<Response> {
//     const user_id = request.user.id;
//     const { ticket_id } = request.params;
//     const { description } = request.body;

//     const createArticle = container.resolve(CreateTicketArticleService);

//     const article = await createArticle.execute({
//       user_id,
//       ticket_id,
//       description,
//     });

//     return response.json(article);
//   }
// }

import { User } from '../shared/user.interface';
import { Book } from '../shared/book.interface';

export interface Request {
    uid: string;
    user1: User;
    user2: User;
    book1: Book;
    book2: Book;
    meet_point: string;
    loan_date: Date;
    return_date: Date;
    state: string;
}
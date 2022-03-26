export interface Trade {
    uid: string;
    idUser1: string;
    idUser2: string;
    idBook1: string;
    idBook2: string;
    meet_point: string;
    loan_date: Date;
    return_date: Date;
    state: string;
}